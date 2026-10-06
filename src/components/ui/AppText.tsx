import type { Ref } from 'react';
import { Text, type TextProps } from 'react-native';

import { color as palette, typography, type TypographyVariant } from '@/theme';

type Props = TextProps & {
  variant?: TypographyVariant;
  color?: keyof typeof palette;
  /** e.g. to move screen-reader focus to a heading (src/lib/a11y.ts). */
  ref?: Ref<Text>;
};

/**
 * Display, heading, button and chip (category tag) text scale with the system font up to 2x (WCAG 1.4.4's 200%), not without
 * limit: at the largest iOS size (~3.1x) serif titles broke mid-word and filled the first screen
 * (simulator sweep 2026-10-05). Body text, labels and captions keep scaling fully.
 */
const CAPPED: ReadonlySet<TypographyVariant> = new Set<TypographyVariant>(['display', 'h1', 'h2', 'h3', 'cardTitle', 'button', 'chip']);
export const HEADING_MAX_FONT_SCALE = 2;

/** The only text primitive. Typography and color always come from tokens. */
export function AppText({ variant = 'body', color = 'text', style, ...rest }: Props) {
  const isHeading = variant === 'display' || variant === 'h1' || variant === 'h2' || variant === 'h3';
  return (
    <Text
      accessibilityRole={isHeading ? 'header' : rest.accessibilityRole}
      maxFontSizeMultiplier={CAPPED.has(variant) ? HEADING_MAX_FONT_SCALE : undefined}
      {...rest}
      style={[typography[variant], { color: palette[color] }, style]}
    />
  );
}
