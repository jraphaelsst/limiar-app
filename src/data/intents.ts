/**
 * Home intents — spec §4.2, in the spec's order. Each one opens "Me tira do sofá" with a preset,
 * except "Quero pensar sobre uma situação": it opens the guided reflection (screen 13, spec §4.7) —
 * themes and curated cards, no typing (decisions.md 2026-10-04: no free-text field before the
 * semantic classifier). It stays one row among the intents, under "Me tira do sofá": the spec wants
 * it less prominent than the activities.
 */
import type { Preset } from '@/lib/recommend';

export type Intent = { id: Preset | 'pensar'; label: string };

export const intents: readonly Intent[] = [
  { id: 'fazer', label: 'Quero fazer alguma coisa' },
  { id: 'criar', label: 'Quero criar' },
  { id: 'sair', label: 'Quero sair' },
  { id: 'aprender', label: 'Quero aprender algo' },
  { id: 'pensar', label: 'Quero pensar sobre uma situação' },
  { id: 'sem-ideia', label: 'Estou sem ideia do que fazer' },
];

/** Where an intent leads. */
export function intentHref(id: Intent['id']) {
  return id === 'pensar' ? ({ pathname: '/reflexao' } as const) : ({ pathname: '/sofa', params: { preset: id } } as const);
}
