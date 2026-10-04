/**
 * App state that survives restarts: onboarding preferences, saved activities,
 * the game A results the user explicitly chose to keep and her "mais disso /
 * menos disso / não combina comigo" answers about activities (spec §6) and the guided-reflection
 * cards she bookmarked (ids only, spec §4.7).
 * Loaded once at startup (the splash screen stays up until `ready`), written
 * through on every change via ONE serialized write queue (app-store.ts).
 * Device-only — see storage.ts.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { findActivity } from '@/data/activities';
import { findReflection, findTheme } from '@/data/reflexoes';
import { gameAPattern, type GameAChoices } from '@/data/games';
import { longDate } from '@/lib/dates';

import { createAppStore, type SavedGameAResult, type Snapshot } from './app-store';
import { feedbackLabel, type Feedback, type FeedbackMap } from './feedback';
import { interestLabels, timeLabel, type EditablePrefs, type Prefs } from './prefs';

export type { SavedGameAResult } from './app-store';
export { feedbackLabel, feedbackOptions, type Feedback, type FeedbackMap } from './feedback';
export {
  interestCategories,
  interestHint,
  interestLabels,
  interestLimits,
  interestOptions,
  isValidInterestPick,
  timeLabel,
  timeOptions,
  type EditablePrefs,
  type InterestId,
  type Prefs,
} from './prefs';

/** Shown (and announced) where a bookmark tap could not be stored — every screen with a bookmark says the same. */
export const saveFailedText = 'Não foi possível atualizar os salvos neste aparelho. Tente de novo.';

type AppState = {
  ready: boolean;
  prefs: Prefs | undefined;
  completeOnboarding: (p: EditablePrefs) => Promise<void>;
  /** Screen 16 — change interests/availability later; the onboarding date and 18+ confirmation are kept. */
  updatePrefs: (p: EditablePrefs) => Promise<void>;
  savedIds: readonly string[];
  isSaved: (id: string) => boolean;
  /**
   * Optimistic: the bookmark flips at once. Rejects when the device could not
   * store it — the shown state is already rolled back; the caller says so where
   * the user acted.
   */
  toggleSaved: (id: string) => Promise<void>;
  gameAResults: readonly SavedGameAResult[];
  /** Rejects when the device could not store it — the caller shows that where the user acted. */
  saveGameAResult: (choices: GameAChoices) => Promise<void>;
  removeGameAResult: (savedAt: string) => Promise<void>;
  /** Spec §6 answers per activity id — what is stored, never an inference. */
  feedback: FeedbackMap;
  /**
   * Sets (or, with `undefined`, removes) her answer about one activity. Written first, then
   * shown: rejects when the device could not store it — the caller says so where she acted.
   */
  setFeedback: (id: string, value: Feedback | undefined) => Promise<void>;
  /** Removes every answer; same failure contract as setFeedback. */
  clearFeedback: () => Promise<void>;
  /** Guided-reflection cards she bookmarked, newest first — card ids, never text. */
  savedReflectionIds: readonly string[];
  /**
   * Sets whether one reflection card is saved. Written first, then shown (like setFeedback):
   * rejects when the device could not store it — the caller says so where she acted.
   */
  setReflectionSaved: (id: string, saved: boolean) => Promise<void>;
  /** Deletes everything stored on this device and returns to onboarding. */
  eraseAll: () => Promise<void>;
};

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [prefs, setPrefs] = useState<Prefs | undefined>();
  const [savedIds, setSavedIdsState] = useState<readonly string[]>([]);
  const [gameAResults, setGameAResults] = useState<readonly SavedGameAResult[]>([]);
  const [feedback, setFeedbackState] = useState<FeedbackMap>({});
  const [savedReflectionIds, setSavedReflectionIds] = useState<readonly string[]>([]);
  // What the screen shows (committed + optimistic bookmark taps): a toggle decides from what she saw.
  const shownSaved = useRef<readonly string[]>([]);
  const setSavedIds = useCallback((next: readonly string[]) => {
    shownSaved.current = next;
    setSavedIdsState(next);
  }, []);

  const [store] = useState(() =>
    createAppStore((snap: Snapshot, { idle }) => {
      setPrefs(snap.prefs);
      setGameAResults(snap.gameAResults);
      setFeedbackState(snap.feedback);
      setSavedReflectionIds(snap.savedReflectionIds);
      // Optimistic bookmark taps still queued keep showing; the list converges when the queue drains.
      if (idle) setSavedIds(snap.savedIds);
    }),
  );

  useEffect(() => {
    // init never rejects (storage errors are logged and the app starts empty): the splash always closes.
    store.init().finally(() => setReady(true));
  }, [store]);

  const completeOnboarding = useCallback<AppState['completeOnboarding']>(async (p) => {
    await store.completeOnboarding(p);
  }, [store]);

  const updatePrefs = useCallback<AppState['updatePrefs']>(async (p) => {
    await store.updatePrefs(p); // write first: the screen only reflects what is really stored
  }, [store]);

  const toggleSaved = useCallback<AppState['toggleSaved']>(
    async (id) => {
      const cur = shownSaved.current;
      const want = !cur.includes(id);
      setSavedIds(want ? [id, ...cur] : cur.filter((x) => x !== id));
      try {
        await store.setSaved(id, want);
      } catch (e) {
        setSavedIds(store.committed.savedIds); // roll back to what is really stored
        throw e;
      }
    },
    [store, setSavedIds],
  );

  const saveGameAResult = useCallback<AppState['saveGameAResult']>(async (choices) => {
    await store.saveGameAResult(choices);
  }, [store]);

  const removeGameAResult = useCallback<AppState['removeGameAResult']>(async (savedAt) => {
    await store.removeGameAResult(savedAt);
  }, [store]);

  const setFeedback = useCallback<AppState['setFeedback']>(async (id, value) => {
    await store.setFeedback(id, value);
  }, [store]);

  const clearFeedback = useCallback<AppState['clearFeedback']>(async () => {
    await store.clearFeedback();
  }, [store]);

  const setReflectionSaved = useCallback<AppState['setReflectionSaved']>(async (id, saved) => {
    await store.setReflectionSaved(id, saved);
  }, [store]);

  const eraseAll = useCallback<AppState['eraseAll']>(async () => {
    await store.eraseAll();
  }, [store]);

  const value = useMemo<AppState>(
    () => ({
      ready,
      prefs,
      completeOnboarding,
      updatePrefs,
      savedIds,
      isSaved: (id) => savedIds.includes(id),
      toggleSaved,
      gameAResults,
      saveGameAResult,
      removeGameAResult,
      feedback,
      setFeedback,
      clearFeedback,
      savedReflectionIds,
      setReflectionSaved,
      eraseAll,
    }),
    [
      ready,
      prefs,
      completeOnboarding,
      updatePrefs,
      savedIds,
      toggleSaved,
      gameAResults,
      saveGameAResult,
      removeGameAResult,
      feedback,
      setFeedback,
      clearFeedback,
      savedReflectionIds,
      setReflectionSaved,
      eraseAll,
    ],
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

/**
 * Spec §10.3 "exportar conteúdo próprio em formato legível": everything this build
 * stores, as plain pt-BR text. Built on demand, never stored, never sent by the app.
 */
export function buildExportText(
  prefs: Prefs,
  savedIds: readonly string[],
  now: Date,
  gameAResults: readonly SavedGameAResult[] = [],
  feedback: FeedbackMap = {},
  savedReflectionIds: readonly string[] = [],
): string {
  const interests = prefs.interests.length > 0 ? interestLabels(prefs.interests).join(', ') : 'nenhum escolhido';
  const titleOf = (id: string) => findActivity(id)?.title ?? 'Uma atividade que saiu do catálogo desta versão';
  const titles = savedIds.map(titleOf);
  const answers = Object.entries(feedback);
  // A card is named by its theme and title — the curated text she read, never anything of hers.
  const reflectionOf = (id: string) => {
    const r = findReflection(id);
    return r ? `${findTheme(r.theme)?.label ?? r.theme}: ${r.title}` : 'Um cartão que saiu do app nesta versão';
  };
  const lines = [
    'Nós no Limiar — o que o app guarda neste aparelho',
    `Exportado em ${longDate(now)}`,
    '',
    'Escolhas',
    '- Confirmação: 18 anos ou mais',
    `- Começou a usar em: ${longDate(new Date(prefs.onboardedAt))}`,
    `- Interesses: ${interests}`,
    `- Tempo livre: ${timeLabel(prefs.availability) ?? 'não escolhido'}`,
    '',
    `Atividades salvas (${titles.length})`,
    ...(titles.length > 0 ? titles.map((t) => `- ${t}`) : ['- Nenhuma']),
    '',
    `Resultados guardados do jogo “Ainda gosto disso?” (${gameAResults.length})`,
    ...(gameAResults.length > 0
      ? gameAResults.map((r) => `- ${longDate(new Date(r.savedAt))}: ${gameAPattern(r.choices).picked.join(', ') || 'nenhuma escolha'}`)
      : ['- Nenhum']),
    '',
    `Respostas sobre atividades (${answers.length})`,
    ...(answers.length > 0 ? answers.map(([id, f]) => `- ${titleOf(id)}: ${feedbackLabel(f)}`) : ['- Nenhuma']),
    '',
    `Cartões de reflexão guardados (${savedReflectionIds.length})`,
    ...(savedReflectionIds.length > 0 ? savedReflectionIds.map((id) => `- ${reflectionOf(id)}`) : ['- Nenhum']),
  ];
  return lines.join('\n');
}
