/**
 * Screen 08 "Atividade passo a passo" (spec §19) — the step navigation, without React.
 * One step at a time; progress said in words, never a bar or a score (spec §4.5, §17).
 */

/** "Passo 2 de 4" — shown on screen and announced on each change. */
export function stepLabel(index: number, total: number): string {
  return `Passo ${index + 1} de ${total}`;
}

/** Clamps an index into the activity's steps (an empty list stays at 0). */
export function clampStep(index: number, total: number): number {
  return Math.min(Math.max(0, Math.trunc(index)), Math.max(0, total - 1));
}

export function isLastStep(index: number, total: number): boolean {
  return index >= total - 1;
}

/** "Próximo": the next step, or `'done'` from the last one (the button then says "Concluir"). */
export function nextStep(index: number, total: number): number | 'done' {
  return isLastStep(index, total) ? 'done' : clampStep(index + 1, total);
}

/** "Voltar ao passo anterior" and the back gesture after the first step (decision 2026-10-03). */
export function previousStep(index: number): number {
  return Math.max(0, index - 1);
}

/** Whether "back" means the previous step (true) or leaving the screen (false) — usePreviousStepOnBack. */
export function backGoesToPreviousStep(index: number): boolean {
  return index > 0;
}
