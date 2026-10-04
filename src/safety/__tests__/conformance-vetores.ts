/**
 * Inputs for `safety/conformance.json` beyond the corpus (limiar-open-question S0). Expected
 * outputs are NOT written here: the TS engine computes them at export time. Add a vector whenever
 * a normalization or triage behavior is subtle enough that another interpreter could get it wrong.
 */
import type { VetorDeNormalizacao } from '@/safety/export';

/** Pure normalization vectors (input → normalized). */
export const VETORES_NORMALIZACAO: readonly VetorDeNormalizacao[] = [
  // acentos (precomposed and decomposed) and case
  { categoria: 'acentos', entrada: 'Não sei o que fazer' },
  { categoria: 'acentos', entrada: 'Coração, ação, pão, avó, você, à, ü, ñ' },
  { categoria: 'acentos', entrada: 'café naõ' },
  { categoria: 'acentos', entrada: 'İstanbul ŞÆÐ øß' },
  { categoria: 'caixa', entrada: '  NÃO   Sei  o QUE fazer  ' },
  { categoria: 'caixa', entrada: 'QUERO MORRER' },
  // repeated letters
  { categoria: 'repeticao', entrada: 'morrerrrr' },
  { categoria: 'repeticao', entrada: 'naaaao' },
  { categoria: 'repeticao', entrada: 'morer' },
  { categoria: 'repeticao', entrada: 'socorrooo 1100 aaa' },
  // shorthand
  { categoria: 'abreviacao', entrada: 'vc q n tb pq td ngm msm' },
  { categoria: 'abreviacao', entrada: 'ñ quero' },
  { categoria: 'abreviacao', entrada: 'vcc nn qq qqq' },
  { categoria: 'abreviacao', entrada: 'tô cansada, tá?' },
  { categoria: 'abreviacao', entrada: 'kero keria kiser k kkkk' },
  { categoria: 'abreviacao', entrada: 'p/ todos c/ ele s/ nada d+' },
  { categoria: 'abreviacao', entrada: 'p/todos ap/2 p/' },
  { categoria: 'abreviacao', entrada: 'pro fds pra vc' },
  // leet
  { categoria: 'leet', entrada: 'm0rr3r' },
  { categoria: 'leet', entrada: 'qu3r0 m@t@r' },
  { categoria: 'leet', entrada: 'ligue 188 ou 190' },
  { categoria: 'leet', entrada: '@@oi@@ 1@2 @' },
  // punctuation and sentence marks
  { categoria: 'pontuacao', entrada: 'Não. Quero!' },
  { categoria: 'pontuacao', entrada: 'Não... quero; morrer: agora?!' },
  { categoria: 'pontuacao', entrada: 'linha um\nlinha dois\r\nlinha três' },
  { categoria: 'pontuacao', entrada: 'x — y – z… w' },
  { categoria: 'pontuacao', entrada: 'antes - depois e bem-vinda' },
  { categoria: 'pontuacao', entrada: ' - . , ' },
  { categoria: 'pontuacao', entrada: '. começo e fim .' },
  // whitespace (JS \s is Unicode: NBSP, em space, line separator)
  { categoria: 'espaco', entrada: 'a - b' },
  { categoria: 'espaco', entrada: 'oi tudo bem\tsim' },
  { categoria: 'espaco', entrada: '﻿começo' },
  // spelled-out words
  { categoria: 'soletrado', entrada: 'Q-U-E-R-O m.o.r.r.e.r' },
  { categoria: 'soletrado', entrada: 'a-b x.y m*o*r*r*e*r' },
  // symbols and emoji
  { categoria: 'simbolos', entrada: 'oi 😊 tudo bem?' },
  { categoria: 'simbolos', entrada: '#socorro (quero) "ajuda" <3 $100' },
  { categoria: 'vazio', entrada: '' },
  { categoria: 'vazio', entrada: '   \n  ' },
];

/** Triage edge cases outside the corpus (negation, sentence marks, idioms, empty). */
export const TRIAGEM_EXTRAS: readonly string[] = [
  '',
  '   \n  ',
  'não quero morrer',
  'nunca quis morrer',
  'Não. Quero morrer.',
  'não quero morrer, mas às vezes quero morrer',
  'morri de vergonha e quero morrer',
  'mataria por um café, mas à noite penso em me matar',
  'morro de medo dele',
  'Ele me bate e eu quero morrer',
  'por que não me mato?',
  'tenho medo de morrer',
];
