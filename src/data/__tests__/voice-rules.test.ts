/// <reference types="jest" />
import { avoidedWord, voiceProblems } from './voice-rules';

// The helper must actually catch what it names — a regex that matches nothing passes every content test.
describe('voiceProblems', () => {
  test.each([
    ['Que dia bom!', 'exclamação'],
    ['Você precisa sair mais.', 'prescritivo'],
    ['Conte comigo nessa fase.', 'intimidade falsa'],
    ['Uma fase de muita ansiedade.', 'palavra evitada'],
    ['Não é falta de tempo, é falta de vontade.', 'não é X, é Y'],
  ])('flags %j as %s', (text, rule) => {
    expect(voiceProblems(text)).toContain(rule);
  });

  test('a plain sentence in the app voice has no problems', () => {
    expect(voiceProblems('Escolha uma música de outra década e ouça inteira, sem fazer outra coisa.')).toEqual([]);
  });

  // `\b` would split at accented letters; the whole-word rule must not.
  test.each([
    ['condor', undefined],
    ['fortemente', undefined],
    ['curadoria', undefined],
    ['a dor', 'dor'],
    ['terapêutica', 'terapêutica'],
    ['é forte.', 'forte'],
  ])('avoidedWord(%j) is %j', (text, word) => {
    expect(avoidedWord(text)).toBe(word);
  });
});
