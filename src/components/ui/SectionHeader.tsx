import { Pressable, StyleSheet, View } from 'react-native';

import { color, space } from '@/theme';

import { AppText } from './AppText';
import { ArrowRight } from './icons';

type Props = { title: string; action?: { label: string; onPress: () => void } };

export function SectionHeader({ title, action }: Props) {
  return (
    <View style={styles.row}>
      <AppText variant="h3" style={styles.title}>
        {title}
      </AppText>
      {action && (
        <Pressable accessibilityRole="link" onPress={action.onPress} hitSlop={14} style={({ pressed }) => [styles.action, pressed && { opacity: 0.6 }]}>
          <AppText variant="caption" color="textBody">
            {action.label}
          </AppText>
          <ArrowRight size={16} color={color.textBody} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: space[3] },
  title: { flexShrink: 1 },
  action: { flexDirection: 'row', alignItems: 'center', gap: space[1] },
});
