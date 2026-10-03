import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { color, size, space } from '@/theme';

type Props = {
  children: ReactNode;
  /** Pinned under the scroll area (e.g. a page CTA). Gets an opaque background. */
  footer?: ReactNode;
  /** Tab screens: the tab bar already handles the bottom inset. */
  edges?: readonly Edge[];
  scroll?: boolean;
};

/** Page container: background, safe areas, gutter, reading max-width, vertical rhythm. */
export function Screen({ children, footer, edges = ['top'], scroll = true }: Props) {
  const { width } = useWindowDimensions();
  const gutter = width < 360 ? size.gutterCompact : size.gutter;
  const inner = <View style={[styles.column, { paddingHorizontal: gutter }]}>{children}</View>;
  return (
    <SafeAreaView edges={edges} style={styles.root}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {inner}
        </ScrollView>
      ) : (
        <View style={[styles.scroll, styles.fill]}>{inner}</View>
      )}
      {footer && <View style={[styles.footer, { paddingHorizontal: gutter }]}>{footer}</View>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background },
  scroll: { paddingTop: space[2], paddingBottom: space[8] },
  fill: { flex: 1 },
  column: { width: '100%', maxWidth: size.readingMax, alignSelf: 'center', gap: space[6] },
  footer: { backgroundColor: color.background, paddingTop: space[3], paddingBottom: space[4], width: '100%', maxWidth: size.readingMax, alignSelf: 'center' },
});
