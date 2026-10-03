import { Pressable, StyleSheet } from 'react-native';

import { color, radius, size, space } from '@/theme';

import { AppText } from './AppText';

type Props = { label: string; selected: boolean; onPress: () => void };

/** One answer in a single-choice question ("Quanto tempo cabe agora?"). */
export function OptionPill({ label, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="radio"
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
