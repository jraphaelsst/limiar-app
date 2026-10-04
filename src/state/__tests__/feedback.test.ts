/// <reference types="jest" />
import { buildExportText } from '@/state/app-state';
import { feedbackLabel, feedbackOptions, isFeedbackMap } from '@/state/feedback';
import { KEYS } from '@/state/storage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('isFeedbackMap', () => {
  test('accepts an empty map and every known answer', () => {
    expect(isFeedbackMap({})).toBe(true);
    expect(isFeedbackMap({ 'act-0001': 'mais', 'act-0002': 'menos', 'act-0003': 'nao-combina' })).toBe(true);
  });

  test.each([
    ['null', null],
    ['an array', [['act-0001', 'mais']]],
    ['a string', 'mais'],
    ['an unknown answer', { 'act-0001': 'adoro' }],
    ['a non-string answer', { 'act-0001': 1 }],
    ['a null answer', { 'act-0001': null }],
    ['an empty id', { '': 'mais' }],
    ['free text in place of an answer', { 'act-0001': 'gostei muito, me lembrou minha mãe' }],
  ])('rejects %s', (_, v) => {
    expect(isFeedbackMap(v)).toBe(false);
  });

  test('rejects a non-plain object', () => {
    expect(isFeedbackMap(new Date())).toBe(false);
  });
});

describe('feedback options — spec §6 words', () => {
  test('verbatim, in order', () => {
    expect(feedbackOptions.map((o) => o.label)).toEqual(['Mais disso', 'Menos disso', 'Não combina comigo']);
    expect(feedbackLabel('nao-combina')).toBe('Não combina comigo');
  });

  test('the key is versioned', () => {
    expect(KEYS.feedback).toBe('limiar:v1:feedback');
  });
});

describe('buildExportText — feedback section', () => {
  const prefs = { onboardedAt: '2026-10-03T12:00:00.000Z', adultConfirmed: true as const, interests: [] };
  const now = new Date('2026-10-04T12:00:00.000Z');

  test('lists each answer readably, by activity title', () => {
    const text = buildExportText(prefs, [], now, [], { 'act-0001': 'mais', 'act-9999': 'nao-combina' });
    expect(text).toContain('Respostas sobre atividades (2)');
    expect(text).toContain('- Mapa da casa da infância: Mais disso');
    expect(text).toContain('- Uma atividade que saiu do catálogo desta versão: Não combina comigo');
  });

  test('says "Nenhuma" when there is none', () => {
    expect(buildExportText(prefs, [], now)).toContain('Respostas sobre atividades (0)\n- Nenhuma');
  });
});
