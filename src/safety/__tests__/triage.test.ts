/// <reference types="jest" />
import { normalize } from '@/safety/normalize';
import { IDIOMAS, REGRAS, VERSAO_TRIAGEM } from '@/safety/rules';
import { IDS_DE_REGRA, triage, type Nivel } from '@/safety/triage';

import * as C from './corpus';

const VERMELHO = [...C.VERMELHO, ...C.VERMELHO_CEGO_1, ...C.VERMELHO_CEGO_2];
const VIOLENCIA = [...C.VIOLENCIA, ...C.VIOLENCIA_CEGO_1, ...C.VIOLENCIA_CEGO_2];
const AMARELO = [...C.AMARELO, ...C.AMARELO_CEGO_1, ...C.AMARELO_CEGO_2];
const VERDE = [...C.VERDE, ...C.VERDE_CEGO_1, ...C.VERDE_CEGO_2];

const RANK: Record<Nivel, number> = { verde: 0, amarelo: 1, violencia: 2, vermelho: 3 };
const misses = (phrases: readonly string[], ok: (p: string) => boolean) => phrases.filter((p) => !ok(p));

describe('corpus size (spec §21: 100+ risk examples)', () => {
  test('meets the minimums', () => {
    expect(C.VERMELHO.length).toBeGreaterThanOrEqual(120);
    expect(C.VIOLENCIA.length).toBeGreaterThanOrEqual(40);
    expect(C.AMARELO.length).toBeGreaterThanOrEqual(40);
    expect(C.VERDE.length).toBeGreaterThanOrEqual(150);
  });
});

describe('regression corpus', () => {
  test('VERMELHO recall is 100%', () => {
    expect(misses(VERMELHO, (p) => triage(p).nivel === 'vermelho')).toEqual([]);
  });

  test('VIOLENCIA phrases are violencia, or vermelho carrying the violência signal', () => {
    expect(misses(VIOLENCIA, (p) => RANK[triage(p).nivel] >= RANK.violencia && triage(p).sinais.includes('violencia'))).toEqual([]);
  });

  test('everyday hyperbole consciously routed to the safer level stays violencia', () => {
    expect(C.ROTA_MAIS_SEGURA.filter(({ frase, nivel }) => triage(frase).nivel !== nivel)).toEqual([]);
  });

  test('AMARELO phrases are at least amarelo (never verde)', () => {
    expect(misses(AMARELO, (p) => RANK[triage(p).nivel] >= RANK.amarelo)).toEqual([]);
  });

  test('VERDE false-positive rate is at most 5%', () => {
    const fp = misses(VERDE, (p) => triage(p).nivel === 'verde');
    const rate = fp.length / VERDE.length;
    // Printed on purpose: the rate is a governed number (spec §21), reported on every run.
    // The phrases are fixed test fixtures, never user text.
    console.info(`[triagem ${VERSAO_TRIAGEM}] verde: ${fp.length}/${VERDE.length} falsos positivos (${(rate * 100).toFixed(1)}%)${fp.length ? `\n  ${fp.join('\n  ')}` : ''}`);
    expect(rate).toBeLessThanOrEqual(0.05);
  });
});

describe('levels and precedence', () => {
  test('spec §8 examples', () => {
    expect(triage('Sinto saudade').nivel).toBe('verde');
    expect(triage('não sei o que fazer domingo').nivel).toBe('verde');
    expect(triage('não consigo sair da cama há semanas').nivel).toBe('amarelo');
    expect(triage('você é a única com quem eu converso').nivel).toBe('amarelo');
    expect(triage('você é a única com quem eu converso').sinais).toEqual(['dependencia_do_app']);
    expect(triage('ele disse que vai me matar')).toMatchObject({ nivel: 'violencia', sinais: ['violencia'] });
  });

  test('self-harm + violence → vermelho with both signals', () => {
    const r = triage('Ele me bate e eu quero morrer');
    expect(r.nivel).toBe('vermelho');
    expect(r.sinais).toEqual(['autolesao', 'violencia']);
  });

  test('a threat from someone else is violência, not self-harm', () => {
    expect(triage('ele quer me matar')).toMatchObject({ nivel: 'violencia', sinais: ['violencia'] });
    expect(triage('meu marido tentou me matar')).toMatchObject({ nivel: 'violencia', sinais: ['violencia'] });
  });

  test('empty and whitespace-only text is verde', () => {
    expect(triage('')).toMatchObject({ nivel: 'verde', sinais: [], regras: [] });
    expect(triage('   \n  ').nivel).toBe('verde');
  });
});

describe('negations never make a risk phrase verde', () => {
  test.each(['não quero morrer', 'nunca quis morrer', 'não vou me matar', 'eu não quero me matar'])('"%s" → amarelo', (p) => {
    const r = triage(p);
    expect(r.nivel).toBe('amarelo');
    expect(r.regras.some((id) => id.endsWith(':negada'))).toBe(true);
  });

  test.each(['não quero mais viver', 'não queria acordar', 'queria sumir', 'não queria ter nascido', 'não vou me matar hoje', 'por que não me mato?'])(
    'the negation IS the risk: "%s" → vermelho',
    (p) => expect(triage(p).nivel).toBe('vermelho'),
  );

  test('a sentence mark breaks the negation ("Não. Quero morrer.")', () => {
    expect(triage('Não. Quero morrer.').nivel).toBe('vermelho');
  });

  test('a later un-negated occurrence still counts', () => {
    expect(triage('não quero morrer, mas às vezes quero morrer').nivel).toBe('vermelho');
  });
});

describe('idioms', () => {
  test.each([
    'morrendo de rir',
    'morri de vergonha',
    'tô morta de cansaço',
    'matar a saudade',
    'matar o tempo',
    'mataria por um café',
    'me mata de rir',
  ])('"%s" stays verde', (p) => expect(triage(p).nivel).toBe('verde'));

  test('an idiom next to a real risk phrase is still vermelho', () => {
    expect(triage('morri de vergonha e quero morrer').nivel).toBe('vermelho');
    expect(triage('mataria por um café, mas à noite penso em me matar').nivel).toBe('vermelho');
  });

  test('an idiom does not hide the rest of the sentence ("morro de medo dele")', () => {
    expect(triage('morro de medo dele').nivel).toBe('violencia');
  });
});

describe('regras never carry user text', () => {
  const all = [...VERMELHO, ...VIOLENCIA, ...AMARELO, ...VERDE, ...C.ROTA_MAIS_SEGURA.map((r) => r.frase)];

  test('every emitted id is a known rule id', () => {
    for (const p of all) for (const id of triage(p).regras) expect(IDS_DE_REGRA.has(id)).toBe(true);
  });

  test('no id contains any word typed by the user beyond the rule vocabulary', () => {
    const secret = 'Quero morrer, meu nome é Zuleica Pereira e moro na Rua das Acácias 123';
    const r = triage(secret);
    expect(r.nivel).toBe('vermelho');
    const serialized = JSON.stringify(r).toLowerCase();
    for (const word of ['zuleica', 'pereira', 'acacias', 'acácias', '123', 'quero morrer']) expect(serialized).not.toContain(word);
  });

  test('the result has exactly the documented keys', () => {
    expect(Object.keys(triage('quero morrer')).sort()).toEqual(['nivel', 'regras', 'sinais', 'versao']);
    expect(triage('quero morrer').versao).toBe(VERSAO_TRIAGEM);
  });
});

describe('rules are governed data', () => {
  test('ids are unique and namespaced by level', () => {
    const ids = REGRAS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const r of REGRAS) expect(r.id.startsWith(`${r.nivel}.`) || (r.rede && r.id.startsWith('rede.'))).toBe(true);
    expect(new Set(IDIOMAS.map((i) => i.id)).size).toBe(IDIOMAS.length);
  });

  test('every pattern compiles', () => {
    for (const r of [...REGRAS, ...IDIOMAS]) expect(() => new RegExp(r.padrao)).not.toThrow();
  });

  test('triage is deterministic', () => {
    for (const p of VERMELHO.slice(0, 20)) expect(triage(p)).toEqual(triage(p));
  });
});

describe('normalize', () => {
  test('lowercases, strips accents and collapses whitespace', () => {
    expect(normalize('  NÃO   Sei  o QUE fazer  ')).toBe('nao sei o que fazer');
    expect(normalize('Coração')).toBe('coracao');
  });

  test('collapses repeated letters on both spellings', () => {
    expect(normalize('morrerrrr')).toBe(normalize('morrer'));
    expect(normalize('naaaao')).toBe('nao');
    expect(normalize('morer')).toBe(normalize('morrer'));
  });

  test('expands pt-BR chat shorthand', () => {
    expect(normalize('vc')).toBe('voce');
    expect(normalize('q')).toBe('que');
    expect(normalize('n quero')).toBe('nao quero');
    expect(normalize('ñ quero')).toBe('nao quero');
    expect(normalize('tb')).toBe('tambem');
    expect(normalize('pq')).toBe('porque');
    expect(normalize('td')).toBe('tudo');
    expect(normalize('ngm')).toBe('ninguem');
    expect(normalize('msm')).toBe('mesmo');
    expect(normalize('p/ todos')).toBe('para todos');
    expect(normalize('tô cansada')).toBe('estou cansada');
    expect(normalize('kero')).toBe('quero');
  });

  test('reads digits inside words as letters, keeps plain numbers', () => {
    expect(normalize('m0rr3r')).toBe(normalize('morrer'));
    expect(normalize('ligue 188')).toBe('ligue 188');
  });

  test('turns sentence punctuation into a mark and drops emoji', () => {
    expect(normalize('Não. Quero!')).toBe('nao . quero');
    expect(normalize('oi 😊 tudo bem?')).toBe('oi tudo bem');
  });

  test('joins spelled-out words', () => {
    expect(normalize('Q-U-E-R-O')).toBe('quero');
  });
});
