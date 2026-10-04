/**
 * The persisted part of the app state, without React, so its ordering rules can
 * be unit-tested.
 *
 * Every read-modify-write goes through ONE serialized queue: each task computes
 * `next` from the last COMMITTED value (not from a render closure or from an
 * optimistic UI value), writes it, and only then commits it. Without the queue,
 * two writes in flight can land out of order and the older one resurrects what
 * the newer one deleted (e.g. "Apagar" a game result while a save is pending,
 * or a bookmark toggle landing after "Apagar dados deste aparelho").
 */
import { isValidGameAChoice, type GameAChoices } from '@/data/games';

import { isFeedbackMap, type Feedback, type FeedbackMap } from './feedback';
import { isPrefs, isValidDateString, isValidInterestPick, type EditablePrefs, type Prefs } from './prefs';
import { KEYS, clearAll, load, save } from './storage';

/**
 * A game A result kept by an explicit "Guardar este resultado" (spec §4.5, §6).
 * Only pair/option ids — the summary is recomputed on display, never stored as text.
 */
export type SavedGameAResult = { savedAt: string; choices: GameAChoices };

export function isIdList(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string');
}

export function isGameAResults(v: unknown): v is SavedGameAResult[] {
  return (
    Array.isArray(v) &&
    v.every((r) => {
      if (typeof r !== 'object' || r === null) return false;
      const { savedAt, choices } = r as Record<string, unknown>;
      return (
        isValidDateString(savedAt) &&
        typeof choices === 'object' &&
        choices !== null &&
        !Array.isArray(choices) &&
        Object.entries(choices).every(([k, o]) => (o === null || typeof o === 'string') && isValidGameAChoice(k, o))
      );
    })
  );
}

/**
 * A promise-chain mutex: tasks run one at a time, in call order. A failed task
 * rejects its own promise only — the next task still runs.
 */
export function createWriteQueue() {
  let tail: Promise<void> = Promise.resolve();
  return function enqueue<T>(task: () => Promise<T>): Promise<T> {
    const run = tail.then(task);
    tail = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  };
}

export type Snapshot = {
  prefs: Prefs | undefined;
  savedIds: readonly string[];
  gameAResults: readonly SavedGameAResult[];
  feedback: FeedbackMap;
};

const empty: Snapshot = { prefs: undefined, savedIds: [], gameAResults: [], feedback: {} };

/** `idle`: no other write is waiting in the queue after this one. */
export type CommitListener = (snapshot: Snapshot, info: { idle: boolean }) => void;

export function createAppStore(onCommit: CommitListener = () => {}) {
  const enqueue = createWriteQueue();
  let committed: Snapshot = empty;
  let pending = 0;

  /** Runs `task` in the queue; whatever it returns becomes the committed snapshot. */
  function write(task: (cur: Snapshot) => Promise<Snapshot>): Promise<Snapshot> {
    pending += 1;
    return enqueue(async () => {
      try {
        committed = await task(committed);
        onCommit(committed, { idle: pending === 1 });
        return committed;
      } finally {
        pending -= 1;
      }
    });
  }

  return {
    get committed(): Snapshot {
      return committed;
    },

    /**
     * Startup read — queued first, so no write can run against unloaded values.
     * Never rejects: a storage error is logged and the app starts empty, so the
     * splash screen can always close.
     */
    init(): Promise<Snapshot> {
      return write(async () => {
        try {
          const [prefs, savedIds, gameAResults, feedback] = await Promise.all([
            load(KEYS.prefs, isPrefs),
            load(KEYS.saved, isIdList),
            load(KEYS.gameAResults, isGameAResults),
            load(KEYS.feedback, isFeedbackMap),
          ]);
          return { prefs, savedIds: savedIds ?? [], gameAResults: gameAResults ?? [], feedback: feedback ?? {} };
        } catch (e) {
          console.error('[storage] could not read the stored data at startup; starting empty.', e);
          return empty;
        }
      });
    },

    completeOnboarding(p: EditablePrefs, now: Date = new Date()): Promise<Snapshot> {
      return write(async (cur) => {
        if (!isValidInterestPick(p.interests.length)) throw new Error(`invalid interest count: ${p.interests.length}`);
        const prefs: Prefs = { interests: [...p.interests], availability: p.availability, adultConfirmed: true, onboardedAt: now.toISOString() };
        await save(KEYS.prefs, prefs);
        return { ...cur, prefs };
      });
    },

    /** Interests/availability only; the onboarding date and 18+ confirmation are kept. */
    updatePrefs(p: EditablePrefs): Promise<Snapshot> {
      return write(async (cur) => {
        if (!cur.prefs) throw new Error('updatePrefs called before onboarding');
        if (!isValidInterestPick(p.interests.length)) throw new Error(`invalid interest count: ${p.interests.length}`);
        const prefs: Prefs = { ...cur.prefs, interests: [...p.interests], availability: p.availability };
        await save(KEYS.prefs, prefs);
        return { ...cur, prefs };
      });
    },

    /** Idempotent: sets whether `id` is saved (a toggle is decided by the caller from what she saw). */
    setSaved(id: string, saved: boolean): Promise<Snapshot> {
      return write(async (cur) => {
        const has = cur.savedIds.includes(id);
        if (has === saved) return cur;
        const savedIds = saved ? [id, ...cur.savedIds] : cur.savedIds.filter((x) => x !== id);
        await save(KEYS.saved, savedIds);
        return { ...cur, savedIds };
      });
    },

    saveGameAResult(choices: GameAChoices, now: Date = new Date()): Promise<Snapshot> {
      return write(async (cur) => {
        // savedAt is the result's id: two saves in the same millisecond must not collide.
        let t = now.getTime();
        while (cur.gameAResults.some((r) => r.savedAt === new Date(t).toISOString())) t += 1;
        const gameAResults = [{ savedAt: new Date(t).toISOString(), choices: { ...choices } }, ...cur.gameAResults];
        await save(KEYS.gameAResults, gameAResults);
        return { ...cur, gameAResults };
      });
    },

    removeGameAResult(savedAt: string): Promise<Snapshot> {
      return write(async (cur) => {
        const gameAResults = cur.gameAResults.filter((r) => r.savedAt !== savedAt);
        await save(KEYS.gameAResults, gameAResults);
        return { ...cur, gameAResults };
      });
    },

    /**
     * Spec §6 — sets her answer about one activity, or removes it (`undefined`). Idempotent:
     * the caller decides from what she tapped, so a repeated tap writes nothing.
     */
    setFeedback(id: string, value: Feedback | undefined): Promise<Snapshot> {
      return write(async (cur) => {
        if (cur.feedback[id] === value) return cur;
        const feedback: Record<string, Feedback> = { ...cur.feedback };
        if (value === undefined) delete feedback[id];
        else feedback[id] = value;
        await save(KEYS.feedback, feedback);
        return { ...cur, feedback };
      });
    },

    /** Removes every feedback answer (Preferências "Remover todas"); the rest is kept. */
    clearFeedback(): Promise<Snapshot> {
      return write(async (cur) => {
        if (Object.keys(cur.feedback).length === 0) return cur;
        await save(KEYS.feedback, {});
        return { ...cur, feedback: {} };
      });
    },

    /** Spec §10.3 — queued like every write, so nothing queued before it can land after it. */
    eraseAll(): Promise<Snapshot> {
      return write(async () => {
        await clearAll();
        return empty;
      });
    },
  };
}

export type AppStore = ReturnType<typeof createAppStore>;
