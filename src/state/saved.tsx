/**
 * Saved activities ("Salvos"). Phase 0 keeps them in memory only: nothing leaves
 * the device and nothing persists across app restarts. Persistence (local first,
 * then account sync) is a Phase 1 decision — spec §24 Q2/Q4.
 */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type SavedApi = {
  savedIds: readonly string[];
  isSaved: (id: string) => boolean;
  toggle: (id: string) => void;
};

const SavedContext = createContext<SavedApi | null>(null);

export function SavedProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const toggle = useCallback(
    (id: string) => setSavedIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [id, ...cur])),
    [],
  );
  const api = useMemo<SavedApi>(() => ({ savedIds, isSaved: (id) => savedIds.includes(id), toggle }), [savedIds, toggle]);
  return <SavedContext.Provider value={api}>{children}</SavedContext.Provider>;
}

export function useSaved(): SavedApi {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error('useSaved must be used inside <SavedProvider>');
  return ctx;
}
