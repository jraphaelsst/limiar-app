import { Platform } from 'react-native';

/**
 * Whether `Share.share` can open a share sheet here. Native: always. Web: only with the Web Share
 * API (most desktop browsers lack it, and react-native-web's Share rejects there) — callers then
 * show the text for her to copy instead.
 */
export function canShare(): boolean {
  return Platform.OS !== 'web' || (typeof navigator !== 'undefined' && typeof navigator.share === 'function');
}

/** web: navigator.share rejects with AbortError when the sheet is dismissed — a cancel, not a failure. */
export function isShareCancel(e: unknown): boolean {
  return e instanceof Error && e.name === 'AbortError';
}
