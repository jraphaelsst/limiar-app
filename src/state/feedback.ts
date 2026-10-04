/**
 * Spec §6 feedback — "mais disso", "menos disso", "não combina comigo" — per activity:
 * the options, their words and the shape guard for what is persisted. No React here.
 *
 * Stored as an enum per activity id, nothing else (no date, no text, no count): it only
 * reorders suggestions (src/lib/recommend.ts) and is never read as anything about her.
 */
import type { Feedback, FeedbackMap } from '@/lib/recommend';

export type { Feedback, FeedbackMap } from '@/lib/recommend';

/** Spec §6, verbatim, in the order shown. */
export const feedbackOptions: readonly { value: Feedback; label: string }[] = [
  { value: 'mais', label: 'Mais disso' },
  { value: 'menos', label: 'Menos disso' },
  { value: 'nao-combina', label: 'Não combina comigo' },
];

const values = new Set<string>(feedbackOptions.map((o) => o.value));

export function feedbackLabel(f: Feedback): string {
  return feedbackOptions.find((o) => o.value === f)!.label;
}

/** A plain object of non-empty activity ids to one of the three answers — exactly what the screens write. */
export function isFeedbackMap(v: unknown): v is FeedbackMap {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return false;
  if (Object.getPrototypeOf(v) !== Object.prototype) return false;
  return Object.entries(v).every(([id, f]) => id.length > 0 && typeof f === 'string' && values.has(f));
}
