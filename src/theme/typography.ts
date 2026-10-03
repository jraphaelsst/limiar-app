/**
 * Type scale. Sizes are in points and scale with the OS text-size setting
 * (never set `allowFontScaling={false}`). Provisional until checked on device:
 * Cormorant has a small x-height, so display sizes run larger than a typical serif.
 */
import type { TextStyle } from 'react-native';

import { family } from './fonts';

type Variant = Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'textTransform'>;

export const typography = {
  // Cormorant Garamond — editorial voice
  display: { fontFamily: family.display, fontSize: 38, lineHeight: 42 }, // welcome / hero
  h1: { fontFamily: family.display, fontSize: 34, lineHeight: 38 }, // page title
  h2: { fontFamily: family.display, fontSize: 28, lineHeight: 32 }, // greeting
  h3: { fontFamily: family.display, fontSize: 23, lineHeight: 28 }, // section title
  cardTitle: { fontFamily: family.displayStrong, fontSize: 20, lineHeight: 24 },
  button: { fontFamily: family.displayStrong, fontSize: 20, lineHeight: 24 }, // mockup sets CTAs in serif

  // Lora — reading
  body: { fontFamily: family.body, fontSize: 17, lineHeight: 26 },
  bodySmall: { fontFamily: family.body, fontSize: 15, lineHeight: 22 },

  // Inter — interface
  label: { fontFamily: family.uiMedium, fontSize: 15, lineHeight: 20 },
  input: { fontFamily: family.ui, fontSize: 16, lineHeight: 22 },
  caption: { fontFamily: family.ui, fontSize: 14, lineHeight: 20 },
  link: { fontFamily: family.uiMedium, fontSize: 15, lineHeight: 20 },
  chip: { fontFamily: family.uiStrong, fontSize: 12, lineHeight: 16, letterSpacing: 0.8, textTransform: 'uppercase' },
  tabLabel: { fontFamily: family.uiMedium, fontSize: 12, lineHeight: 16 },
} as const satisfies Record<string, Variant>;

export type TypographyVariant = keyof typeof typography;
