/// <reference types="jest" />
/**
 * The safety pack (`safety/regras.json`, `safety/conformance.json`) is DERIVED from
 * src/safety/{rules,normalize,triage}.ts and must never drift from them:
 *   - this test regenerates both in memory and requires byte-equality with the committed copies;
 *   - `npm run safety:export` (SAFETY_EXPORT=1) rewrites them first, then runs the same checks.
 * It also proves the exported regexes are portable to Python `re` with `re.ASCII` (the server
 * interpreter, limiar-open-question S1): a static scan for JS-only constructs, plus — when
 * python3 is available (always in CI) — a match-for-match comparison of every pattern.
 */
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

import { exportarConformidade, exportarRegras, fontesRegex, type ConjuntoDeFrases } from '@/safety/export';
import { normalize } from '@/safety/normalize';
import { IDIOMAS, REGRAS } from '@/safety/rules';
import { fonteCompilada, textoParaRegras } from '@/safety/triage';

import { TRIAGEM_EXTRAS, VETORES_NORMALIZACAO } from './conformance-vetores';
import * as C from './corpus';

const RAIZ = path.resolve(__dirname, '../../..');
const ARQ_REGRAS = path.join(RAIZ, 'safety/regras.json');
const ARQ_CONFORMIDADE = path.join(RAIZ, 'safety/conformance.json');

const CONJUNTOS: readonly ConjuntoDeFrases[] = [
  { nome: 'VERMELHO', frases: C.VERMELHO },
  { nome: 'VIOLENCIA', frases: C.VIOLENCIA },
  { nome: 'AMARELO', frases: C.AMARELO },
  { nome: 'VERDE', frases: C.VERDE },
  { nome: 'VERMELHO_CEGO_1', frases: C.VERMELHO_CEGO_1 },
  { nome: 'VIOLENCIA_CEGO_1', frases: C.VIOLENCIA_CEGO_1 },
  { nome: 'AMARELO_CEGO_1', frases: C.AMARELO_CEGO_1 },
  { nome: 'VERDE_CEGO_1', frases: C.VERDE_CEGO_1 },
  { nome: 'ROTA_MAIS_SEGURA', frases: C.ROTA_MAIS_SEGURA.map((r) => r.frase) },
  { nome: 'VERMELHO_CEGO_2', frases: C.VERMELHO_CEGO_2 },
  { nome: 'VIOLENCIA_CEGO_2', frases: C.VIOLENCIA_CEGO_2 },
  { nome: 'AMARELO_CEGO_2', frases: C.AMARELO_CEGO_2 },
  { nome: 'VERDE_CEGO_2', frases: C.VERDE_CEGO_2 },
  { nome: 'EXTRAS', frases: TRIAGEM_EXTRAS },
];

const regras = exportarRegras();
const conformidade = exportarConformidade(CONJUNTOS, VETORES_NORMALIZACAO);

if (process.env.SAFETY_EXPORT === '1') {
  fs.mkdirSync(path.dirname(ARQ_REGRAS), { recursive: true });
  fs.writeFileSync(ARQ_REGRAS, regras);
  fs.writeFileSync(ARQ_CONFORMIDADE, conformidade);
}

describe('safety pack is derived, never hand-edited', () => {
  test('every corpus set is exported (a new set in corpus.ts must be added here)', () => {
    const exportados = new Set(CONJUNTOS.map((c) => c.nome));
    expect(Object.keys(C).filter((k) => !exportados.has(k))).toEqual([]);
  });

  test.each([
    ['safety/regras.json', ARQ_REGRAS, regras],
    ['safety/conformance.json', ARQ_CONFORMIDADE, conformidade],
  ])('%s is byte-identical to a fresh export', (nome, arquivo, gerado) => {
    const commitado = fs.existsSync(arquivo) ? fs.readFileSync(arquivo, 'utf8') : '';
    if (commitado !== gerado) {
      throw new Error(`${nome} is stale or hand-edited — run \`npm run safety:export\` and commit the result.`);
    }
  });

  test('the export is deterministic', () => {
    expect(exportarRegras()).toBe(regras);
    expect(exportarConformidade(CONJUNTOS, VETORES_NORMALIZACAO)).toBe(conformidade);
  });

  test('regras.json carries every rule and idiom, patterns fully expanded', () => {
    const pack = JSON.parse(regras) as { regras: { id: string; padrao: string }[]; idiomas: { id: string }[] };
    expect(pack.regras.map((r) => r.id)).toEqual(REGRAS.map((r) => r.id));
    expect(pack.idiomas.map((i) => i.id)).toEqual(IDIOMAS.map((i) => i.id));
    for (const r of pack.regras) expect(r.padrao).not.toMatch(/\$\{/);
  });
});

/**
 * Constructs that are JS-only, mean something else in Python `re`, or whose meaning depends on
 * Unicode mode. None is needed by the rules; the scanner keeps it that way.
 */
function construcoesNaoPortaveis(fonte: string): string[] {
  const achados: string[] = [];
  let emClasse = false;
  for (let i = 0; i < fonte.length; i++) {
    const ch = fonte[i];
    if (ch === '\\') {
      const e = fonte[i + 1] ?? '';
      if (e === 'u') {
        if (!/^[0-9a-fA-F]{4}$/.test(fonte.slice(i + 2, i + 6))) achados.push(`\\u without 4 hex digits at ${i}`);
        i += 5;
        continue;
      }
      if (e === 'x') {
        if (!/^[0-9a-fA-F]{2}$/.test(fonte.slice(i + 2, i + 4))) achados.push(`\\x without 2 hex digits at ${i}`);
        i += 3;
        continue;
      }
      if (e === 's' || e === 'S') achados.push(`\\${e} (Unicode in JS, ASCII in Python re.ASCII — spell the class out) at ${i}`);
      else if (/[0-9]/.test(e)) achados.push(`\\${e} (backreference / octal) at ${i}`);
      else if (/[a-zA-Z]/.test(e) && !'bBdDwWtnrfv'.includes(e)) achados.push(`\\${e} (unknown escape: identity in JS, error or different in Python) at ${i}`);
      else if (emClasse && e === 'b') achados.push(`\\b inside a class at ${i}`);
      i++;
      continue;
    }
    if (emClasse) {
      if (ch === ']') emClasse = false;
      else if (ch === '[') achados.push(`nested '[' in a class (a Python FutureWarning) at ${i}`);
      continue;
    }
    if (ch === '[') {
      if (fonte[i + 1] === ']' || fonte.slice(i + 1, i + 3) === '^]') achados.push(`empty / negated-empty class at ${i}`);
      emClasse = true;
      if (fonte[i + 1] === '^') i++;
      if (fonte[i + 1] === ']') i++; // a leading ']' is literal in Python but closes the class in JS — reported above
      continue;
    }
    if (ch === '(' && fonte[i + 1] === '?') {
      const g = fonte.slice(i, i + 3);
      if (g !== '(?:' && g !== '(?=' && g !== '(?!') achados.push(`group '${fonte.slice(i, i + 4)}' (lookbehind / named group / inline flag) at ${i}`);
      continue;
    }
    if (ch === '{' && fonte[i + 1] === ',') achados.push(`'{,' (literal in JS, a {0,n} quantifier in Python) at ${i}`);
  }
  if (emClasse) achados.push('unterminated class');
  return achados;
}

describe('portability to Python re (re.ASCII)', () => {
  test('the scanner catches the constructs it is meant to reject', () => {
    for (const ruim of [String.raw`(?<=a)b`, String.raw`(?<!a)b`, String.raw`(?<n>a)\k<n>`, String.raw`\p{L}`, String.raw`a\sb`, String.raw`[^]`, String.raw`a{,3}`, String.raw`(a)\1`, String.raw`\e`, String.raw`(?i)a`, String.raw`\u{1F600}`]) {
      expect(construcoesNaoPortaveis(ruim)).not.toEqual([]);
    }
    for (const bom of [String.raw`\b(?:a|b)\b`, String.raw`(?=x)(?!y)`, String.raw`[\t -]`, String.raw`\d{2,}\w*`, String.raw`[-._*]`]) {
      expect(construcoesNaoPortaveis(bom)).toEqual([]);
    }
  });

  test.each(fontesRegex().map((f) => [f.nome, f.fonte]))('%s has no JS-only construct', (nome, fonte) => {
    expect(construcoesNaoPortaveis(fonte)).toEqual([]);
    // Rule and idiom patterns are squeezed + wrapped before compiling; check what actually runs.
    if (/^(?:regra|idioma):/.test(nome)) expect(construcoesNaoPortaveis(fonteCompilada(fonte))).toEqual([]);
  });

  test('rule and idiom patterns are ASCII (they run over ASCII-only text)', () => {
    for (const p of [...REGRAS, ...IDIOMAS]) expect(p.padrao).toMatch(/^[\x20-\x7e]*$/);
  });

  test('normalized text is ASCII-only, single-spaced and has no newline', () => {
    const entradas = [...CONJUNTOS.flatMap((c) => c.frases), ...VETORES_NORMALIZACAO.map((v) => v.entrada)];
    for (const e of entradas) {
      for (const t of [normalize(e), textoParaRegras(e)]) expect(t).toMatch(/^(?:[a-z0-9@.]+(?: [a-z0-9@.]+)*)?$/);
    }
  });

  test('python3 re.ASCII finds exactly the matches JS finds, for every pattern', () => {
    const py = spawnSync('python3', ['--version'], { encoding: 'utf8' });
    if (py.status !== 0) {
      if (process.env.CI) throw new Error('python3 is required in CI for the regex parity check');
      console.warn('[safety-pack] python3 not found — regex parity vs Python skipped locally (CI runs it).');
      return;
    }
    const frases = CONJUNTOS.flatMap((c) => c.frases);
    const brutos = [...frases, ...VETORES_NORMALIZACAO.map((v) => v.entrada)].map((t) => t.toLowerCase());
    const normalizados = frases.map(normalize);
    const mascarados = frases.map(textoParaRegras);
    // Rules run over masked text, idioms over normalized text, normalization patterns over raw lowercase input.
    const casos: { nome: string; fonte: string; textos: 'brutos' | 'normalizados' | 'mascarados' }[] = [
      ...REGRAS.map((r) => ({ nome: r.id, fonte: fonteCompilada(r.padrao), textos: 'mascarados' as const })),
      ...IDIOMAS.map((i) => ({ nome: i.id, fonte: fonteCompilada(i.padrao), textos: 'normalizados' as const })),
      ...fontesRegex()
        .filter((f) => f.nome.startsWith('normalizacao:'))
        .map((f) => ({ nome: f.nome, fonte: f.fonte, textos: 'brutos' as const })),
    ];
    const textos = { brutos, normalizados, mascarados };
    // Spans in code points (Python indexes code points; JS indexes UTF-16 units).
    const cp = (t: string, i: number) => Array.from(t.slice(0, i)).length;
    const esperado: Record<string, number[][][]> = {};
    for (const c of casos) {
      const re = new RegExp(c.fonte, 'g');
      esperado[c.nome] = textos[c.textos].map((t) => [...t.matchAll(re)].map((m) => [cp(t, m.index ?? 0), cp(t, (m.index ?? 0) + m[0].length)]));
    }
    const script = [
      'import json, re, sys',
      'd = json.load(sys.stdin)',
      'out = {}',
      'for c in d["casos"]:',
      '    r = re.compile(c["fonte"], re.ASCII)',
      '    out[c["nome"]] = [[[m.start(), m.end()] for m in r.finditer(t)] for t in d["textos"][c["textos"]]]',
      'sys.stdout.write(json.dumps(out))',
    ].join('\n');
    const res = spawnSync('python3', ['-c', script], { input: JSON.stringify({ casos, textos }), encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
    if (res.status !== 0) throw new Error(`python3 failed: ${res.stderr}`);
    const obtido = JSON.parse(res.stdout) as Record<string, number[][][]>;
    const divergentes = casos.map((c) => c.nome).filter((n) => JSON.stringify(obtido[n]) !== JSON.stringify(esperado[n]));
    expect(divergentes).toEqual([]);
  });
});
