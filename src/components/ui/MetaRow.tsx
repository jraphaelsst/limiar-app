import { StyleSheet, View } from 'react-native';

import { color, space } from '@/theme';

import { AppText } from './AppText';
import type { Icon } from './icons';

/**
 * Facts about a piece of content (time, energy, place). Only real data:
 * no engagement counts — spec §4.5/§23 (no social metrics; conflict C3).
 */
export function MetaRow({ items }: { items: readonly { icon: Icon; label: string }[] }) {
  return (
    <View style={styles.row}>
      {items.map(({ icon: Glyph, label }) => (
        <View key={label} style={styles.item}>
          <Glyph size={18} color={color.textBody} weight="light" />
          <AppText variant="caption" color="textBody">
            {label}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', columnGap: space[5], rowGap: space[2] },
  item: { flexDirection: 'row', alignItems: 'center', gap: space[1] + 2 },
});
