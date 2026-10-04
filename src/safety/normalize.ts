/**
 * Technical normalization for the safety triage (spec §7.1 step 2). Pure and
 * synchronous; no Intl, no network — it must behave the same on Hermes, web and
 * Node (tests).
 *
 * The output is a MATCHING FORM, not display text: every word keeps its meaning,
 * but spelling noise is removed so one rule covers the many ways a phrase is typed:
 *   - lowercase, accents removed ("Não" → "nao", "ç" → "c");
 *   - digits/@ inside words read as letters ("m0rr3r" → "morrer");
 *   - chat shorthand expanded ("vc" → "voce", "n"/"ñ" → "nao", "pq" → "porque", "p/" → "para");
 *   - every run of a repeated letter collapsed to ONE ("morrerrrr", "morrer" and the typo
 *     "morer" all become "morer"; "naaao" → "nao"). Rule patterns are written in normal
 *     spelling and go through the same `squeeze` when compiled (see triage.ts);
 *   - sentence punctuation (. , ; : ! ? line breaks) becomes a " . " mark; other symbols,
 *     emoji and extra spaces become single spaces.
 */

export const ACCENTS: Readonly<Record<string, string>> = {
  à: 'a', á: 'a', â: 'a', ã: 'a', ä: 'a', å: 'a',
  è: 'e', é: 'e', ê: 'e', ë: 'e',
  ì: 'i', í: 'i', î: 'i', ï: 'i',
  ò: 'o', ó: 'o', ô: 'o', õ: 'o', ö: 'o',
  ù: 'u', ú: 'u', û: 'u', ü: 'u',
  ç: 'c', ñ: 'n', ý: 'y', ÿ: 'y',
};

export const LEET: Readonly<Record<string, string>> = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a' };

/**
 * Chat shorthand common in pt-BR. Looked up on the raw token first (so "qq" →
 * "qualquer" before squeezing would turn it into "q"), then on the squeezed token
 * ("vcc" → "vc" → "voce", "nn" → "n" → "nao"). Single letters are expanded only
 * where pt-BR chat use is near-universal ("n" = não, "q" = que, "p" = para).
 */
export const SHORTHAND: Readonly<Record<string, string>> = {
  n: 'nao', nn: 'nao', naum: 'nao',
  q: 'que', oq: 'o que', pq: 'porque',
  vc: 'voce', vcs: 'voces', c: 'voce',
  tb: 'tambem', tbm: 'tambem', tmb: 'tambem',
  td: 'tudo', tds: 'todos', tda: 'toda', tdo: 'tudo',
  ngm: 'ninguem', ngn: 'ninguem',
  msm: 'mesmo', mt: 'muito', mto: 'muito', mta: 'muita', mts: 'muitos', mtas: 'muitas', mtu: 'muito',
  hj: 'hoje', agr: 'agora', dps: 'depois', dp: 'depois',
  qdo: 'quando', qnd: 'quando', qndo: 'quando', qd: 'quando',
  cmg: 'comigo', ctg: 'contigo',
  nd: 'nada', nda: 'nada',
  vdd: 'verdade', sdd: 'saudade', sdds: 'saudades',
  fds: 'fim de semana', sla: 'sei la', pfv: 'por favor', pf: 'por favor', obg: 'obrigada',
  kd: 'cade', mds: 'meu deus', aq: 'aqui', aki: 'aqui',
  qq: 'qualquer', qlq: 'qualquer', qlqr: 'qualquer', ql: 'qual',
  mlr: 'melhor', msg: 'mensagem', vlw: 'valeu', blz: 'beleza',
  to: 'estou', tou: 'estou', ta: 'esta', tava: 'estava', tavam: 'estavam', tamo: 'estamos',
  vo: 'vou', qro: 'quero', qr: 'quer', qria: 'queria', qeria: 'queria', qero: 'quero',
  axo: 'acho', axei: 'achei', eh: 'e', pra: 'para', pro: 'para o', pras: 'para as', pros: 'para os',
  p: 'para', s: 'sem', d: 'de',
};

/** Unicode combining marks dropped from decomposed input (U+0300–U+036F), inclusive. */
export const MARCAS_COMBINANTES: readonly [number, number] = [0x300, 0x36f];

/**
 * JavaScript's `\s`, spelled out. Written as an explicit class so an interpreter in another
 * language reads the SAME set (Python `re.ASCII` `\s` is ASCII-only; JS `\s` is Unicode).
 */
export const ESPACO = String.raw`[\t\n\v\f\r \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]`;

/**
 * Slash/plus shorthand, read before punctuation is dropped. Group 1 (the character before)
 * is kept and `texto` replaces the rest of the match.
 */
export const SUBSTITUICOES_PREVIAS: readonly { readonly padrao: string; readonly texto: string }[] = [
  { padrao: String.raw`(^|[^a-z0-9])p/(?=${ESPACO}|[a-z]|$)`, texto: 'para ' },
  { padrao: String.raw`(^|[^a-z0-9])c/(?=${ESPACO}|[a-z]|$)`, texto: 'com ' },
  { padrao: String.raw`(^|[^a-z0-9])s/(?=${ESPACO}|[a-z]|$)`, texto: 'sem ' },
  { padrao: String.raw`(^|[^a-z0-9])d\+`, texto: 'demais ' },
];

/** Spelled-out words ("q-u-e-r-o", "m.o.r.r.e.r"): inside a match, `SEPARADOR_SOLETRADO` chars are removed. */
export const SEPARADOR_SOLETRADO = String.raw`[-._*]`;
export const SOLETRADO = String.raw`\b[a-z](?:${SEPARADOR_SOLETRADO}[a-z]){2,}\b`;

/** Sentence punctuation (and a dash between spaces) → the sentence mark token. */
export const PONTUACAO = String.raw`[.,;:!?\n\r\u2026\u2014\u2013]+|${ESPACO}-+${ESPACO}`;
/** The sentence-mark token in the normalized text. */
export const MARCA_DE_FRASE = '.';
/** Inside a whitespace chunk, tokens are the runs of these characters; `@` is then trimmed at both ends. */
export const SEPARADOR_DE_TOKEN = '[^a-z0-9@]+';

const RE_SUBSTITUICOES = SUBSTITUICOES_PREVIAS.map(({ padrao, texto }) => ({ re: new RegExp(padrao, 'g'), texto }));
const RE_SOLETRADO = new RegExp(SOLETRADO, 'g');
const RE_SEPARADOR_SOLETRADO = new RegExp(SEPARADOR_SOLETRADO, 'g');
const RE_PONTUACAO = new RegExp(PONTUACAO, 'g');
const RE_ESPACOS = new RegExp(`${ESPACO}+`);
const RE_SEPARADOR_DE_TOKEN = new RegExp(SEPARADOR_DE_TOKEN);

/** Collapse every run of the same letter to one. Exported for compiling rule patterns. */
export function squeeze(text: string): string {
  let out = '';
  let prev = '';
  for (const ch of text) {
    if (ch === prev && ch >= 'a' && ch <= 'z') continue;
    out += ch;
    prev = ch;
  }
  return out;
}

function stripAccents(text: string): string {
  let out = '';
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (code >= MARCAS_COMBINANTES[0] && code <= MARCAS_COMBINANTES[1]) continue; // combining marks (decomposed input)
    out += ACCENTS[ch] ?? ch;
  }
  return out;
}

/** A token mixing letters with digits/@ is read as letters ("m0rr3r"); plain numbers ("188") stay. */
function deLeet(token: string): string {
  if (!/[a-z]/.test(token) || !/[0-9@]/.test(token)) return token;
  let out = '';
  for (const ch of token) out += LEET[ch] ?? ch;
  return out;
}

function expandToken(raw: string): string {
  const direct = SHORTHAND[raw];
  if (direct !== undefined) return squeeze(direct);
  const sq = squeeze(raw);
  const viaSqueeze = SHORTHAND[sq];
  if (viaSqueeze !== undefined) return squeeze(viaSqueeze);
  // "kero", "keria", "kiser" → que…/qui… (but not "k"/"kkkk" laughter)
  if (sq.length > 2 && sq[0] === 'k' && (sq[1] === 'e' || sq[1] === 'i')) return squeeze('qu' + sq.slice(1));
  return sq;
}

export function normalize(text: string): string {
  let t = stripAccents(text.toLowerCase());
  // Slash/plus shorthand must be read before punctuation is dropped.
  for (const { re, texto } of RE_SUBSTITUICOES) t = t.replace(re, (_m, antes: string) => antes + texto);
  // Spelled-out words ("q-u-e-r-o", "m.o.r.r.e.r") are read as one word.
  t = t.replace(RE_SOLETRADO, (m) => m.replace(RE_SEPARADOR_SOLETRADO, ''));
  // Sentence marks become a "." token: "Não. Quero morrer." must not read as "não quero morrer".
  t = t.replace(RE_PONTUACAO, ` ${MARCA_DE_FRASE} `);
  const tokens: string[] = [];
  for (const chunk of t.split(RE_ESPACOS)) {
    if (chunk === MARCA_DE_FRASE) {
      if (tokens.length > 0 && tokens[tokens.length - 1] !== MARCA_DE_FRASE) tokens.push(MARCA_DE_FRASE);
      continue;
    }
    for (const raw of chunk.split(RE_SEPARADOR_DE_TOKEN)) {
      const tok = raw.replace(/^@+|@+$/g, '');
      if (tok.length > 0) tokens.push(expandToken(deLeet(tok)));
    }
  }
  while (tokens[tokens.length - 1] === MARCA_DE_FRASE) tokens.pop();
  return tokens.join(' ');
}
