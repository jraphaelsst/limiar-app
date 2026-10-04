/**
 * Onboarding preferences (spec §4.1 steps 3–5): the options, the rules and the
 * shape guard for what is persisted. No React here, so it can be unit-tested.
 */
import type { Category } from '@/data/activities';
import type { TimeChoice } from '@/lib/recommend';

/** Spec §4.1 step 4 — the interest options, verbatim. */
export const interestOptions = [
  { id: 'aprender', label: 'Aprender', category: 'aprender' },
  { id: 'criar', label: 'Criar', category: 'criar' },
  { id: 'sair', label: 'Sair', category: 'sair' },
  { id: 'relacoes', label: 'Relações', category: 'conectar' },
  { id: 'estudos', label: 'Estudos', category: 'aprender' },
  { id: 'cultura', label: 'Cultura', category: 'explorar' },
  { id: 'movimento', label: 'Movimento leve', category: 'sair' },
  { id: 'casa', label: 'Casa', category: 'organizar' },
  { id: 'amizades', label: 'Amizades', category: 'conectar' },
  { id: 'trabalho', label: 'Trabalho e projetos', category: 'organizar' },
  { id: 'viagens', label: 'Viagens', category: 'explorar' },
] as const satisfies readonly { id: string; label: string; category: Category }[];

export type InterestId = (typeof interestOptions)[number]['id'];

/** Spec §4.1 step 4 — 3 to 5 interests, or none at all. */
export const interestLimits = { min: 3, max: 5 } as const;

/** A pick is valid when it is empty or within the limits; 1–2 is "unfinished". */
export function isValidInterestPick(count: number): boolean {
  return count === 0 || (count >= interestLimits.min && count <= interestLimits.max);
}

/** The status line under the interest options (onboarding and Preferências say the same thing). */
export function interestHint(count: number): string {
  const { min, max } = interestLimits;
  if (count === 0) return `Escolha de ${min} a ${max}. É opcional.`;
  if (count < min) return `Escolha mais ${min - count}.`;
  if (count === max) return 'Você escolheu o máximo.';
  return `${count} escolhidos.`;
}

/** Spec §4.1 step 5 — availability, verbatim options. */
export const timeOptions: readonly { value: TimeChoice; label: string }[] = [
  { value: '5-10', label: '5–10 min' },
  { value: '15-30', label: '15–30 min' },
  { value: '60', label: '1 h' },
  { value: 'livre', label: 'Meio período' },
];

export type Prefs = {
  onboardedAt: string; // ISO date
  adultConfirmed: true; // spec §4.1 step 3 — a yes/no confirmation, never a birth date
  interests: InterestId[];
  availability?: TimeChoice;
};

/** What the user can choose (and later change); the rest of `Prefs` is set once at onboarding. */
export type EditablePrefs = Pick<Prefs, 'interests' | 'availability'>;

const interestIds = new Set<string>(interestOptions.map((o) => o.id));
const timeChoices = new Set<string>(timeOptions.map((o) => o.value));

/** A string `Date.parse` understands (an ISO date as we write it). */
export function isValidDateString(v: unknown): v is string {
  return typeof v === 'string' && !Number.isNaN(Date.parse(v));
}

/**
 * Stored prefs must be exactly what the screens could have written: a real date,
 * the 18+ confirmation, known and unique interests within the 3–5-or-none rule,
 * and a known availability (or none).
 */
export function isPrefs(v: unknown): v is Prefs {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return false;
  const p = v as Record<string, unknown>;
  return (
    isValidDateString(p.onboardedAt) &&
    p.adultConfirmed === true &&
    Array.isArray(p.interests) &&
    p.interests.every((i) => typeof i === 'string' && interestIds.has(i)) &&
    new Set(p.interests).size === p.interests.length &&
    isValidInterestPick(p.interests.length) &&
    (p.availability === undefined || (typeof p.availability === 'string' && timeChoices.has(p.availability)))
  );
}

/** Activity categories the user said she is curious about (onboarding step 4). */
export function interestCategories(prefs: Prefs | undefined): Set<Category> {
  const out = new Set<Category>();
  for (const id of prefs?.interests ?? []) out.add(interestOptions.find((o) => o.id === id)!.category);
  return out;
}

export function interestLabels(ids: readonly InterestId[]): string[] {
  return ids.map((id) => interestOptions.find((o) => o.id === id)!.label);
}

export function timeLabel(t: TimeChoice | undefined): string | undefined {
  return t === undefined ? undefined : timeOptions.find((o) => o.value === t)!.label;
}
