/**
 * Which semantic colours may sit on which grounds, with the WCAG 2.2 contrast each pairing must reach.
 * The list lives next to the tokens so a new text colour cannot ship without declaring where it is used:
 * `textOn` is a Record over every text token (tsc fails when one is added and not listed here), and
 * src/theme/__tests__/contrast.test.ts fails when a ground used in the UI code is missing from it.
 * Rationale: docs/design/decisions.md (contrast decisions), spec §17–§20.
 */
import { color } from './tokens';

type Token = keyof typeof color;

/** Tokens that carry text. A new text token must be listed in `textOn`. */
export type TextToken = 'text' | 'textBody' | 'textSubtle' | 'textOnPrimary' | 'textOnAccent' | 'primary' | 'error' | 'success' | 'warning';

/** Every ground a text colour is drawn on in the UI. */
export const textOn: Record<TextToken, readonly Token[]> = {
  text: ['background', 'surface', 'surfaceSunken', 'surfaceAccent', 'tintWine', 'tintWarm', 'chipSand'],
  textBody: ['background', 'surface', 'surfaceSunken', 'tintWine', 'tintWarm'], // NOT surfaceAccent: 4.25:1
  textSubtle: ['background', 'surface', 'surfaceSunken'],
  textOnPrimary: ['primary', 'primaryPressed', 'chipWine', 'chipCharcoal'],
  textOnAccent: ['surfaceAccent', 'chipSand'],
  primary: ['background', 'surface', 'tintWine'], // step numbers, active tab label, wine emphasis
  error: ['background', 'surface'],
  success: ['background', 'surface'],
  warning: ['background', 'surface'],
};

/** Non-text parts that carry meaning or mark a control (WCAG 1.4.11, 3:1): fills, outlines, meaningful icons. */
export const nonTextOn: readonly (readonly [fg: Token, bg: Token])[] = [
  ['primary', 'background'], // primary button / selected pill vs the page
  ['primary', 'surface'],
  ['focus', 'background'],
  ['focus', 'surface'],
  ['border', 'background'], // input outline
  ['border', 'surface'],
  ['border', 'surfaceSunken'],
  ['iconEmphasis', 'background'],
  ['iconEmphasis', 'surface'],
  ['primary', 'tintWine'], // icon badge glyph
  ['textOnPrimary', 'primary'], // arrow / bookmark glyph on a wine disc
  ['textSubtle', 'surface'], // inactive tab icon, chevron
  ['textSubtle', 'background'],
  ['textBody', 'background'], // meta icons
];

/**
 * Deliberately NOT held to a ratio, each with its reason. Anything not listed here and used in the UI
 * is covered by the lists above.
 */
export const contrastExempt = {
  divider: 'decorative hairline; never the only boundary of a control (WCAG 1.4.11 applies to required visuals)',
  illustrationRed: 'illustration only (palette.sun), never text or a control',
  disabledButton: 'disabled controls are exempt (WCAG 1.4.3): textBody on surfaceAccent is 4.25:1 by design',
} as const;

/** Grounds used anywhere in the UI code; the scan test requires each to appear in `textOn` or be exempt. */
export function groundsDeclared(): ReadonlySet<Token> {
  return new Set([...Object.values(textOn).flat(), ...nonTextOn.map(([, bg]) => bg)]);
}

function channel(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

/** WCAG 2.x relative luminance of a #RRGGBB colour. */
export function luminance(hex: string): number {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`not a #RRGGBB colour: ${hex}`);
  const n = parseInt(m[1], 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

/** WCAG 2.x contrast ratio, 1..21. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Large text per WCAG: >= 24 px regular or >= 18.66 px bold (3:1 applies). */
export const isLargeText = (fontSize: number, bold: boolean): boolean => fontSize >= 24 || (bold && fontSize >= 18.66);
