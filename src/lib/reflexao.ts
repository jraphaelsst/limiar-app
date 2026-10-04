/**
 * Screen 14 "Pergunta aberta — reflexão" (spec §19, §4.7) — the card navigation, without React.
 * One card at a time; at most two choices at the end of each (spec §20).
 */

/** The two ways forward from a card. On the last card "Quero pensar mais" becomes "Escolher outro tema". */
export type ReflectionChoice = 'pensar-mais' | 'outro-tema' | 'fazer-algo';

export const choiceLabel: Record<ReflectionChoice, string> = {
  'pensar-mais': 'Quero pensar mais',
  'outro-tema': 'Escolher outro tema',
  'fazer-algo': 'Prefiro fazer algo agora',
};

export function isLastCard(index: number, total: number): boolean {
  return index >= total - 1;
}

/**
 * Exactly two, never more (spec §20 "no máximo 2 próximos caminhos"). While the theme has more
 * cards, the main one is "Quero pensar mais"; on the last card the main one is "Prefiro fazer algo
 * agora" (spec §2 "movimento antes de ruminação") and the other is "Escolher outro tema".
 */
export function choicesFor(index: number, total: number): { primary: ReflectionChoice; secondary: ReflectionChoice } {
  return isLastCard(index, total) ? { primary: 'fazer-algo', secondary: 'outro-tema' } : { primary: 'pensar-mais', secondary: 'fazer-algo' };
}

/** "Quero pensar mais": the next card of the same theme (never past the last). */
export function nextCard(index: number, total: number): number {
  return Math.min(index + 1, Math.max(0, total - 1));
}

/** "Back" from card N>1 of this visit: the card before it (decision 2026-10-03, usePreviousStepOnBack). */
export function previousCard(index: number, start: number): number {
  return Math.max(start, index - 1);
}

/**
 * Whether "back" means the previous card (true) or leaving the screen (false). `start` is the card
 * she opened — from Salvos it can be card 2 or 3, and back from there leaves (she never saw card 1 here).
 */
export function backGoesToPreviousCard(index: number, start: number): boolean {
  return index > start;
}

/** "Cartão 2 de 3" — shown on screen and announced on each change. */
export function cardLabel(index: number, total: number): string {
  return `Cartão ${index + 1} de ${total}`;
}

/**
 * The `cartao` route param (1-based, as in a link from Salvos) → a 0-based index inside the theme.
 * Anything missing or out of range opens the first card.
 */
export function startIndex(param: string | undefined, total: number): number {
  const n = Number(param);
  return Number.isInteger(n) && n >= 1 && n <= total ? n - 1 : 0;
}
