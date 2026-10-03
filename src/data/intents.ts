/**
 * Home intents — spec §4.2. Each one opens "Me tira do sofá" with a preset.
 * "Quero pensar sobre uma situação" is left out of Phase 0: it leads to the
 * open-question AI flow (spec §4.7), which needs the safety layer first (spec §25.5).
 */
import type { Preset } from '@/lib/recommend';

export type Intent = { id: Preset; label: string };

export const intents: readonly Intent[] = [
  { id: 'fazer', label: 'Quero fazer alguma coisa' },
  { id: 'criar', label: 'Quero criar' },
  { id: 'sair', label: 'Quero sair' },
  { id: 'aprender', label: 'Quero aprender algo' },
  { id: 'sem-ideia', label: 'Estou sem ideia do que fazer' },
];
