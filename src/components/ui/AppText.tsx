import type { Ref } from 'react';
import { Text, type TextProps } from 'react-native';

import { color as palette, typography, type TypographyVariant } from '@/theme';

type Props = TextProps & {
  variant?: TypographyVariant;
  color?: keyof typeof palette;
  /** e.g. to move screen-reader focus to a heading (src/lib/a11y.ts). */
  ref?: Ref<Text>;
};

/** The only text primitive. Typography and color always come from tokens. */
export function AppText({ variant = 'body', color = 'text', style, ...rest }: Props) {
  const isHeading = variant === 'display' || variant === 'h1' || variant === 'h2' || variant === 'h3';
  return (
    <Text
      accessibilityRole={isHeading ? 'header' : rest.accessibilityRole}
      {...rest}
      style={[typography[variant], { color: palette[color] }, style]}
    />
  );
}
