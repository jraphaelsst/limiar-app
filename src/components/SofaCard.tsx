import { StyleSheet, View } from 'react-native';

import { AppText, Button } from '@/components/ui';
import { color, radius, space } from '@/theme';

/**
 * The Home's lead card — "Me tira do sofá" is the product's core feature (spec §4.3),
 * so it takes the mockup's "Destaque da semana" slot. The shapes are a placeholder
 * for the production collage asset (sun circle + torn band), drawn with Views so no
 * text is ever baked into an image.
 */
export function SofaCard({ onStart }: { onStart: () => void }) {
  return (
    <View style={styles.card}>
      <View style={styles.sun} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />
      <View style={styles.band} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />
      <View style={styles.content}>
        <AppText variant="h2" style={styles.title}>
          Me tira do sofá
        </AppText>
        <AppText variant="bodySmall" color="text" style={styles.copy}>
          Quatro escolhas rápidas e uma ideia de cada vez.
        </AppText>
        <View style={styles.cta}>
          <Button label="Bora escolher" variant="secondary" arrow onPress={onStart} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: color.surfaceAccent, borderRadius: radius.card, overflow: 'hidden', minHeight: 210 },
  sun: {
    position: 'absolute',
    right: -40,
    top: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: color.illustrationRed,
  },
  band: {
    position: 'absolute',
    left: -20,
    right: -20,
    bottom: -38,
    height: 70,
    backgroundColor: color.chipCharcoal,
    opacity: 0.9,
    transform: [{ rotate: '-4deg' }],
  },
  content: { padding: space[5], gap: space[2], flex: 1 },
  title: { maxWidth: '62%' },
  copy: { maxWidth: '62%' },
  cta: { marginTop: 'auto', paddingTop: space[3], alignItems: 'flex-start', zIndex: 1 },
});
