/// <reference types="jest" />
import { intentHref, intents } from '@/data/intents';
import { reflectionsFor, themes } from '@/data/reflexoes';
import {
  backGoesToPreviousCard,
  cardLabel,
  choiceLabel,
  choicesFor,
  isLastCard,
  nextCard,
  previousCard,
  startIndex,
} from '@/lib/reflexao';

describe('card navigation (screen 14)', () => {
  test('"Quero pensar mais" walks the theme and never runs past the last card', () => {
    expect(nextCard(0, 3)).toBe(1);
    expect(nextCard(1, 3)).toBe(2);
    expect(nextCard(2, 3)).toBe(2);
  });

  test('a full walk through every theme reaches each card once, in order', () => {
    for (const t of themes) {
      const cards = reflectionsFor(t.id);
      const seen = [0];
      while (!isLastCard(seen[seen.length - 1], cards.length)) seen.push(nextCard(seen[seen.length - 1], cards.length));
      expect(seen.map((i) => cards[i].reflectionId)).toEqual(cards.map((c) => c.reflectionId));
    }
  });

  test('back from card N>1 goes to the previous card; on the card she opened, back leaves', () => {
    expect(backGoesToPreviousCard(0, 0)).toBe(false);
    expect(backGoesToPreviousCard(1, 0)).toBe(true);
    expect(previousCard(2, 0)).toBe(1);
    expect(previousCard(1, 0)).toBe(0);
  });

  test('opened at card 2 (from Salvos): back on it leaves; back from card 3 returns to card 2, never to card 1', () => {
    expect(backGoesToPreviousCard(1, 1)).toBe(false);
    expect(backGoesToPreviousCard(2, 1)).toBe(true);
    expect(previousCard(2, 1)).toBe(1);
    expect(previousCard(1, 1)).toBe(1);
  });

  test('at most two choices, ever (spec §20); the last card swaps "pensar mais" for "outro tema"', () => {
    expect(choicesFor(0, 3)).toEqual({ primary: 'pensar-mais', secondary: 'fazer-algo' });
    expect(choicesFor(1, 3)).toEqual({ primary: 'pensar-mais', secondary: 'fazer-algo' });
    expect(choicesFor(2, 3)).toEqual({ primary: 'fazer-algo', secondary: 'outro-tema' });
    for (let i = 0; i < 3; i++) {
      const c = choicesFor(i, 3);
      expect(c.primary).not.toBe(c.secondary);
      expect(Object.keys(c)).toHaveLength(2);
    }
  });

  test('labels are the spec §4.7 words', () => {
    expect(choiceLabel['pensar-mais']).toBe('Quero pensar mais');
    expect(choiceLabel['fazer-algo']).toBe('Prefiro fazer algo agora');
  });

  test('progress in words', () => {
    expect(cardLabel(0, 3)).toBe('Cartão 1 de 3');
    expect(cardLabel(2, 3)).toBe('Cartão 3 de 3');
  });

  test.each([
    [undefined, 0],
    ['1', 0],
    ['2', 1],
    ['3', 2],
    ['4', 0],
    ['0', 0],
    ['-1', 0],
    ['1.5', 0],
    ['abc', 0],
    ['', 0],
  ] as const)('startIndex(%j, 3) → %d', (param, expected) => {
    expect(startIndex(param, 3)).toBe(expected);
  });
});

describe('Home intent (spec §4.2)', () => {
  test('all six intents in the spec order, "pensar" included', () => {
    expect(intents.map((i) => i.label)).toEqual([
      'Quero fazer alguma coisa',
      'Quero criar',
      'Quero sair',
      'Quero aprender algo',
      'Quero pensar sobre uma situação',
      'Estou sem ideia do que fazer',
    ]);
  });

  test('"Quero pensar sobre uma situação" opens the theme screen; the others open the sofa with their preset', () => {
    expect(intentHref('pensar')).toEqual({ pathname: '/reflexao' });
    expect(intentHref('criar')).toEqual({ pathname: '/sofa', params: { preset: 'criar' } });
  });
});
