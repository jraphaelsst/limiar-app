/// <reference types="jest" />
import { isPrefs } from '@/state/prefs';

const valid = { onboardedAt: '2026-10-03T12:00:00.000Z', adultConfirmed: true, interests: ['aprender', 'criar', 'sair'], availability: '60' };

describe('isPrefs', () => {
  test('accepts what the screens write', () => {
    expect(isPrefs(valid)).toBe(true);
    expect(isPrefs({ ...valid, interests: [] })).toBe(true);
    expect(isPrefs({ ...valid, availability: undefined })).toBe(true);
  });

  test('rejects an onboardedAt that is not a date', () => {
    expect(isPrefs({ ...valid, onboardedAt: 'ontem' })).toBe(false);
    expect(isPrefs({ ...valid, onboardedAt: '' })).toBe(false);
  });

  test('rejects an interest count outside 3–5-or-none', () => {
    expect(isPrefs({ ...valid, interests: ['aprender'] })).toBe(false);
    expect(isPrefs({ ...valid, interests: ['aprender', 'criar', 'sair', 'casa', 'cultura', 'viagens'] })).toBe(false);
  });

  test('rejects repeated or unknown interests', () => {
    expect(isPrefs({ ...valid, interests: ['aprender', 'aprender', 'criar'] })).toBe(false);
    expect(isPrefs({ ...valid, interests: ['aprender', 'criar', 'nadar'] })).toBe(false);
  });

  test('rejects a missing 18+ confirmation, an unknown availability and non-objects', () => {
    expect(isPrefs({ ...valid, adultConfirmed: false })).toBe(false);
    expect(isPrefs({ ...valid, availability: '3h' })).toBe(false);
    expect(isPrefs(null)).toBe(false);
    expect(isPrefs([valid])).toBe(false);
  });
});
