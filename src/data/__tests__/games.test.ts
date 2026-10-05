/// <reference types="jest" />
import { directionLabel, games, pairs, reflectionQuestion, roleCards, stances } from '@/data/games';

import { avoidedWord, voiceProblems } from './voice-rules';

// Every line of game copy the user reads (spec §4.5), in the same voice as the rest of the app.
const lines: readonly (readonly [where: string, text: string])[] = [
  ...games.flatMap((g) => [[`${g.id} título`, g.title] as const, [`${g.id} descrição`, g.description] as const]),
  ...pairs.flatMap((p) => p.options.map((o) => [`par ${p.id}`, o.label] as const)),
  ...stances.map((s) => [`postura ${s.id}`, s.label] as const),
  ...roleCards.map((c) => [`cartão ${c.id}`, c.text] as const),
  ...Object.entries(reflectionQuestion).map(([k, q]) => [`pergunta ${k}`, q] as const),
  ...Object.entries(directionLabel).map(([k, l]) => [`botão ${k}`, l] as const),
];

describe('voice of the games (spec §2, §4.5)', () => {
  test.each(lines)('%s reads in the app voice', (_where, text) => {
    expect({ problems: voiceProblems(text), word: avoidedWord(text) }).toEqual({ problems: [], word: undefined });
  });
});
