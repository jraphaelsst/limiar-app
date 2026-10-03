import { StyleSheet, View } from 'react-native';

import { color, radius, space } from '@/theme';

import { AppText } from './AppText';
import { Check } from './icons';

/** Informational list item (mockup S3). Deliberately NOT a checkbox: no press, no state. */
export function CheckItem({ text }: { text: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.dot}>
        <Check size={14} color={color.primary} weight="bold" />
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
    width: 26,
    height: 26,
    marginTop: 1,
    borderRadius: radius.pill,
    backgroundColor: color.tintWine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1 },
});
