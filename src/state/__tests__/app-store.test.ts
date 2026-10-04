/// <reference types="jest" />
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createAppStore, createWriteQueue, isGameAResults, type Snapshot } from '@/state/app-store';
import { KEYS } from '@/state/storage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const setItem = AsyncStorage.setItem as jest.Mock;
const realSetItem = setItem.getMockImplementation()!;

/** The next setItem call takes `ms` before it really writes — a slow first write, overtaken by a fast second one. */
function slowNextWrite(ms: number) {
  setItem.mockImplementationOnce((k: string, v: string) => new Promise((r) => setTimeout(() => r(realSetItem(k, v)), ms)));
}

const stored = async (key: string) => {
  const raw = await AsyncStorage.getItem(key);
  return raw === null ? null : JSON.parse(raw);
};

const prefs = { onboardedAt: '2026-10-03T12:00:00.000Z', adultConfirmed: true, interests: [], availability: '60' };

let errorSpy: jest.SpyInstance;

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
  setItem.mockImplementation(realSetItem);
  errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => errorSpy.mockRestore());

describe('createWriteQueue', () => {
  test('runs tasks one at a time, in call order, even when an earlier one is slower', async () => {
    const enqueue = createWriteQueue();
    const log: string[] = [];
    const slow = enqueue(async () => {
      log.push('a:start');
      await new Promise((r) => setTimeout(r, 20));
      log.push('a:end');
    });
    const fast = enqueue(async () => {
      log.push('b:start');
      log.push('b:end');
    });
    await Promise.all([slow, fast]);
    expect(log).toEqual(['a:start', 'a:end', 'b:start', 'b:end']);
  });

  test('a failed task rejects only its own promise; the next one still runs', async () => {
    const enqueue = createWriteQueue();
    const failed = enqueue(async () => {
      throw new Error('disk full');
    });
    const next = enqueue(async () => 'ok');
    await expect(failed).rejects.toThrow('disk full');
    await expect(next).resolves.toBe('ok');
  });
});

describe('createAppStore — no resurrection', () => {
  test('a slow save then a remove: the removed result stays removed', async () => {
    const store = createAppStore();
    await store.init();
    const now = new Date('2026-10-03T10:00:00.000Z');
    slowNextWrite(30);
    const saving = store.saveGameAResult({ p1: 'a' }, now);
    const removing = store.removeGameAResult(now.toISOString());
    await Promise.all([saving, removing]);
    expect(await stored(KEYS.gameAResults)).toEqual([]);
    expect(store.committed.gameAResults).toEqual([]);
  });

  test('two quick removals both stick (each computes from the last committed list)', async () => {
    await AsyncStorage.setItem(
      KEYS.gameAResults,
      JSON.stringify([
        { savedAt: '2026-10-01T10:00:00.000Z', choices: {} },
        { savedAt: '2026-10-02T10:00:00.000Z', choices: {} },
      ]),
    );
    const store = createAppStore();
    await store.init();
    slowNextWrite(30);
    await Promise.all([store.removeGameAResult('2026-10-01T10:00:00.000Z'), store.removeGameAResult('2026-10-02T10:00:00.000Z')]);
    expect(await stored(KEYS.gameAResults)).toEqual([]);
  });

  test('a bookmark write in flight cannot rewrite the list after eraseAll', async () => {
    await AsyncStorage.setItem(KEYS.prefs, JSON.stringify(prefs));
    const store = createAppStore();
    await store.init();
    slowNextWrite(30);
    const saving = store.setSaved('act-0001', true);
    const erasing = store.eraseAll();
    await Promise.all([saving, erasing]);
    for (const k of Object.values(KEYS)) expect(await AsyncStorage.getItem(k)).toBeNull();
    expect(store.committed).toEqual({ prefs: undefined, savedIds: [], gameAResults: [], feedback: {} });
  });

  test('save, unsave, save in quick succession ends saved (order kept, idempotent)', async () => {
    const store = createAppStore();
    await store.init();
    slowNextWrite(30);
    await Promise.all([store.setSaved('x', true), store.setSaved('x', false), store.setSaved('x', true)]);
    expect(await stored(KEYS.saved)).toEqual(['x']);
  });

  test('a failed write rejects, leaves the committed value alone, and the next write builds on it', async () => {
    const store = createAppStore();
    await store.init();
    await store.setSaved('a', true);
    setItem.mockImplementationOnce(() => Promise.reject(new Error('disk full')));
    await expect(store.setSaved('b', true)).rejects.toThrow('disk full');
    expect(store.committed.savedIds).toEqual(['a']);
    await store.setSaved('c', true);
    expect(await stored(KEYS.saved)).toEqual(['c', 'a']);
  });

  test('the listener sees every commit and is told when the queue is idle', async () => {
    const seen: { saved: readonly string[]; idle: boolean }[] = [];
    const store = createAppStore((s: Snapshot, { idle }) => seen.push({ saved: s.savedIds, idle }));
    await store.init();
    await Promise.all([store.setSaved('a', true), store.setSaved('b', true)]);
    expect(seen).toEqual([
      { saved: [], idle: true },
      { saved: ['a'], idle: false },
      { saved: ['b', 'a'], idle: true },
    ]);
  });

  test('two results saved in the same millisecond get distinct ids', async () => {
    const store = createAppStore();
    await store.init();
    const now = new Date('2026-10-03T10:00:00.000Z');
    await Promise.all([store.saveGameAResult({}, now), store.saveGameAResult({}, now)]);
    const ids = store.committed.gameAResults.map((r) => r.savedAt);
    expect(new Set(ids).size).toBe(2);
  });
});

describe('createAppStore.init', () => {
  test('loads what is stored', async () => {
    await AsyncStorage.setItem(KEYS.prefs, JSON.stringify(prefs));
    await AsyncStorage.setItem(KEYS.saved, JSON.stringify(['act-0001']));
    const store = createAppStore();
    await expect(store.init()).resolves.toEqual({ prefs, savedIds: ['act-0001'], gameAResults: [], feedback: {} });
  });

  test('a storage error at startup is logged and the app starts empty — init still resolves (splash closes)', async () => {
    await AsyncStorage.setItem(KEYS.saved, JSON.stringify(['act-0001']));
    (AsyncStorage.getItem as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error('I/O error')));
    const store = createAppStore();
    await expect(store.init()).resolves.toEqual({ prefs: undefined, savedIds: [], gameAResults: [], feedback: {} });
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('could not read the stored data'), expect.any(Error));
    // Nothing is deleted on a read error: the data may be fine next launch.
    expect(await stored(KEYS.saved)).toEqual(['act-0001']);
  });

  test('writes queued before init finishes run after it, against the loaded values', async () => {
    await AsyncStorage.setItem(KEYS.saved, JSON.stringify(['old']));
    const store = createAppStore();
    const init = store.init();
    const saving = store.setSaved('new', true);
    await Promise.all([init, saving]);
    expect(await stored(KEYS.saved)).toEqual(['new', 'old']);
  });
});

describe('isGameAResults', () => {
  test('rejects an invalid savedAt date', () => {
    expect(isGameAResults([{ savedAt: 'not a date', choices: {} }])).toBe(false);
    expect(isGameAResults([{ savedAt: 42, choices: {} }])).toBe(false);
    expect(isGameAResults([{ savedAt: '2026-10-03T10:00:00.000Z', choices: {} }])).toBe(true);
  });
});

describe('createAppStore — feedback (spec §6)', () => {
  test('init loads stored feedback', async () => {
    await AsyncStorage.setItem(KEYS.feedback, JSON.stringify({ 'act-0001': 'mais' }));
    const store = createAppStore();
    expect((await store.init()).feedback).toEqual({ 'act-0001': 'mais' });
  });

  test('an invalid stored value is reset, and only that key', async () => {
    await AsyncStorage.setItem(KEYS.feedback, JSON.stringify({ 'act-0001': 'adoro' }));
    await AsyncStorage.setItem(KEYS.saved, JSON.stringify(['act-0002']));
    const store = createAppStore();
    const snap = await store.init();
    expect(snap.feedback).toEqual({});
    expect(snap.savedIds).toEqual(['act-0002']);
    expect(await AsyncStorage.getItem(KEYS.feedback)).toBeNull();
  });

  test('set, change and remove — each write lands in call order even when the first is slow', async () => {
    const store = createAppStore();
    await store.init();
    slowNextWrite(30);
    await Promise.all([
      store.setFeedback('a', 'mais'),
      store.setFeedback('b', 'nao-combina'),
      store.setFeedback('a', 'menos'),
      store.setFeedback('b', undefined),
    ]);
    expect(await stored(KEYS.feedback)).toEqual({ a: 'menos' });
    expect(store.committed.feedback).toEqual({ a: 'menos' });
  });

  test('a slow answer then a removal: the removed answer stays removed', async () => {
    const store = createAppStore();
    await store.init();
    slowNextWrite(30);
    await Promise.all([store.setFeedback('a', 'mais'), store.setFeedback('a', undefined)]);
    expect(await stored(KEYS.feedback)).toEqual({});
  });

  test('repeating the same answer writes nothing', async () => {
    const store = createAppStore();
    await store.init();
    await store.setFeedback('a', 'mais');
    setItem.mockClear();
    await store.setFeedback('a', 'mais');
    await store.setFeedback('z', undefined);
    expect(setItem).not.toHaveBeenCalled();
  });

  test('clearFeedback removes every answer and keeps the rest', async () => {
    await AsyncStorage.setItem(KEYS.saved, JSON.stringify(['act-0002']));
    const store = createAppStore();
    await store.init();
    await store.setFeedback('a', 'mais');
    await store.setFeedback('b', 'menos');
    await store.clearFeedback();
    expect(await stored(KEYS.feedback)).toEqual({});
    expect(store.committed.savedIds).toEqual(['act-0002']);
  });

  test('a feedback write in flight cannot rewrite it after eraseAll', async () => {
    await AsyncStorage.setItem(KEYS.prefs, JSON.stringify(prefs));
    const store = createAppStore();
    await store.init();
    slowNextWrite(30);
    await Promise.all([store.setFeedback('act-0001', 'nao-combina'), store.eraseAll()]);
    expect(await AsyncStorage.getItem(KEYS.feedback)).toBeNull();
    expect(store.committed.feedback).toEqual({});
  });

  test('a failed feedback write rejects and leaves the committed answers alone', async () => {
    const store = createAppStore();
    await store.init();
    await store.setFeedback('a', 'mais');
    setItem.mockImplementationOnce(() => Promise.reject(new Error('disk full')));
    await expect(store.setFeedback('a', 'menos')).rejects.toThrow('disk full');
    expect(store.committed.feedback).toEqual({ a: 'mais' });
  });
});
