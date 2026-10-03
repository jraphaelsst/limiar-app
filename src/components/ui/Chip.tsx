import { StyleSheet, View } from 'react-native';

import { color, radius, space } from '@/theme';

import { AppText } from './AppText';

type Tone = 'wine' | 'charcoal' | 'sand';

const ground: Record<Tone, string> = { wine: color.chipWine, charcoal: color.chipCharcoal, sand: color.chipSand };

/** Non-interactive category label. Uppercase is applied by the `chip` type style. */
export function Chip({ label, tone = 'sand' }: { label: string; tone?: Tone }) {
  return (
    <View style={[styles.chip, { backgroundColor: ground[tone] }]}>
      <AppText variant="chip" color={tone === 'sand' ? 'textOnAccent' : 'textOnPrimary'}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { alignSelf: 'flex-start', borderRadius: radius.pill, paddingHorizontal: space[3], paddingVertical: space[1] },
});
