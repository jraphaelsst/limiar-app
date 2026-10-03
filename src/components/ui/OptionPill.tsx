import { Pressable, StyleSheet } from 'react-native';

import { color, radius, size, space } from '@/theme';

import { AppText } from './AppText';

type Props = { label: string; selected: boolean; onPress: () => void; multiple?: boolean };

/** One answer in a choice question: single-choice (radio) by default, `multiple` for checkbox lists. */
export function OptionPill({ label, selected, onPress, multiple = false }: Props) {
  return (
    <Pressable
      accessibilityRole={multiple ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        selected && styles.selected,
        pressed && !selected && { backgroundColor: color.surfaceSunken },
      ]}>
      <AppText variant="label" color={selected ? 'textOnPrimary' : 'text'}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    minHeight: size.touchMin + 4,
    justifyContent: 'center',
    paddingHorizontal: space[5],
    borderRadius: radius.card,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.divider,
  },
  selected: { backgroundColor: color.primary, borderColor: color.primary },
});
