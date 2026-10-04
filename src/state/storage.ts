/**
 * On-device persistence. Everything stays on this phone (spec §10.1 minimisation);
 * nothing here is sent anywhere. Keys are versioned so a future shape change can
 * migrate instead of misreading old data.
 *
 * Never store free text typed by the user here without an explicit "save"
 * action (spec §6) — today only ids and enum choices are stored (a saved reflection is
 * the id of a curated card; nothing she typed, because there is no typing yet).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  prefs: 'limiar:v1:prefs',
  saved: 'limiar:v1:saved',
  /** Game A results the user explicitly chose to keep — option ids only, never text. */
  gameAResults: 'limiar:v1:game-a-results',
  /** Spec §6 "mais disso / menos disso / não combina comigo" — activity id → enum, never text. */
  feedback: 'limiar:v1:feedback',
  /** Guided-reflection cards she bookmarked (spec §4.7, §13 saved_reflections) — card ids only, never text. */
  savedReflections: 'limiar:v1:saved-reflections',
} as const;

type Key = (typeof KEYS)[keyof typeof KEYS];

/**
 * Reads and validates one key. Unreadable or invalid data is not silently
 * ignored: it is reported, removed, and the caller gets `undefined` (fresh start).
 */
export async function load<T>(key: Key, isValid: (v: unknown) => v is T): Promise<T | undefined> {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) return undefined;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (isValid(parsed)) return parsed;
    console.error(`[storage] ${key}: stored value has an unexpected shape; resetting it.`);
  } catch (e) {
    console.error(`[storage] ${key}: stored value is not valid JSON; resetting it.`, e);
  }
  await AsyncStorage.removeItem(key);
  return undefined;
}

export function save(key: Key, value: unknown): Promise<void> {
  return AsyncStorage.setItem(key, JSON.stringify(value));
}

/** Spec §10.3: the user can delete everything the app keeps. */
export function clearAll(): Promise<void> {
  return AsyncStorage.multiRemove(Object.values(KEYS));
}
