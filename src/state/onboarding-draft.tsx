/** Answers collected across the onboarding steps; persisted only on the last step (app-state.completeOnboarding). */
import { createContext, useContext, useState, type ReactNode } from 'react';

import type { TimeChoice } from '@/lib/recommend';

import type { InterestId } from './app-state';

type Draft = { interests: InterestId[]; availability?: TimeChoice };

const DraftCtx = createContext<{ draft: Draft; setDraft: (d: Draft) => void } | null>(null);

export function OnboardingDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<Draft>({ interests: [] });
  return <DraftCtx.Provider value={{ draft, setDraft }}>{children}</DraftCtx.Provider>;
}

export function useOnboardingDraft() {
  const ctx = useContext(DraftCtx);
  if (!ctx) throw new Error('useOnboardingDraft must be used inside <OnboardingDraftProvider>');
  return ctx;
}
