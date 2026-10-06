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
        disabled && variant !== 'quiet' && styles.disabled,
        disabled && variant === 'quiet' && { opacity: 0.5 },
      ]}>
      <View style={styles.row}>
        <AppText
          variant={variant === 'quiet' ? 'link' : 'button'}
          style={[styles.label, { color: disabled ? color.textBody : fg }, variant === 'quiet' && styles.underline]}>
          {label}
        </AppText>
        {arrow && <ArrowRight size={20} color={disabled ? color.textBody : fg} weight="regular" />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // A wrapped label makes the button taller: a radius of half the normal height keeps the pill shape at
  // one line and becomes a rounded rectangle when taller, instead of semicircular ends that cut letters.
  base: { alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill },
  primary: { backgroundColor: color.primary, minHeight: size.buttonHeight, paddingHorizontal: space[6], paddingVertical: space[3], borderRadius: size.buttonHeight / 2 },
  secondary: { backgroundColor: color.surface, minHeight: size.touchMin, paddingHorizontal: space[5], paddingVertical: space[2], borderRadius: size.touchMin / 2 },
  quiet: { minHeight: size.touchMin, paddingHorizontal: space[2] },
  full: { alignSelf: 'stretch' },
  disabled: { backgroundColor: color.surfaceAccent },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3], maxWidth: '100%' },
  label: { flexShrink: 1, textAlign: 'center' },
  underline: { textDecorationLine: 'underline' },
});
