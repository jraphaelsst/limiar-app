/**
 * On-device safety triage (spec §7.1 steps 2–4, §8). Pure, synchronous, deterministic:
 * no network, no AI, no storage — it works when the AI is down (§25.8) and is independent
 * of any response model (§7.1).
 *
 * The result carries rule ids only. The user's text never leaves this function: it is not
 * returned, logged or stored (§8.2, §10.1, §13 safety_events = severity + classifier version).
 */
import { normalize, squeeze } from './normalize';
import { IDIOMAS, REGRAS, VERSAO_TRIAGEM, type Nivel, type Regra, type Sinal } from './rules';

export type { Nivel, Sinal } from './rules';

export type TriageResult = {
  nivel: Nivel;
  sinais: readonly Sinal[];
  /** Rule ids (suffix ":negada" when a negation capped the rule at amarelo). NEVER user text. */
  regras: readonly string[];
  versao: string;
};

/** Word the idiom masking leaves in place of a neutralised death/kill word. */
export const MASCARA = 'xidiomax';
/** Inside an idiom match, a word matching this is replaced by `MASCARA`. */
export const PALAVRA_MASCARAVEL = '^(?:mor|mat|suicid|overdose)';
/** The word right before a match that caps a `negavel` rule at amarelo. */
export const NEGADORES: readonly string[] = ['jamais', 'nao', 'nem', 'nunca'];

/** A negated match counts at this level, under the rule id + this suffix. */
export const NIVEL_NEGADO = 'amarelo' satisfies Nivel;
export const SUFIXO_NEGADA = ':negada';

export const ORDEM_NIVEL: Readonly<Record<Nivel, number>> = { verde: 0, amarelo: 1, violencia: 2, vermelho: 3 };
export const ORDEM_SINAL: readonly Sinal[] = ['autolesao', 'violencia', 'sofrimento_persistente', 'dependencia_do_app'];

/** Every pattern is matched whole, on word boundaries: `ENVELOPE[0] + squeezePattern(padrao) + ENVELOPE[1]`. */
export const ENVELOPE: readonly [string, string] = [String.raw`\b(?:`, String.raw`)\b`];

const RE_PALAVRA_MASCARAVEL = new RegExp(PALAVRA_MASCARAVEL);
const CONJUNTO_NEGADORES: ReadonlySet<string> = new Set(NEGADORES);

/**
 * Collapse doubled letters in a pattern exactly as `normalize` does in the text, without
 * touching escapes ("\\bb…" keeps its "\\b").
 */
function squeezePattern(source: string): string {
  let out = '';
  let prev = '';
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (ch === '\\') {
      out += ch + (source[i + 1] ?? '');
      i++;
      prev = '';
      continue;
    }
    if (ch === prev && ch >= 'a' && ch <= 'z') continue;
    out += ch;
    prev = ch;
  }
  return out;
}

/** The regex source the engine runs for a rule/idiom pattern (squeezed + wrapped). */
export function fonteCompilada(padrao: string): string {
  return ENVELOPE[0] + squeezePattern(padrao) + ENVELOPE[1];
}

function compile(padrao: string): RegExp {
  return new RegExp(fonteCompilada(padrao), 'g');
}

type Compilada = { regra: Regra; re: RegExp };

const IDIOMAS_COMPILADOS = IDIOMAS.map((i) => compile(i.padrao));
const REGRAS_COMPILADAS: readonly Compilada[] = REGRAS.map((regra) => ({ regra, re: compile(regra.padrao) }));

function mascararIdiomas(texto: string): string {
  let t = texto;
  for (const re of IDIOMAS_COMPILADOS) {
    t = t.replace(re, (trecho) =>
      trecho
        .split(' ')
        .map((w) => (RE_PALAVRA_MASCARAVEL.test(w) ? MASCARA : w))
        .join(' '),
    );
  }
  return t;
}

/** The word right before `index` is a negation ("não quero morrer"). Sentence marks break it. */
function negadoEm(texto: string, index: number): boolean {
  const antes = texto.slice(0, index).trimEnd();
  const ultima = antes.slice(antes.lastIndexOf(' ') + 1);
  return CONJUNTO_NEGADORES.has(ultima);
}

const VERDE: TriageResult = Object.freeze({ nivel: 'verde', sinais: Object.freeze([]), regras: Object.freeze([]), versao: VERSAO_TRIAGEM });

export function triage(text: string): TriageResult {
  const texto = mascararIdiomas(normalize(text));
  if (texto.length === 0) return VERDE;

  type Acerto = { regra: Regra; nivel: Nivel; id: string };
  const acertos: Acerto[] = [];
  for (const { regra, re } of REGRAS_COMPILADAS) {
    let plena = false;
    let negada = false;
    for (const m of texto.matchAll(re)) {
      if (regra.negavel !== false && negadoEm(texto, m.index ?? 0)) negada = true;
      else plena = true;
      if (plena) break;
    }
    if (plena) acertos.push({ regra, nivel: regra.nivel, id: regra.id });
    // A negation never makes a risk phrase green: it caps the rule at amarelo (spec §7.1, §8.2).
    else if (negada) acertos.push({ regra, nivel: NIVEL_NEGADO, id: regra.id + SUFIXO_NEGADA });
  }

  const especificos = acertos.filter((a) => !a.regra.rede);
  const validos = especificos.length > 0 ? especificos : acertos;
  if (validos.length === 0) return VERDE;

  let nivel: Nivel = 'verde';
  for (const a of validos) if (ORDEM_NIVEL[a.nivel] > ORDEM_NIVEL[nivel]) nivel = a.nivel;
  const presentes = new Set(validos.map((a) => a.regra.sinal));
  return {
    nivel,
    sinais: ORDEM_SINAL.filter((s) => presentes.has(s)),
    regras: [...new Set(validos.map((a) => a.id))].sort(),
    versao: VERSAO_TRIAGEM,
  };
}

/** Every id `triage` can emit — for audits and for the test that `regras` never carries text. */
export const IDS_DE_REGRA: ReadonlySet<string> = new Set(REGRAS.flatMap((r) => [r.id, r.id + SUFIXO_NEGADA]));

/** Exposed for tests only: the matching form after idiom masking. Never log its output. */
export function textoParaRegras(text: string): string {
  return mascararIdiomas(normalize(text));
}

// Patterns are squeezed at compile time; keep `squeeze` reachable for tests that check parity.
export { squeeze };
