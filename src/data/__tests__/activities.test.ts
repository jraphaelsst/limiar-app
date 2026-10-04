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

  test('ids are stable: act-0001…act-0030 are all still in the catalog (retire by status, never delete)', () => {
    for (let n = 1; n <= 30; n++) expect(findActivity(`act-${String(n).padStart(4, '0')}`)).toBeDefined();
  });

  test('nothing is reviewed yet: every activity is a rascunho with no reviewer (spec §22)', () => {
    for (const a of activities) {
      expect(a.reviewStatus).toBe('rascunho');
      expect(a.reviewedBy).toBeNull();
    }
  });

  test('batch 1 (act-0016…act-0030) is marked as Claude drafts for Mônica', () => {
    const lote1 = activities.filter((a) => a.activityId >= 'act-0016' && a.activityId <= 'act-0030');
    expect(lote1).toHaveLength(15);
    for (const a of lote1) {
      expect(a.sourceNote).toBe('Rascunho de Claude (lote 1, 2026-10-04) para revisão da Mônica');
      expect(a.version).toBe(1);
    }
  });

  test('findActivity resolves every id and returns undefined for unknown', () => {
    for (const a of activities) expect(findActivity(a.activityId)).toBe(a);
    expect(findActivity('act-nope')).toBeUndefined();
  });
});
