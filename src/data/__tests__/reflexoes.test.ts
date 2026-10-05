/// <reference types="jest" />
import {
  cardWordCount,
  findReflection,
  findTheme,
  reflectionsFor,
  reflexoes,
  themes,
  type ThemeId,
} from '@/data/reflexoes';

import { avoidedWord, voiceProblems } from './voice-rules';

// Record<Union, true> fails to compile if a member is missing or extra — the runtime check stays exhaustive.
const themeIds: Record<ThemeId, true> = {
  'filhos-adultos': true,
  relacionamento: true,
  'rotina-e-tempo': true,
  'trabalho-e-projetos': true,
  amizades: true,
  'quem-sou-hoje': true,
  'planos-e-interesses': true,
  'outro-assunto': true,
};

const textOf = (r: (typeof reflexoes)[number]) => [r.title, r.body, ...r.lentes].join('\n');

describe('themes (spec §4.7)', () => {
  test('exactly the 8 themes of the spec, in its order and words', () => {
    expect(themes.map((t) => t.label)).toEqual([
      'Filhos adultos',
      'Relacionamento',
      'Rotina e tempo',
      'Trabalho e projetos',
      'Amizades',
      'Quem sou hoje',
      'Planos e interesses',
      'Outro assunto dentro da proposta do app',
    ]);
    expect(themes.map((t) => t.id).sort()).toEqual(Object.keys(themeIds).sort());
  });

  test('findTheme only knows the 8 ids', () => {
    expect(findTheme('amizades')?.label).toBe('Amizades');
    expect(findTheme('vazio')).toBeUndefined();
    expect(findTheme(undefined)).toBeUndefined();
  });

  test.each(themes.map((t) => [t.id] as const))('%s has 3 cards', (id) => {
    expect(reflectionsFor(id)).toHaveLength(3);
  });
});

describe('reflection cards — governance (spec §22)', () => {
  test('reflectionId is unique', () => {
    const ids = reflexoes.map((r) => r.reflectionId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('ids are stable: ref-0001…ref-0024 are all still in the catalog (retire by status, never delete)', () => {
    for (let n = 1; n <= 24; n++) expect(findReflection(`ref-${String(n).padStart(4, '0')}`)).toBeDefined();
  });

  test('every card keeps its theme: an id never moves to another theme', () => {
    // Pinned so a reorder or edit cannot silently re-point a saved id (Salvos stores ids only).
    const expected: ThemeId[] = [
      'filhos-adultos', 'filhos-adultos', 'filhos-adultos',
      'relacionamento', 'relacionamento', 'relacionamento',
      'rotina-e-tempo', 'rotina-e-tempo', 'rotina-e-tempo',
      'trabalho-e-projetos', 'trabalho-e-projetos', 'trabalho-e-projetos',
      'amizades', 'amizades', 'amizades',
      'quem-sou-hoje', 'quem-sou-hoje', 'quem-sou-hoje',
      'planos-e-interesses', 'planos-e-interesses', 'planos-e-interesses',
      'outro-assunto', 'outro-assunto', 'outro-assunto',
    ];
    expected.forEach((theme, i) => expect(findReflection(`ref-${String(i + 1).padStart(4, '0')}`)?.theme).toBe(theme));
  });

  test('nothing is reviewed yet: every card is a rascunho by Claude, with no reviewer', () => {
    for (const r of reflexoes) {
      expect(r.reviewStatus).toBe('rascunho');
      expect(r.reviewedBy).toBeNull();
      expect(r.version).toBe(1);
      expect(r.sourceNote).toBe('Rascunho de Claude (2026-10-04) para revisão da Mônica');
    }
  });
});

describe.each(reflexoes.map((r) => [r.reflectionId, r] as const))('%s', (_id, r) => {
  test('well-formed: id, theme, non-empty text', () => {
    expect(r.reflectionId).toMatch(/^ref-\d{4}$/);
    expect(Object.keys(themeIds)).toContain(r.theme);
    expect(r.title.trim()).not.toBe('');
    expect(r.body.trim()).not.toBe('');
  });

  // Spec §4.7 "uma ou duas lentes" ∩ plan §3 "2–3 perguntas" = exactly two.
  test('has two lentes, each a non-empty line', () => {
    expect(r.lentes).toHaveLength(2);
    for (const l of r.lentes) expect(l.trim()).not.toBe('');
  });

  test('fits a screen block: 40–130 words (spec §2.1, §4.7, §20)', () => {
    const n = cardWordCount(r);
    expect(n).toBeGreaterThanOrEqual(40);
    expect(n).toBeLessThanOrEqual(130);
  });

  // The voice rules (spec §2, §2.1, §7.2; agents/nos-no-limiar revisar-texto) that a test can see.
  test('reads in the app voice', () => {
    expect({ problems: voiceProblems(textOf(r)), word: avoidedWord(textOf(r)) }).toEqual({ problems: [], word: undefined });
  });
});
