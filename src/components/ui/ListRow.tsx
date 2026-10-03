import { Pressable, StyleSheet, View } from 'react-native';

import { color, radius, size, space } from '@/theme';

import { AppText } from './AppText';
import { CaretRight, type Icon } from './icons';

type Props = {
  title: string;
  subtitle?: string;
  icon?: Icon;
  /** Without onPress the row is informational: no chevron, no press feedback, not announced as a button. */
  onPress?: () => void;
  trailing?: string;
};

/** Mockup S4 topic row: icon badge · serif title · caption · chevron. */
export function ListRow({ title, subtitle, icon: Glyph, onPress, trailing }: Props) {
  const body = (
    <>
      {Glyph && (
        <View style={styles.badge}>
          <Glyph size={22} color={color.primary} weight="light" />
        </View>
      )}
      <View style={styles.text}>
        <AppText variant="cardTitle">{title}</AppText>
        {subtitle && (
          <AppText variant="caption" color="textSubtle">
            {subtitle}
          </AppText>
        )}
      </View>
      {trailing && (
        <AppText variant="caption" color="textSubtle">
          {trailing}
        </AppText>
      )}
      {onPress && <CaretRight size={18} color={color.textSubtle} />}
    </>
  );
  if (!onPress) return <View style={styles.row}>{body}</View>;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.row, pressed && { backgroundColor: color.surfaceSunken }]}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
    backgroundColor: color.surface,
    borderRadius: radius.card,
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    minHeight: 72,
  },
  badge: {
    width: size.iconBadge,
    height: size.iconBadge,
    borderRadius: radius.pill,
    backgroundColor: color.tintWine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 2 },
});
