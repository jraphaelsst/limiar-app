/// <reference types="jest" />
/// <reference types="node" />
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

import { color, palette } from '@/theme/tokens';
import { contrastExempt, contrastRatio, groundsDeclared, isLargeText, luminance, nonTextOn, textOn } from '@/theme/contrast';
import { typography } from '@/theme/typography';

/**
 * WCAG 2.2 contrast, computed from the theme tokens (spec §17–§20: "contraste conforme WCAG 2.2").
 * The pairs live in src/theme/contrast.ts; this file proves each one and proves the list cannot drift
 * from what the UI code actually draws.
 */
const TEXT_MIN = 4.5;
const NON_TEXT_MIN = 3;
const src = join(__dirname, '..', '..');

function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (name === '__tests__') return [];
    return statSync(p).isDirectory() ? filesUnder(p) : /\.tsx?$/.test(name) ? [p] : [];
  });
}

const textPairs = Object.entries(textOn).flatMap(([fg, bgs]) => bgs.map((bg) => [fg, bg] as const));

describe('contrast maths', () => {
  test('matches the WCAG reference values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#777777', '#FFFFFF')).toBeCloseTo(4.48, 2);
    expect(luminance('#FFFFFF')).toBeCloseTo(1, 5);
  });
  test('large text is >= 24 px, or >= 18.66 px bold', () => {
    expect(isLargeText(24, false)).toBe(true);
    expect(isLargeText(23, false)).toBe(false);
    expect(isLargeText(18.66, true)).toBe(true);
    expect(isLargeText(18, true)).toBe(false);
  });
});

describe('text pairs reach 4.5:1 (every text size, stricter than the 3:1 large-text allowance)', () => {
  test.each(textPairs)('%s on %s', (fg, bg) => {
    const ratio = contrastRatio(color[fg as keyof typeof color], color[bg as keyof typeof color]);
    expect(ratio).toBeGreaterThanOrEqual(TEXT_MIN);
  });
});

describe('non-text parts reach 3:1', () => {
  test.each(nonTextOn.map(([fg, bg]) => [fg, bg] as const))('%s on %s', (fg, bg) => {
    expect(contrastRatio(color[fg], color[bg])).toBeGreaterThanOrEqual(NON_TEXT_MIN);
  });
});

describe('the list cannot drift from the UI', () => {
  const files = filesUnder(src).filter((f) => !f.includes(join('src', 'theme')));
  const used = (re: RegExp) => new Set(files.flatMap((f) => [...readFileSync(f, 'utf8').matchAll(re)].map((m) => m[1])));

  test('every `backgroundColor: color.X` in the UI is a declared ground or explicitly exempt', () => {
    const grounds = groundsDeclared();
    const missing = [...used(/backgroundColor: color\.(\w+)/g)].filter((g) => !grounds.has(g as keyof typeof color) && !(g in contrastExempt));
    expect(missing).toEqual([]);
  });

  test('every AppText `color="X"` literal names a declared text token', () => {
    const missing = [...used(/<AppText[^>]*\scolor="(\w+)"/g)].filter((t) => !(t in textOn));
    expect(missing).toEqual([]);
  });

  test('the UI draws no raw palette colour outside the illustration', () => {
    const offenders = files.filter((f) => /\bpalette\./.test(readFileSync(f, 'utf8')) && !f.endsWith('WelcomeCollage.tsx'));
    expect(offenders.map((f) => f.slice(src.length + 1))).toEqual([]);
  });

  test('palette values the tests read are real hex colours', () => {
    for (const v of Object.values(palette)) expect(v).toMatch(/^#[0-9A-F]{6}$/i);
  });

  test('every typography variant is a size the text pairs were judged for (none below 12 px)', () => {
    for (const v of Object.values(typography)) expect(v.fontSize).toBeGreaterThanOrEqual(12);
  });
});
