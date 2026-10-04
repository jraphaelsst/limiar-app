/// <reference types="jest" />
import { type Activity } from '@/data/activities';
import { match, presetFor, questions, shuffle, timeCap } from '@/lib/recommend';

let n = 0;
const mk = (o: Partial<Activity> = {}): Activity => ({
  activityId: `t-${++n}`,
  title: 't',
  summary: 's',
  category: 'criar',
  durationMin: [10, 10],
  energy: 'baixa',
  environment: 'casa',
  socialMode: 'solo',
  budget: 'zero',
  mobility: 'sentada',
  materials: ['x'],
  steps: ['a', 'b', 'c'],
  safetyTags: [],
  sourceNote: 'test',
  reviewStatus: 'rascunho',
  reviewedBy: null,
  version: 1,
  ...o,
});
const ids = (items: readonly Activity[]) => items.map((a) => a.activityId);

describe('match — individual filters', () => {
  test('no choices returns the whole (non-retired) pool, nothing relaxed', () => {
    const pool = [mk(), mk()];
    expect(match({}, undefined, pool)).toEqual({ items: pool, relaxed: [] });
  });

  test('time cap compares durationMin[0] (the minimum), not the maximum', () => {
    const minFits = mk({ durationMin: [30, 90] });
    const minTooLong = mk({ durationMin: [31, 31] });
    const r = match({ time: '15-30' }, undefined, [minFits, minTooLong]);
    expect(ids(r.items)).toEqual([minFits.activityId]);
    expect(r.relaxed).toEqual([]);
  });

  test.each([
    ['5-10', 10],
    ['15-30', 30],
    ['60', 60],
    ['livre', Infinity],
  ] as const)('timeCap[%s] = %s', (k, v) => expect(timeCap[k]).toBe(v));

  test("time 'livre' accepts any duration", () => {
    const long = mk({ durationMin: [240, 300] });
    expect(ids(match({ time: 'livre' }, undefined, [long]).items)).toEqual([long.activityId]);
  });

  test('energy keeps activities whose rank is ≤ the chosen energy', () => {
    const b = mk({ energy: 'baixa' });
    const no = mk({ energy: 'normal' });
    const a = mk({ energy: 'alta' });
    const pool = [b, no, a];
    expect(ids(match({ energy: 'baixa' }, undefined, pool).items)).toEqual([b.activityId]);
    expect(ids(match({ energy: 'normal' }, undefined, pool).items)).toEqual([b.activityId, no.activityId]);
    expect(ids(match({ energy: 'alta' }, undefined, pool).items)).toEqual(ids(pool));
  });

  test("place matches exact environment or 'ambos'; 'tanto-faz' does not filter", () => {
    const casa = mk({ environment: 'casa' });
    const fora = mk({ environment: 'fora' });
    const ambos = mk({ environment: 'ambos' });
    const pool = [casa, fora, ambos];
    expect(ids(match({ place: 'casa' }, undefined, pool).items)).toEqual([casa.activityId, ambos.activityId]);
    expect(ids(match({ place: 'fora' }, undefined, pool).items)).toEqual([fora.activityId, ambos.activityId]);
    expect(ids(match({ place: 'tanto-faz' }, undefined, pool).items)).toEqual(ids(pool));
  });

  test("company matches exact socialMode or 'ambos'; 'tanto-faz' does not filter", () => {
    const solo = mk({ socialMode: 'solo' });
    const comp = mk({ socialMode: 'companhia' });
    const ambos = mk({ socialMode: 'ambos' });
    const pool = [solo, comp, ambos];
    expect(ids(match({ company: 'solo' }, undefined, pool).items)).toEqual([solo.activityId, ambos.activityId]);
    expect(ids(match({ company: 'companhia' }, undefined, pool).items)).toEqual([comp.activityId, ambos.activityId]);
    expect(ids(match({ company: 'tanto-faz' }, undefined, pool).items)).toEqual(ids(pool));
  });

  test('category filters by exact category', () => {
    const c = mk({ category: 'criar' });
    const a = mk({ category: 'aprender' });
    expect(ids(match({}, 'aprender', [c, a]).items)).toEqual([a.activityId]);
  });

  test("never returns 'retirado', even when it is the only exact match", () => {
    const retired = mk({ reviewStatus: 'retirado' });
    const other = mk({ socialMode: 'companhia' });
    const r = match({ company: 'solo' }, undefined, [retired, other]);
    expect(ids(r.items)).toEqual([other.activityId]);
    expect(r.relaxed).toEqual(['company']);
  });

  test("an all-'retirado' pool returns empty after relaxing everything", () => {
    const r = match({ time: '5-10', company: 'solo' }, 'criar', [mk({ reviewStatus: 'retirado' })]);
    expect(r.items).toEqual([]);
    expect(r.relaxed).toEqual(['company', 'time', 'category']);
  });

  test("the real catalog never yields a 'retirado' item", () => {
    for (const a of match({}).items) expect(a.reviewStatus).not.toBe('retirado');
  });
});

describe('match — relaxation order company → place → energy → time → category', () => {
  const all = { time: '5-10', energy: 'baixa', place: 'casa', company: 'solo' } as const;

  test('drops company first', () => {
    const x = mk({ socialMode: 'companhia' });
    expect(match(all, 'criar', [x])).toEqual({ items: [x], relaxed: ['company'] });
  });

  test('then place', () => {
    const x = mk({ socialMode: 'companhia', environment: 'fora' });
    expect(match(all, 'criar', [x]).relaxed).toEqual(['company', 'place']);
  });

  test('then energy', () => {
    const x = mk({ socialMode: 'companhia', environment: 'fora', energy: 'alta' });
    expect(match(all, 'criar', [x]).relaxed).toEqual(['company', 'place', 'energy']);
  });

  test('then time', () => {
    const x = mk({ socialMode: 'companhia', environment: 'fora', energy: 'alta', durationMin: [60, 60] });
    expect(match(all, 'criar', [x]).relaxed).toEqual(['company', 'place', 'energy', 'time']);
  });

  test('category last', () => {
    const x = mk({ socialMode: 'companhia', environment: 'fora', energy: 'alta', durationMin: [60, 60], category: 'sair' });
    expect(match(all, 'criar', [x])).toEqual({ items: [x], relaxed: ['company', 'place', 'energy', 'time', 'category'] });
  });

  test('a constraint that blocks nothing is still dropped in order (relaxation is positional, not diagnostic)', () => {
    // Only time blocks, but company is first in the order and is dropped before time.
    const x = mk({ durationMin: [60, 60] });
    expect(match(all, undefined, [x]).relaxed).toEqual(['company', 'place', 'energy', 'time']);
  });

  test('inactive constraints are skipped in the relaxed list', () => {
    const x = mk({ durationMin: [60, 60] });
    expect(match({ time: '5-10', place: 'tanto-faz' }, undefined, [x])).toEqual({ items: [x], relaxed: ['time'] });
  });

  test('stops relaxing as soon as something matches', () => {
    const exact = mk();
    const r = match(all, 'criar', [exact, mk({ socialMode: 'companhia' })]);
    expect(ids(r.items)).toEqual([exact.activityId]);
    expect(r.relaxed).toEqual([]);
  });
});

describe('presetFor', () => {
  test.each([
    ['criar', { category: 'criar', choices: {} }],
    ['aprender', { category: 'aprender', choices: {} }],
    ['sair', { choices: { place: 'fora' } }],
    ['fazer', { choices: {} }],
    ['sem-ideia', { choices: {} }],
    [undefined, { choices: {} }],
  ] as const)('%s', (preset, expected) => {
    expect(presetFor(preset)).toEqual(expected);
  });
});

describe('shuffle', () => {
  const xs = Array.from({ length: 20 }, (_, i) => i);

  test('is deterministic for a given seed', () => {
    expect(shuffle(xs, 42)).toEqual(shuffle(xs, 42));
  });

  test('different seeds give different orders', () => {
    expect(shuffle(xs, 1)).not.toEqual(shuffle(xs, 2));
  });

  test.each([0, 1, 42, 2 ** 32 - 1, -7, 123456789])('returns a permutation and leaves input untouched (seed %s)', (seed) => {
    const input = [...xs];
    const out = shuffle(input, seed);
    expect(input).toEqual(xs);
    expect(out).not.toBe(input);
    expect([...out].sort((a, b) => a - b)).toEqual(xs);
  });

  test('handles empty and single-item lists', () => {
    expect(shuffle([], 3)).toEqual([]);
    expect(shuffle(['a'], 3)).toEqual(['a']);
  });
});

describe('questions — spec §4.3 labels', () => {
  test('exactly 4 questions in order', () => {
    expect(questions.map((q) => q.key)).toEqual(['time', 'energy', 'place', 'company']);
  });

  // 'livre' is checked separately below.
  const labelsWithoutLivre = () =>
    questions.map((q) => [q.title, q.options.filter((o) => o.value !== 'livre').map((o) => [o.value, o.label])]);

  test('titles and option labels are verbatim', () => {
    expect(labelsWithoutLivre()).toEqual([
      [
        'Quanto tempo cabe agora?',
        [
          ['5-10', '5–10 min'],
          ['15-30', '15–30 min'],
          ['60', '1 h'],
        ],
      ],
      [
        'Energia disponível?',
        [
          ['baixa', 'Baixa'],
          ['normal', 'Normal'],
          ['alta', 'Tô animada'],
        ],
      ],
      [
        'Ambiente?',
        [
          ['casa', 'Em casa'],
          ['fora', 'Quero sair'],
          ['tanto-faz', 'Tanto faz'],
        ],
      ],
      [
        'Companhia?',
        [
          ['solo', 'Só comigo'],
          ['companhia', 'Com alguém'],
          ['tanto-faz', 'Tanto faz'],
        ],
      ],
    ]);
  });

  // Decision 2026-10-03: the spec's "tarde/manhã" shorthand is written out as natural pt-BR (voice rules, spec §2.1).
  test("'livre' label is the natural-language form of spec §4.3", () => {
    expect(questions[0].options.find((o) => o.value === 'livre')?.label).toBe('Tenho a tarde ou a manhã livre');
  });

  test('every time option has a cap', () => {
    for (const o of questions[0].options) expect(timeCap).toHaveProperty(o.value as string);
  });
});
