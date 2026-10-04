/// <reference types="jest" />
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createAppStore, isReflectionIdList } from '@/state/app-store';
import { buildExportText } from '@/state/app-state';
import { KEYS } from '@/state/storage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const setItem = AsyncStorage.setItem as jest.Mock;
const realSetItem = setItem.getMockImplementation()!;

function slowNextWrite(ms: number) {
  setItem.mockImplementationOnce((k: string, v: string) => new Promise((r) => setTimeout(() => r(realSetItem(k, v)), ms)));
}

const stored = async (key: string) => {
  const raw = await AsyncStorage.getItem(key);
  return raw === null ? null : JSON.parse(raw);
};

let errorSpy: jest.SpyInstance;

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
  setItem.mockImplementation(realSetItem);
  errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => errorSpy.mockRestore());

describe('saved reflections — storage key', () => {
  test('is versioned and separate from saved activities', () => {
    expect(KEYS.savedReflections).toBe('limiar:v1:saved-reflections');
    expect(KEYS.savedReflections).not.toBe(KEYS.saved);
  });

  test('validator accepts card ids only — never text, never duplicates', () => {
    expect(isReflectionIdList([])).toBe(true);
    expect(isReflectionIdList(['ref-0001', 'ref-0024'])).toBe(true);
    expect(isReflectionIdList(['Hoje pensei que…'])).toBe(false);
    expect(isReflectionIdList(['act-0001'])).toBe(false);
    expect(isReflectionIdList(['ref-0001', 'ref-0001'])).toBe(false);
    expect(isReflectionIdList([{ id: 'ref-0001', text: 'x' }])).toBe(false);
    expect(isReflectionIdList('ref-0001')).toBe(false);
  });
});

describe('createAppStore — saved reflections', () => {
  test('init loads stored ids', async () => {
    await AsyncStorage.setItem(KEYS.savedReflections, JSON.stringify(['ref-0002']));
    const store = createAppStore();
    expect((await store.init()).savedReflectionIds).toEqual(['ref-0002']);
  });

  test('an invalid stored value (e.g. text) is reset, and only that key', async () => {
    await AsyncStorage.setItem(KEYS.saved, JSON.stringify(['act-0001']));
    await AsyncStorage.setItem(KEYS.savedReflections, JSON.stringify(['um texto qualquer']));
    const store = createAppStore();
    const snap = await store.init();
    expect(snap.savedReflectionIds).toEqual([]);
    expect(snap.savedIds).toEqual(['act-0001']);
    expect(await stored(KEYS.savedReflections)).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining(KEYS.savedReflections));
  });

  test('save stores the id only, newest first; unsave removes it', async () => {
    const store = createAppStore();
    await store.init();
    await store.setReflectionSaved('ref-0001', true);
    await store.setReflectionSaved('ref-0005', true);
    expect(await stored(KEYS.savedReflections)).toEqual(['ref-0005', 'ref-0001']);
    await store.setReflectionSaved('ref-0001', false);
    expect(await stored(KEYS.savedReflections)).toEqual(['ref-0005']);
    expect(store.committed.savedReflectionIds).toEqual(['ref-0005']);
  });

  test('saving the same card twice writes once (idempotent)', async () => {
    const store = createAppStore();
    await store.init();
    await store.setReflectionSaved('ref-0003', true);
    setItem.mockClear();
    await store.setReflectionSaved('ref-0003', true);
    expect(setItem).not.toHaveBeenCalled();
  });

  test('refuses anything that is not a card id — nothing is written', async () => {
    const store = createAppStore();
    await store.init();
    await expect(store.setReflectionSaved('o que eu pensei hoje', true)).rejects.toThrow('invalid reflection id');
    expect(await stored(KEYS.savedReflections)).toBeNull();
    expect(store.committed.savedReflectionIds).toEqual([]);
  });

  test('a slow save then an unsave: the unsaved card stays unsaved (one queue)', async () => {
    const store = createAppStore();
    await store.init();
    slowNextWrite(30);
    await Promise.all([store.setReflectionSaved('ref-0007', true), store.setReflectionSaved('ref-0007', false)]);
    expect(await stored(KEYS.savedReflections)).toEqual([]);
  });

  test('a reflection write in flight cannot rewrite the list after eraseAll', async () => {
    const store = createAppStore();
    await store.init();
    slowNextWrite(30);
    await Promise.all([store.setReflectionSaved('ref-0001', true), store.eraseAll()]);
    expect(await AsyncStorage.getItem(KEYS.savedReflections)).toBeNull();
    expect(store.committed.savedReflectionIds).toEqual([]);
  });

  test('eraseAll removes the saved reflections key with everything else', async () => {
    const store = createAppStore();
    await store.init();
    await store.setReflectionSaved('ref-0010', true);
    await store.eraseAll();
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(expect.arrayContaining([KEYS.savedReflections]));
    expect(await AsyncStorage.getItem(KEYS.savedReflections)).toBeNull();
  });

  test('saving a reflection leaves saved activities alone', async () => {
    const store = createAppStore();
    await store.init();
    await store.setSaved('act-0001', true);
    await store.setReflectionSaved('ref-0001', true);
    expect(await stored(KEYS.saved)).toEqual(['act-0001']);
    expect(await stored(KEYS.savedReflections)).toEqual(['ref-0001']);
  });
});

describe('buildExportText — saved reflections', () => {
  const prefs = { onboardedAt: '2026-10-03T12:00:00.000Z', adultConfirmed: true as const, interests: [] };
  const now = new Date('2026-10-04T12:00:00.000Z');

  test('names each saved card by theme and title', () => {
    const text = buildExportText(prefs, [], now, [], {}, ['ref-0013', 'ref-9999']);
    expect(text).toContain('Cartões de reflexão guardados (2)');
    expect(text).toContain('- Amizades: Quem está por perto');
    expect(text).toContain('- Um cartão que saiu do app nesta versão');
  });

  test('says "Nenhum" when there is none', () => {
    expect(buildExportText(prefs, [], now)).toContain('Cartões de reflexão guardados (0)\n- Nenhum');
  });
});
