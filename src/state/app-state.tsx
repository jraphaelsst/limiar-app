/**
 * App state that survives restarts: onboarding preferences, saved activities and
 * the game A results the user explicitly chose to keep.
 * Loaded once at startup (the splash screen stays up until `ready`), written
 * through on every change via ONE serialized write queue (app-store.ts).
 * Device-only — see storage.ts.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { findActivity } from '@/data/activities';
import { gameAPattern, type GameAChoices } from '@/data/games';
import { longDate } from '@/lib/dates';

import { createAppStore, type SavedGameAResult, type Snapshot } from './app-store';
import { interestLabels, timeLabel, type EditablePrefs, type Prefs } from './prefs';

export type { SavedGameAResult } from './app-store';
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
  /** Deletes everything stored on this device and returns to onboarding. */
  eraseAll: () => Promise<void>;
};

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [prefs, setPrefs] = useState<Prefs | undefined>();
  const [savedIds, setSavedIdsState] = useState<readonly string[]>([]);
  const [gameAResults, setGameAResults] = useState<readonly SavedGameAResult[]>([]);
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
      eraseAll,
    }),
    [ready, prefs, completeOnboarding, updatePrefs, savedIds, toggleSaved, gameAResults, saveGameAResult, removeGameAResult, eraseAll],
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
): string {
  const interests = prefs.interests.length > 0 ? interestLabels(prefs.interests).join(', ') : 'nenhum escolhido';
  const titles = savedIds.map((id) => findActivity(id)?.title ?? 'Uma atividade que saiu do catálogo desta versão');
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
  ];
  return lines.join('\n');
}
