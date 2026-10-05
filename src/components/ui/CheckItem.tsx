import { StyleSheet, View } from 'react-native';

import { color, radius, space } from '@/theme';

import { AppText } from './AppText';
import { Check } from './icons';

/**
 * Informational list item (mockup S3). Deliberately NOT a checkbox: no press, no state.
 * `mark="dot"` for neutral statements — a check next to "não pedimos seu CPF" would read as the opposite.
 */
export function CheckItem({ text, mark = 'check' }: { text: string; mark?: 'check' | 'dot' }) {
  return (
    <View style={styles.row}>
      <View style={styles.dot}>
        {mark === 'check' ? <Check size={14} color={color.primary} weight="bold" /> : <View style={styles.pip} />}
      </View>
      <AppText variant="bodySmall" color="textBody" style={styles.text}>
        {text}
      </AppText>
    </View>
  );
}

/** Numbered variant for activity steps. */
export function StepItem({ n, text }: { n: number; text: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.dot}>
        <AppText variant="tabLabel" color="primary">
          {n}
        </AppText>
      </View>
      <AppText variant="body" color="textBody" style={styles.text}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: space[3] },
  dot: {
    minWidth: 26,
    minHeight: 26,
    marginTop: 1,
    borderRadius: radius.pill,
    backgroundColor: color.tintWine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1 },
  pip: { width: 6, height: 6, borderRadius: 3, backgroundColor: color.primary },
});
