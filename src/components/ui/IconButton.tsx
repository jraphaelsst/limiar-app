import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { color, radius, size } from '@/theme';

import type { Icon } from './icons';

type Tone = 'plain' | 'surface' | 'primary';

type Props = Omit<PressableProps, 'children' | 'style'> & {
  icon: Icon;
  /** Required: the accessible name ("Salvar", "Voltar"…). Icon-only controls must be named. */
  label: string;
  tone?: Tone;
  selected?: boolean;
  diameter?: number;
};

export function IconButton({ icon: Glyph, label, tone = 'plain', selected = false, diameter = size.touchMin, ...rest }: Props) {
  const fg = tone === 'primary' ? color.textOnPrimary : selected ? color.primary : color.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      hitSlop={diameter < size.touchMin ? (size.touchMin - diameter) / 2 : undefined}
      {...rest}
      style={({ pressed }) => [
        styles.base,
        { width: diameter, height: diameter },
        tone === 'surface' && { backgroundColor: color.surface },
        tone === 'primary' && { backgroundColor: pressed ? color.primaryPressed : color.primary },
        pressed && tone !== 'primary' && { opacity: 0.6 },
      ]}>
      <Glyph size={Math.round(diameter * 0.5)} color={fg} weight={selected ? 'fill' : tone === 'primary' ? 'regular' : 'light'} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill },
});
