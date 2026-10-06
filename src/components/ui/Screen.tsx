import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { color, size, space } from '@/theme';

type Props = {
  children: ReactNode;
  /**
   * The page's actions (e.g. its CTA). Not pinned: it is the END of the scrolling content, pushed to the
   * bottom of the screen when the page is shorter than the screen. Pinned, it covered the content at large
   * text sizes (simulator sweep 2026-10-05: half the screen on the step view, all of it on reflection cards);
   * in the flow it looks the same at normal sizes and scrolls with the content when the text is large.
   */
  footer?: ReactNode;
  /** Tab screens: the tab bar already handles the bottom inset. */
  edges?: readonly Edge[];
  scroll?: boolean;
};

/** Page container: background, safe areas, gutter, reading max-width, vertical rhythm. */
export function Screen({ children, footer, edges = ['top'], scroll = true }: Props) {
  const { width } = useWindowDimensions();
  const gutter = width < 360 ? size.gutterCompact : size.gutter;
  const inner = (
    <View style={[styles.column, { paddingHorizontal: gutter }]}>
      {children}
      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );
  return (
    <SafeAreaView edges={edges} style={styles.root}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {inner}
        </ScrollView>
      ) : (
        <View style={[styles.scroll, styles.fill]}>{inner}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background },
  // flexGrow lets the column fill a short page, so `footer`'s marginTop:'auto' can push it to the bottom.
  scroll: { flexGrow: 1, paddingTop: space[2], paddingBottom: space[6] },
  fill: { flex: 1 },
  column: { flexGrow: 1, width: '100%', maxWidth: size.readingMax, alignSelf: 'center', gap: space[6] },
  footer: { marginTop: 'auto', paddingTop: space[2] },
});
