/**
 * App state that survives restarts: onboarding preferences, saved activities and
 * the game A results the user explicitly chose to keep.
 * Loaded once at startup (the splash screen stays up until `ready`), written
 * through on every change. Device-only — see storage.ts.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import type { Category } from '@/data/activities';
import { isValidGameAChoice, type GameAChoices } from '@/data/games';
import type { TimeChoice } from '@/lib/recommend';

import { KEYS, clearAll, load, save } from './storage';

/** Spec §4.1 step 4 — the interest options, verbatim. */
export const interestOptions = [
  { id: 'aprender', label: 'Aprender', category: 'aprender' },
  { id: 'criar', label: 'Criar', category: 'criar' },
  { id: 'sair', label: 'Sair', category: 'sair' },
  { id: 'relacoes', label: 'Relações', category: 'conectar' },
  { id: 'estudos', label: 'Estudos', category: 'aprender' },
  { id: 'cultura', label: 'Cultura', category: 'explorar' },
  { id: 'movimento', label: 'Movimento leve', category: 'sair' },
  { id: 'casa', label: 'Casa', category: 'organizar' },
  { id: 'amizades', label: 'Amizades', category: 'conectar' },
  { id: 'trabalho', label: 'Trabalho e projetos', category: 'organizar' },
  { id: 'viagens', label: 'Viagens', category: 'explorar' },
] as const satisfies readonly { id: string; label: string; category: Category }[];

export type InterestId = (typeof interestOptions)[number]['id'];

export type Prefs = {
  onboardedAt: string; // ISO date
  adultConfirmed: true; // spec §4.1 step 3 — a yes/no confirmation, never a birth date
  interests: InterestId[];
  availability?: TimeChoice;
};

const interestIds = new Set<string>(interestOptions.map((o) => o.id));
const timeChoices = new Set<string>(['5-10', '15-30', '60', 'livre']);

function isPrefs(v: unknown): v is Prefs {
  if (typeof v !== 'object' || v === null) return false;
  const p = v as Record<string, unknown>;
  return (
    typeof p.onboardedAt === 'string' &&
    p.adultConfirmed === true &&
    Array.isArray(p.interests) &&
    p.interests.every((i) => typeof i === 'string' && interestIds.has(i)) &&
    (p.availability === undefined || (typeof p.availability === 'string' && timeChoices.has(p.availability)))
  );
}

function isIdList(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string');
}

/**
 * A game A result kept by an explicit "Guardar este resultado" (spec §4.5, §6).
 * Only pair/option ids — the summary is recomputed on display, never stored as text.
 */
export type SavedGameAResult = { savedAt: string; choices: GameAChoices };

function isGameAResults(v: unknown): v is SavedGameAResult[] {
  return (
    Array.isArray(v) &&
    v.every((r) => {
      if (typeof r !== 'object' || r === null) return false;
      const { savedAt, choices } = r as Record<string, unknown>;
      return (
        typeof savedAt === 'string' &&
        typeof choices === 'object' &&
        choices !== null &&
        !Array.isArray(choices) &&
        Object.entries(choices).every(([k, o]) => (o === null || typeof o === 'string') && isValidGameAChoice(k, o))
      );
    })
  );
}

type AppState = {
  ready: boolean;
  prefs: Prefs | undefined;
  completeOnboarding: (p: Omit<Prefs, 'onboardedAt' | 'adultConfirmed'>) => Promise<void>;
  savedIds: readonly string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
  gameAResults: readonly SavedGameAResult[];
  /** Rejects when the device could not store it — the caller shows that where the user acted. */
  saveGameAResult: (choices: GameAChoices) => Promise<void>;
  removeGameAResult: (savedAt: string) => Promise<void>;
  /** Deletes everything stored on this device and returns to onboarding. */
  eraseAll: () => Promise<void>;
};

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [prefs, setPrefs] = useState<Prefs | undefined>();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [gameAResults, setGameAResultsState] = useState<SavedGameAResult[]>([]);
  // Latest list for writes: two quick removals must not resurrect each other from a stale closure.
  const gameARef = useRef<SavedGameAResult[]>([]);
  const setGameAResults = useCallback((next: SavedGameAResult[]) => {
    gameARef.current = next;
    setGameAResultsState(next);
  }, []);

  useEffect(() => {
    Promise.all([load(KEYS.prefs, isPrefs), load(KEYS.saved, isIdList), load(KEYS.gameAResults, isGameAResults)]).then(([p, s, g]) => {
      setPrefs(p);
      setSavedIds(s ?? []);
      setGameAResults(g ?? []);
      setReady(true);
    });
  }, [setGameAResults]);

  const completeOnboarding = useCallback<AppState['completeOnboarding']>(async (p) => {
    const next: Prefs = { ...p, adultConfirmed: true, onboardedAt: new Date().toISOString() };
    await save(KEYS.prefs, next);
    setPrefs(next);
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [id, ...cur];
      save(KEYS.saved, next).catch((e) => console.error('[storage] could not persist saved items', e));
      return next;
    });
  }, []);

  const saveGameAResult = useCallback<AppState['saveGameAResult']>(
    async (choices) => {
      const next = [{ savedAt: new Date().toISOString(), choices: { ...choices } }, ...gameARef.current];
      await save(KEYS.gameAResults, next);
      setGameAResults(next);
    },
    [setGameAResults],
  );

  const removeGameAResult = useCallback<AppState['removeGameAResult']>(
    async (savedAt) => {
      const next = gameARef.current.filter((r) => r.savedAt !== savedAt);
      await save(KEYS.gameAResults, next);
      setGameAResults(next);
    },
    [setGameAResults],
  );

  const eraseAll = useCallback(async () => {
    await clearAll();
    setSavedIds([]);
    setGameAResults([]);
    setPrefs(undefined);
  }, [setGameAResults]);

  const value = useMemo<AppState>(
    () => ({
      ready,
      prefs,
      completeOnboarding,
      savedIds,
      isSaved: (id) => savedIds.includes(id),
      toggleSaved,
      gameAResults,
      saveGameAResult,
      removeGameAResult,
      eraseAll,
    }),
    [ready, prefs, completeOnboarding, savedIds, toggleSaved, gameAResults, saveGameAResult, removeGameAResult, eraseAll],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState must be used inside <AppStateProvider>');
  return ctx;
}

/** Kept for screens that only care about saved items. */
export function useSaved() {
  const { savedIds, isSaved, toggleSaved } = useAppState();
  return { savedIds, isSaved, toggle: toggleSaved };
}

/** Activity categories the user said she is curious about (onboarding step 4). */
export function interestCategories(prefs: Prefs | undefined): Set<Category> {
  const out = new Set<Category>();
  for (const id of prefs?.interests ?? []) out.add(interestOptions.find((o) => o.id === id)!.category);
  return out;
}
