/**
 * Screen-reader helpers. The two platforms differ:
 * - Android and web read text marked with `accessibilityLiveRegion` when it
 *   changes — keep using that on the visible status text;
 * - iOS VoiceOver ignores live regions, so the same message is announced here.
 * Call `announce` with the exact words the screen shows; never announce
 * something that is not on screen.
 */
import { useEffect, useRef, type RefObject } from 'react';
import { AccessibilityInfo, Platform, type Text, type View } from 'react-native';

/** iOS only (Android/web get it from the live region on the visible text). */
export function announce(message: string, { queue = false }: { queue?: boolean } = {}): void {
  if (Platform.OS !== 'ios') return;
  AccessibilityInfo.announceForAccessibilityWithOptions(message, { queue });
}

/**
 * Moves the screen-reader cursor to `target` (usually the new h1 after a step
 * swaps the content in place — otherwise VoiceOver/TalkBack stay on a node that
 * no longer exists). Native only: on web a heading is not focusable and moving
 * the browser focus would be a different behaviour.
 */
export function focusForAccessibility(target: View | Text | null): void {
  if (Platform.OS === 'web' || !target) return;
  // The host-instance API: unlike setAccessibilityFocus(findNodeHandle(…)), it routes through the
  // renderer and so works on the New Architecture (always on in SDK 57).
  AccessibilityInfo.sendAccessibilityEvent(target, 'focus');
}

/**
 * After a step/content swap (`key` changes — not on the first render, where
 * the navigator already places focus), focus `ref` and then, on iOS, queue
 * `message` (e.g. "Rodada 2 de 8") behind what VoiceOver reads for it.
 * The delay lets the new content lay out before focus moves.
 */
export function useFocusOnChange(ref: RefObject<View | Text | null>, key: string | number, message?: string): void {
  const last = useRef(key);
  useEffect(() => {
    if (last.current === key) return; // first render (and StrictMode's re-run of it)
    last.current = key;
    const t = setTimeout(() => {
      focusForAccessibility(ref.current);
      if (message) announce(message, { queue: true });
    }, 150);
    return () => clearTimeout(t);
    // `message` follows `key`; re-running for it alone would re-announce the same step.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
