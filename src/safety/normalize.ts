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

const ACCENTS: Record<string, string> = {
  à: 'a', á: 'a', â: 'a', ã: 'a', ä: 'a', å: 'a',
  è: 'e', é: 'e', ê: 'e', ë: 'e',
  ì: 'i', í: 'i', î: 'i', ï: 'i',
  ò: 'o', ó: 'o', ô: 'o', õ: 'o', ö: 'o',
  ù: 'u', ú: 'u', û: 'u', ü: 'u',
  ç: 'c', ñ: 'n', ý: 'y', ÿ: 'y',
};

const LEET: Record<string, string> = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a' };

/**
 * Chat shorthand common in pt-BR. Looked up on the raw token first (so "qq" →
 * "qualquer" before squeezing would turn it into "q"), then on the squeezed token
 * ("vcc" → "vc" → "voce", "nn" → "n" → "nao"). Single letters are expanded only
 * where pt-BR chat use is near-universal ("n" = não, "q" = que, "p" = para).
 */
const SHORTHAND: Record<string, string> = {
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
    if (code >= 0x300 && code <= 0x36f) continue; // combining marks (decomposed input)
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
  t = t
    .replace(/(^|[^a-z0-9])p\/(?=\s|[a-z]|$)/g, '$1para ')
    .replace(/(^|[^a-z0-9])c\/(?=\s|[a-z]|$)/g, '$1com ')
    .replace(/(^|[^a-z0-9])s\/(?=\s|[a-z]|$)/g, '$1sem ')
    .replace(/(^|[^a-z0-9])d\+/g, '$1demais ');
  // Spelled-out words ("q-u-e-r-o", "m.o.r.r.e.r") are read as one word.
  t = t.replace(/\b[a-z](?:[-._*][a-z]){2,}\b/g, (m) => m.replace(/[-._*]/g, ''));
  // Sentence marks become a "." token: "Não. Quero morrer." must not read as "não quero morrer".
  t = t.replace(/[.,;:!?\n\r…—–]+|\s-+\s/g, ' . ');
  const tokens: string[] = [];
  for (const chunk of t.split(/\s+/)) {
    if (chunk === '.') {
      if (tokens.length > 0 && tokens[tokens.length - 1] !== '.') tokens.push('.');
      continue;
    }
    for (const raw of chunk.split(/[^a-z0-9@]+/)) {
      const tok = raw.replace(/^@+|@+$/g, '');
      if (tok.length > 0) tokens.push(expandToken(deLeet(tok)));
    }
  }
  while (tokens[tokens.length - 1] === '.') tokens.pop();
  return tokens.join(' ').replace(/\s+/g, ' ').trim();
}
