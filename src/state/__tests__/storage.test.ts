/// <reference types="jest" />
import AsyncStorage from '@react-native-async-storage/async-storage';

import { KEYS, clearAll, load, save } from '@/state/storage';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const isIdList = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string');

let errorSpy: jest.SpyInstance;

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
  errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => errorSpy.mockRestore());

describe('load', () => {
  test('returns undefined for a missing key, without logging or removing', async () => {
    await expect(load(KEYS.saved, isIdList)).resolves.toBeUndefined();
    expect(errorSpy).not.toHaveBeenCalled();
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
  });

  test('returns the parsed value when it is valid', async () => {
    await save(KEYS.saved, ['act-0001', 'act-0002']);
    await expect(load(KEYS.saved, isIdList)).resolves.toEqual(['act-0001', 'act-0002']);
    expect(errorSpy).not.toHaveBeenCalled();
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
  });

  test('invalid JSON: logs, removes the key, returns undefined', async () => {
    await AsyncStorage.setItem(KEYS.saved, '{not json');
    await expect(load(KEYS.saved, isIdList)).resolves.toBeUndefined();
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy.mock.calls[0][0]).toContain('not valid JSON');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(KEYS.saved);
    await expect(AsyncStorage.getItem(KEYS.saved)).resolves.toBeNull();
  });

  test('wrong shape: logs, removes the key, returns undefined', async () => {
    await AsyncStorage.setItem(KEYS.saved, JSON.stringify({ not: 'a list' }));
    await expect(load(KEYS.saved, isIdList)).resolves.toBeUndefined();
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy.mock.calls[0][0]).toContain('unexpected shape');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(KEYS.saved);
    await expect(AsyncStorage.getItem(KEYS.saved)).resolves.toBeNull();
  });

  test('only the bad key is reset', async () => {
    await AsyncStorage.setItem(KEYS.saved, 'oops');
    await save(KEYS.prefs, { ok: true });
    await load(KEYS.saved, isIdList);
    await expect(AsyncStorage.getItem(KEYS.prefs)).resolves.toBe('{"ok":true}');
  });
});

describe('clearAll', () => {
  test('removes every app key', async () => {
    await save(KEYS.prefs, { a: 1 });
    await save(KEYS.saved, ['x']);
    await AsyncStorage.setItem('other:key', 'kept');
    await clearAll();
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(Object.values(KEYS));
    for (const k of Object.values(KEYS)) await expect(AsyncStorage.getItem(k)).resolves.toBeNull();
    await expect(AsyncStorage.getItem('other:key')).resolves.toBe('kept');
  });
});
