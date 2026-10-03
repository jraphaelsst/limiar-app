import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { color, radius, size, space } from '@/theme';

import { AppText } from './AppText';
import { ArrowRight } from './icons';

type Variant = 'primary' | 'secondary' | 'quiet';

type Props = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: Variant;
  /** Trailing arrow, as in the mockup CTAs. */
  arrow?: boolean;
  fullWidth?: boolean;
};

/**
 * primary   — wine pill, the one main action of a screen (mockup "Começar agora →")
 * secondary — paper pill on a colored ground (mockup "Ler agora →")
 * quiet     — underlined text action (mockup "Já tenho uma conta")
 */
export function Button({ label, variant = 'primary', arrow = false, fullWidth = false, disabled, ...rest }: Props) {
  const fg = variant === 'primary' ? color.textOnPrimary : color.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      hitSlop={variant === 'quiet' ? 8 : undefined}
      {...rest}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        fullWidth && styles.full,
        pressed && variant === 'primary' && { backgroundColor: color.primaryPressed },
        pressed && variant !== 'primary' && { opacity: 0.7 },
        disabled && styles.disabled,
      ]}>
      <View style={styles.row}>
        <AppText
          variant={variant === 'quiet' ? 'link' : 'button'}
          style={[{ color: disabled ? color.textBody : fg }, variant === 'quiet' && styles.underline]}>
          {label}
        </AppText>
        {arrow && <ArrowRight size={20} color={fg} weight="regular" />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill },
  primary: { backgroundColor: color.primary, minHeight: size.buttonHeight, paddingHorizontal: space[6] },
  secondary: { backgroundColor: color.surface, minHeight: 44, paddingHorizontal: space[5] },
  quiet: { minHeight: size.touchMin, paddingHorizontal: space[2] },
  full: { alignSelf: 'stretch' },
  disabled: { backgroundColor: color.surfaceAccent },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  underline: { textDecorationLine: 'underline' },
});
