import { StyleSheet, View } from 'react-native';

import { color, palette } from '@/theme';

/**
 * Welcome hero — placeholder for the production collage (no photography,
 * decisions.md 2026-10-03): sun circle + torn paper bands, drawn with Views.
 * Swap for the commissioned asset without touching the screen.
 */
export function WelcomeCollage() {
  return (
    <View style={styles.frame} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={styles.sun} />
      <View style={[styles.band, { backgroundColor: palette.sand, bottom: 70, transform: [{ rotate: '-6deg' }] }]} />
      <View style={[styles.band, { backgroundColor: palette.charcoal, bottom: 40, transform: [{ rotate: '3deg' }] }]} />
      <View style={[styles.band, { backgroundColor: palette.wine, bottom: 8, height: 34, transform: [{ rotate: '-2deg' }] }]} />
      <View style={[styles.band, { backgroundColor: color.background, bottom: -30, height: 44, transform: [{ rotate: '1.5deg' }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { height: 240, overflow: 'hidden', marginHorizontal: -24 },
  sun: {
    position: 'absolute',
    left: '30%',
    top: 18,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: color.illustrationRed,
  },
  band: { position: 'absolute', left: -30, right: -30, height: 52 },
});
