/**
 * The voice rules a test can see (spec §2, §2.1, §7.2; brand lexicon adopted 2026-10-03, board
 * `nnl-brand-lexicon`; agents/nos-no-limiar revisar-texto / revisar-atividade). ONE copy for every
 * content test — activities, reflections and games used to carry their own, and the copies had
 * drifted (different word lists, and an ASCII `\b` that does not see accented letters as letters).
 *
 * Not a test file (testMatch is `*.test.ts`): a helper the content tests import. It returns the
 * broken rules instead of asserting, so a failure names every rule a text breaks at once.
 */

/** Brand "avoid" list + drama words + clinical words + diet/alcohol (spec §2.1, §7.2, §9). */
const AVOID = [
  // brand lexicon (VOZ/03)
  'burnout', 'esgotamento', 'esgotada', 'sobrecarga', 'resiliente', 'resiliência', 'empoderamento',
  'autoconhecimento', 'guerreira', 'forte',
  // drama
  'vazio', 'vazia', 'dor', 'sofrimento', 'ninho vazio', 'luto',
  // clinical — the app never diagnoses or treats (spec §7.2)
  'depressão', 'ansiedade', 'trauma', 'síndrome', 'diagnóstico', 'transtorno', 'terapia', 'terapêutic\\p{L}*',
  'inconsciente', 'cura', 'curar',
  // body and consumption are out of scope (spec §9)
  'emagrecer', 'peso', 'calorias', 'álcool', 'vinho', 'cerveja', 'drinque',
];

/** A whole word. Not `\b`: in JS it is ASCII-only and treats á, ê, ç as non-letters, so it mis-splits Portuguese words. */
const AVOID_RE = new RegExp(`(?<![\\p{L}])(${AVOID.join('|')})(?![\\p{L}])`, 'u');

/** Therapeutic-bond phrases the app never says (spec §7.2). */
const FALSE_INTIMACY_RE = /estou aqui|conte comigo|não vou te abandonar|estamos juntas/;

export type VoiceRule = 'exclamação' | 'prescritivo' | 'intimidade falsa' | 'palavra evitada' | 'não é X, é Y';

/** Every voice rule `text` breaks — `[]` when it reads in the app's voice. */
export function voiceProblems(text: string): VoiceRule[] {
  const t = text.toLowerCase();
  const out: VoiceRule[] = [];
  if (t.includes('!')) out.push('exclamação');
  if (/(?<![\p{L}])você (precisa|deve)(?![\p{L}])/u.test(t)) out.push('prescritivo');
  if (FALSE_INTIMACY_RE.test(t)) out.push('intimidade falsa');
  if (AVOID_RE.test(t)) out.push('palavra evitada');
  if (/não é [^.?]*, é /.test(t)) out.push('não é X, é Y');
  return out;
}

/** The offending word, for a readable failure message. */
export function avoidedWord(text: string): string | undefined {
  return AVOID_RE.exec(text.toLowerCase())?.[1];
}
