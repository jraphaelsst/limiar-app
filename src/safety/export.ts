/**
 * Safety pack exporter — the ONE way the rules leave this repo (limiar-open-question S0).
 *
 * `src/safety/rules.ts` stays the authoring surface (macros keep it readable). This module turns
 * it, plus every constant the engine reads from `normalize.ts` / `triage.ts`, into data an
 * interpreter in another language (the server's Python `re.ASCII` interpreter) can load, so that
 * interpreter holds ONLY the algorithm:
 *   - `safety/regras.json`      — patterns fully expanded (macros resolved, NOT squeezed) + constants;
 *   - `safety/conformance.json` — the TS engine's expected output for every corpus phrase + pure
 *                                 normalization vectors. Another interpreter must reproduce 100%.
 *
 * Pure: no fs, no clock, no randomness. Output is canonical JSON (keys sorted at every level,
 * 2-space indent, trailing newline), so the committed files are byte-stable. The test
 * `src/safety/__tests__/safety-pack.test.ts` regenerates both and requires byte-equality with
 * the committed copies; `npm run safety:export` rewrites them.
 *
 * Imported only by tests — never by app code, so it never enters the bundle.
 */
import {
  ACCENTS,
  ESPACO,
  LEET,
  MARCA_DE_FRASE,
  MARCAS_COMBINANTES,
  normalize,
  PONTUACAO,
  SEPARADOR_DE_TOKEN,
  SEPARADOR_SOLETRADO,
  SHORTHAND,
  SOLETRADO,
  SUBSTITUICOES_PREVIAS,
} from './normalize';
import { IDIOMAS, REGRAS, VERSAO_TRIAGEM } from './rules';
import {
  ENVELOPE,
  MASCARA,
  NEGADORES,
  NIVEL_NEGADO,
  ORDEM_NIVEL,
  ORDEM_SINAL,
  PALAVRA_MASCARAVEL,
  SUFIXO_NEGADA,
  textoParaRegras,
  triage,
} from './triage';

/** Bumped when the SHAPE of the exported files changes (not when rules change — that is `versao`). */
export const FORMATO_PACOTE = 1;

type Json = null | boolean | number | string | readonly Json[] | { readonly [k: string]: Json };

function ordenarChaves(v: Json): Json {
  if (Array.isArray(v)) return v.map(ordenarChaves);
  if (v !== null && typeof v === 'object') {
    const o = v as { readonly [k: string]: Json };
    const out: { [k: string]: Json } = {};
    for (const k of Object.keys(o).sort()) out[k] = ordenarChaves(o[k]);
    return out;
  }
  return v;
}

/** Canonical JSON: keys sorted at every level, 2-space indent, trailing newline. */
export function jsonCanonico(v: Json): string {
  return JSON.stringify(ordenarChaves(v), null, 2) + '\n';
}

/** Every regex source the pack ships, by a stable name — for the portability checks. */
export function fontesRegex(): readonly { nome: string; fonte: string }[] {
  return [
    ...IDIOMAS.map((i) => ({ nome: `idioma:${i.id}`, fonte: i.padrao })),
    ...REGRAS.map((r) => ({ nome: `regra:${r.id}`, fonte: r.padrao })),
    { nome: 'triagem:palavra_mascaravel', fonte: PALAVRA_MASCARAVEL },
    { nome: 'normalizacao:espaco', fonte: ESPACO },
    ...SUBSTITUICOES_PREVIAS.map((s, i) => ({ nome: `normalizacao:substituicao_previa[${i}]`, fonte: s.padrao })),
    { nome: 'normalizacao:soletrado', fonte: SOLETRADO },
    { nome: 'normalizacao:separador_soletrado', fonte: SEPARADOR_SOLETRADO },
    { nome: 'normalizacao:pontuacao', fonte: PONTUACAO },
    { nome: 'normalizacao:separador_de_token', fonte: SEPARADOR_DE_TOKEN },
  ];
}

const tabela = (t: Readonly<Record<string, string>>): Json => ({ ...t });

export function pacoteDeRegras(): Json {
  return {
    formato: FORMATO_PACOTE,
    versao: VERSAO_TRIAGEM,
    compilacao: {
      envelope: [...ENVELOPE],
      comprimir_letras_repetidas:
        'Before compiling, every run of the same letter a-z in `padrao` collapses to one, skipping each backslash escape (the backslash and the next character are copied as-is and reset the run) — the same squeeze normalize applies to the text.',
      flags: { javascript: 'g', python: 're.ASCII' },
      ordem:
        'idiomas run in array order (each masks before the next). regras order does not change the result (ids are sorted, the level is a max).',
      normalizacao:
        'normalizacao.* patterns run over the lowercased, accent-stripped input (not yet ASCII) and are NOT squeezed; compile them with re.ASCII too. `espaco` is JS `\\s` spelled out (Python re.ASCII `\\s` is ASCII-only). substituicoes_previas: keep group 1, replace the rest of the match with `texto`.',
      texto:
        'Patterns run over the normalized text: ASCII only ([a-z0-9@], single spaces, the sentence mark "."), never a newline — so `\\b`, `\\w`, `\\d`, `.` and `$` mean the same in JS and in Python re.ASCII.',
    },
    normalizacao: {
      acentos: tabela(ACCENTS),
      leet: tabela(LEET),
      abreviacoes: tabela(SHORTHAND),
      marcas_combinantes: [...MARCAS_COMBINANTES],
      espaco: ESPACO,
      substituicoes_previas: SUBSTITUICOES_PREVIAS.map((s) => ({ padrao: s.padrao, texto: s.texto })),
      soletrado: SOLETRADO,
      separador_soletrado: SEPARADOR_SOLETRADO,
      pontuacao: PONTUACAO,
      marca_de_frase: MARCA_DE_FRASE,
      separador_de_token: SEPARADOR_DE_TOKEN,
    },
    triagem: {
      mascara: MASCARA,
      palavra_mascaravel: PALAVRA_MASCARAVEL,
      negadores: [...NEGADORES].sort(),
      nivel_negado: NIVEL_NEGADO,
      sufixo_negada: SUFIXO_NEGADA,
      ordem_nivel: { ...ORDEM_NIVEL },
      ordem_sinal: [...ORDEM_SINAL],
    },
    idiomas: IDIOMAS.map((i) => ({ id: i.id, padrao: i.padrao })),
    regras: REGRAS.map((r) => ({
      id: r.id,
      nivel: r.nivel,
      sinal: r.sinal,
      padrao: r.padrao,
      negavel: r.negavel !== false,
      rede: r.rede === true,
    })),
  };
}

export function exportarRegras(): string {
  return jsonCanonico(pacoteDeRegras());
}

export type ConjuntoDeFrases = { readonly nome: string; readonly frases: readonly string[] };
export type VetorDeNormalizacao = { readonly categoria: string; readonly entrada: string };

/**
 * `conjuntos` = the regression corpus (incl. the blind sets), passed in by the test so this
 * module never imports test fixtures. Order is kept as given (it is the corpus order).
 */
export function exportarConformidade(conjuntos: readonly ConjuntoDeFrases[], vetores: readonly VetorDeNormalizacao[]): string {
  const triagem: Json[] = [];
  const porConjunto: { [k: string]: number } = {};
  for (const { nome, frases } of conjuntos) {
    porConjunto[nome] = frases.length;
    for (const frase of frases) {
      const r = triage(frase);
      triagem.push({
        conjunto: nome,
        frase,
        normalizada: normalize(frase),
        mascarada: textoParaRegras(frase),
        nivel: r.nivel,
        sinais: [...r.sinais],
        regras: [...r.regras],
      });
    }
  }
  return jsonCanonico({
    formato: FORMATO_PACOTE,
    versao: VERSAO_TRIAGEM,
    contagens: { triagem: triagem.length, normalizacao: vetores.length, por_conjunto: porConjunto },
    normalizacao: vetores.map((v) => ({ categoria: v.categoria, entrada: v.entrada, normalizada: normalize(v.entrada) })),
    triagem,
  });
}
