import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Chip, Icons } from '@/components/ui';
import { categoryLabel, formatDuration, type Activity } from '@/data/activities';
import { color, radius, space } from '@/theme';

type Props = { activity: Activity; onPress: () => void };

/** Mockup S2 compact card ("Para você hoje"): chip · serif title · wine arrow. */
export function ActivityCard({ activity, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${activity.title}, ${formatDuration(activity.durationMin)}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}>
      <Chip label={categoryLabel[activity.category]} tone={activity.category === 'sair' ? 'charcoal' : 'wine'} />
      <AppText variant="cardTitle" style={styles.title}>
        {activity.title}
      </AppText>
      <View style={styles.foot}>
        <AppText variant="caption" color="text">
          {formatDuration(activity.durationMin)}
        </AppText>
        <View style={styles.arrow}>
          <Icons.ArrowRight size={16} color={color.textOnPrimary} weight="regular" />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 150,
    backgroundColor: color.surfaceAccent,
    borderRadius: radius.card,
    padding: space[3],
    gap: space[2],
  },
  title: { flex: 1 },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  arrow: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
