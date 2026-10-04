/// <reference types="jest" />
import { activities, findActivity, formatDuration } from '@/data/activities';

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
  });

  test('findActivity resolves every id and returns undefined for unknown', () => {
    for (const a of activities) expect(findActivity(a.activityId)).toBe(a);
    expect(findActivity('act-nope')).toBeUndefined();
  });
});
