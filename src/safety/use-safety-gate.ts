import { useRouter } from 'expo-router';
import { useMemo } from 'react';

import { decidir } from './gate';
import type { TriageResult } from './triage';

export { AVISO_AMARELO } from './gate';

export type SafetyCheck = TriageResult & { podeSeguir: boolean };

/**
 * Gate for every free-text feature. Call `check(text)` BEFORE doing anything with the text
 * (sending it to a model, saving it, showing a reply):
 *  - vermelho / violência → replaces the current screen with /seguranca (the flow is abandoned;
 *    the caller must drop the text) and returns `podeSeguir: false`;
 *  - amarelo → `podeSeguir: true`; show `AVISO_AMARELO` and a way to /ajuda alongside the flow;
 *  - verde → `podeSeguir: true`.
 * The text is never stored or logged here; `regras` holds rule ids only.
 */
export function useSafetyGate(): { check(text: string): SafetyCheck } {
  const router = useRouter();
  return useMemo(
    () => ({
      check(text: string): SafetyCheck {
        const { rota, ...resultado } = decidir(text);
        if (rota) router.replace(rota);
        return resultado;
      },
    }),
    [router],
  );
}
