/// <reference types="jest" />
import {
  activities,
  findActivity,
  formatDuration,
  type Budget,
  type Category,
  type Energy,
  type Environment,
  type Mobility,
  type SocialMode,
} from '@/data/activities';
import { worlds, type WorldId } from '@/data/worlds';

import { avoidedWord, voiceProblems } from './voice-rules';

// Record<Union, true> fails to compile if a member is missing or extra — the runtime check stays exhaustive.
const categories: Record<Category, true> = {
  criar: true,
  aprender: true,
  sair: true,
  conectar: true,
  organizar: true,
  explorar: true,
  refletir: true,
};
const energies: Record<Energy, true> = { baixa: true, normal: true, alta: true };
const environments: Record<Environment, true> = { casa: true, fora: true, ambos: true };
const socialModes: Record<SocialMode, true> = { solo: true, companhia: true, ambos: true };
const budgets: Record<Budget, true> = { zero: true, baixo: true, medio: true };
const mobilities: Record<Mobility, true> = { sentada: true, leve: true, moderada: true };
const worldIds: Record<WorldId, true> = {
  'quem-sou': true,
  'filhos-adultos': true,
  tempo: true,
  'nos-dois': true,
  mundo: true,
  experimenta: true,
};
const idOf = (n: number) => `act-${String(n).padStart(4, '0')}`;

describe('formatDuration', () => {
  test.each([
    [[10, 10], '10 min'],
    [[10, 15], '10–15 min'],
    [[30, 60], '30 min–1 h'],
    [[30, 90], '30–90 min'],
    [[60, 120], '1–2 h'],
    [[90, 90], '90 min'],
    [[60, 60], '1 h'],
  ] as const)('%j → %s', (range, expected) => {
    expect(formatDuration(range)).toBe(expected);
  });
});

describe('activity catalog invariants', () => {
  test('activityId is unique', () => {
    const ids = activities.map((a) => a.activityId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test.each(activities.map((a) => [a.activityId, a] as const))('%s is well-formed', (_id, a) => {
    expect(a.steps.length).toBeGreaterThanOrEqual(3);
    expect(a.steps.length).toBeLessThanOrEqual(5);
    for (const s of a.steps) expect(s.trim()).not.toBe('');
    expect(a.materials.length).toBeGreaterThan(0);
    for (const m of a.materials) expect(m.trim()).not.toBe('');
    expect(a.reviewStatus).toBe('rascunho');
    expect(a.durationMin[0]).toBeLessThanOrEqual(a.durationMin[1]);
    expect(a.durationMin[0]).toBeGreaterThan(0);
    if (a.variation !== undefined) expect(a.variation.trim()).not.toBe('');
  });

  test.each(activities.map((a) => [a.activityId, a] as const))('%s uses only valid enum values', (_id, a) => {
    expect(a.activityId).toMatch(/^act-\d{4}$/);
    expect(Object.keys(categories)).toContain(a.category);
    expect(Object.keys(energies)).toContain(a.energy);
    expect(Object.keys(environments)).toContain(a.environment);
    expect(Object.keys(socialModes)).toContain(a.socialMode);
    expect(Object.keys(budgets)).toContain(a.budget);
    expect(Object.keys(mobilities)).toContain(a.mobility);
    expect(Number.isInteger(a.version) && a.version >= 1).toBe(true);
  });

  test('ids are stable: act-0001…act-0060 are all still in the catalog (retire by status, never delete)', () => {
    for (let n = 1; n <= 60; n++) expect(findActivity(idOf(n))).toBeDefined();
  });

  test('ids are contiguous and in order: act-0001…act-N with no gap (a new item takes the next id)', () => {
    expect(activities.map((a) => a.activityId)).toEqual(activities.map((_a, i) => idOf(i + 1)));
  });

  test('nothing is reviewed yet: every activity is a rascunho with no reviewer (spec §22)', () => {
    for (const a of activities) {
      expect(a.reviewStatus).toBe('rascunho');
      expect(a.reviewedBy).toBeNull();
    }
  });

  test('the 15 seeds (act-0001…act-0015) keep their spec provenance', () => {
    for (let n = 1; n <= 15; n++) expect(findActivity(idOf(n))?.sourceNote).toBe('Semente da especificação mestre v1.0 §5.1');
  });

  test.each([
    [1, 16, 30, '2026-10-04'],
    [2, 31, 45, '2026-10-05'],
    [3, 46, 60, '2026-10-05'],
  ] as const)('batch %i (ids %i…%i) is marked as Claude drafts for Mônica, rascunho v1', (batch, from, to, date) => {
    const lote = activities.filter((a) => a.activityId >= idOf(from) && a.activityId <= idOf(to));
    expect(lote).toHaveLength(15);
    for (const a of lote) {
      expect(a.sourceNote).toBe(`Rascunho de Claude (lote ${batch}, ${date}) para revisão da Mônica`);
      expect(a.reviewStatus).toBe('rascunho');
      expect(a.reviewedBy).toBeNull();
      expect(a.version).toBe(1);
      // From batch 2 on, every draft carries its own provisional variation (batch 1 only where it applied).
      if (batch >= 2) expect(a.variation?.trim()).toBeTruthy();
    }
  });

  test('findActivity resolves every id and returns undefined for unknown', () => {
    for (const a of activities) expect(findActivity(a.activityId)).toBe(a);
    expect(findActivity('act-nope')).toBeUndefined();
  });
});

describe('worlds (spec §3.1)', () => {
  test('the six world ids of worlds.ts are exactly the WorldId union', () => {
    expect(worlds.map((w) => w.id).sort()).toEqual(Object.keys(worldIds).sort());
  });

  test.each(activities.map((a) => [a.activityId, a] as const))('%s belongs to 1–2 valid worlds, no repeats', (_id, a) => {
    expect(a.worlds.length).toBeGreaterThanOrEqual(1);
    expect(a.worlds.length).toBeLessThanOrEqual(2);
    expect(new Set(a.worlds).size).toBe(a.worlds.length);
    for (const w of a.worlds) expect(Object.keys(worldIds)).toContain(w);
  });

  // Explorar shows a world only when it has content; 8 keeps "Me tira do sofá"-style variety inside each.
  test.each(Object.keys(worldIds))('world %s has at least 8 activities', (w) => {
    expect(activities.filter((a) => a.worlds.includes(w as WorldId)).length).toBeGreaterThanOrEqual(8);
  });

  // Spec §3.1: "Nós dois agora" must work for someone without a partner, without embarrassment.
  test.each(activities.filter((a) => a.worlds.includes('nos-dois')).map((a) => [a.activityId, a] as const))(
    '%s (nós dois) offers a way without a partner',
    (_id, a) => {
      const text = [a.title, a.summary, ...a.steps, a.variation ?? ''].join('\n').toLowerCase();
      expect(text).toMatch(/sozinha|amiga|dois ou um|morando sozinha/);
    },
  );
});

describe('voice of the drafts (spec §2, §2.1; agents/nos-no-limiar revisar-atividade)', () => {
  const drafts = activities.filter((a) => a.activityId >= idOf(16));
  const textOf = (a: (typeof activities)[number]) => [a.title, a.summary, ...a.materials, ...a.steps, a.variation ?? ''].join('\n');

  test.each(drafts.map((a) => [a.activityId, a] as const))('%s reads in the app voice', (_id, a) => {
    expect({ problems: voiceProblems(textOf(a)), word: avoidedWord(textOf(a)) }).toEqual({ problems: [], word: undefined });
  });
});
