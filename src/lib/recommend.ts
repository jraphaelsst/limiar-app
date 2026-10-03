/**
 * "Me tira do sofá" matching — spec §4.3: at most 4 choices, then ONE activity at a time.
 *
 * Pure functions; no randomness inside so results are testable. The caller
 * supplies the shuffle seed. When nothing matches every choice, constraints are
 * relaxed in a fixed order and the result says so (`relaxed`) — the UI must tell
 * the user, never pretend it was an exact match.
 */
import { activities, type Activity, type Category } from '@/data/activities';

export type TimeChoice = '5-10' | '15-30' | '60' | 'livre';
export type EnergyChoice = 'baixa' | 'normal' | 'alta';
export type PlaceChoice = 'casa' | 'fora' | 'tanto-faz';
export type CompanyChoice = 'solo' | 'companhia' | 'tanto-faz';
export type Preset = 'fazer' | 'criar' | 'sair' | 'aprender' | 'sem-ideia';

export type Choices = {
  time?: TimeChoice;
  energy?: EnergyChoice;
  place?: PlaceChoice;
  company?: CompanyChoice;
};

export type Question<K extends keyof Choices = keyof Choices> = {
  key: K;
  title: string;
  options: readonly { value: NonNullable<Choices[K]>; label: string }[];
};

/** Spec §4.3 table, verbatim labels. */
export const questions: readonly Question[] = [
  {
    key: 'time',
    title: 'Quanto tempo cabe agora?',
    options: [
      { value: '5-10', label: '5–10 min' },
      { value: '15-30', label: '15–30 min' },
      { value: '60', label: '1 h' },
      { value: 'livre', label: 'Tenho a tarde ou a manhã livre' },
    ],
  },
  {
    key: 'energy',
    title: 'Energia disponível?',
    options: [
      { value: 'baixa', label: 'Baixa' },
      { value: 'normal', label: 'Normal' },
      { value: 'alta', label: 'Tô animada' },
    ],
  },
  {
    key: 'place',
    title: 'Ambiente?',
    options: [
      { value: 'casa', label: 'Em casa' },
      { value: 'fora', label: 'Quero sair' },
      { value: 'tanto-faz', label: 'Tanto faz' },
    ],
  },
  {
    key: 'company',
    title: 'Companhia?',
    options: [
      { value: 'solo', label: 'Só comigo' },
      { value: 'companhia', label: 'Com alguém' },
      { value: 'tanto-faz', label: 'Tanto faz' },
    ],
  },
];

const timeCap: Record<TimeChoice, number> = { '5-10': 10, '15-30': 30, '60': 60, livre: Infinity };
const energyRank = { baixa: 0, normal: 1, alta: 2 } as const;

/** What an intent pre-decides. Questions already answered by a preset are skipped. */
export function presetFor(preset: Preset | undefined): { category?: Category; choices: Choices } {
  switch (preset) {
    case 'criar':
      return { category: 'criar', choices: {} };
    case 'aprender':
      return { category: 'aprender', choices: {} };
    case 'sair':
      return { choices: { place: 'fora' } };
    default:
      return { choices: {} };
  }
}

type Filter = (a: Activity) => boolean;

function filtersFor(c: Choices, category?: Category): { name: keyof Choices | 'category'; test: Filter }[] {
  const out: { name: keyof Choices | 'category'; test: Filter }[] = [];
  if (category) out.push({ name: 'category', test: (a) => a.category === category });
  if (c.time) out.push({ name: 'time', test: (a) => a.durationMin[0] <= timeCap[c.time!] });
  if (c.energy) out.push({ name: 'energy', test: (a) => energyRank[a.energy] <= energyRank[c.energy!] });
  if (c.place && c.place !== 'tanto-faz') out.push({ name: 'place', test: (a) => a.environment === c.place || a.environment === 'ambos' });
  if (c.company && c.company !== 'tanto-faz')
    out.push({ name: 'company', test: (a) => a.socialMode === c.company || a.socialMode === 'ambos' });
  return out;
}

/** Order in which constraints are dropped when nothing matches — least important first. */
const relaxOrder: readonly (keyof Choices | 'category')[] = ['company', 'place', 'energy', 'time', 'category'];

export type Match = { items: readonly Activity[]; relaxed: readonly (keyof Choices | 'category')[] };

export function match(choices: Choices, category?: Category, pool: readonly Activity[] = activities): Match {
  let active = filtersFor(choices, category);
  const relaxed: (keyof Choices | 'category')[] = [];
  for (;;) {
    const items = pool.filter((a) => a.reviewStatus !== 'retirado' && active.every((f) => f.test(a)));
    if (items.length > 0 || active.length === 0) return { items, relaxed };
    const drop = relaxOrder.find((n) => active.some((f) => f.name === n))!;
    active = active.filter((f) => f.name !== drop);
    relaxed.push(drop);
  }
}

/** Deterministic Fisher–Yates with a numeric seed (mulberry32). */
export function shuffle<T>(items: readonly T[], seed: number): T[] {
  let s = seed >>> 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
