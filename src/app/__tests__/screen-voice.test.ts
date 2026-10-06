/// <reference types="jest" />
/// <reference types="node" />
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import ts from 'typescript';

import { avoidedWord, voiceProblems } from '../../data/__tests__/voice-rules';

/**
 * The voice rules for text written straight into screens and components (src/app, src/components), not
 * only for the content files: found 2026-10-05 in the simulator walk — Home greeted with an exclamation
 * that no test could see. Reads every JSX text, every string inside JSX, and the spoken/visible string
 * props, with the TypeScript compiler (not regexes).
 */
const src = join(__dirname, '..', '..');
const TEXT_PROPS = new Set(['accessibilityLabel', 'accessibilityHint', 'title', 'label', 'description', 'placeholder', 'subtitle', 'hint']);
/** Dev-only screens that are not part of the product. */
const SKIP = new Set(['app/tipografia.tsx']);

function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (name === '__tests__') return [];
    return statSync(p).isDirectory() ? filesUnder(p) : /\.tsx$/.test(name) ? [p] : [];
  });
}

type Line = { where: string; text: string };

function screenText(file: string): Line[] {
  const sf = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const out: Line[] = [];
  const at = (n: ts.Node) => `${file.slice(src.length + 1)}:${sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1}`;
  const strings = (n: ts.Node) => {
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) out.push({ where: at(n), text: n.text });
    else if (ts.isTemplateExpression(n)) out.push({ where: at(n), text: [n.head.text, ...n.templateSpans.map((s) => s.literal.text)].join(' … ') });
    else if (!ts.isJsxElement(n) && !ts.isJsxSelfClosingElement(n)) ts.forEachChild(n, strings);
  };
  const visit = (n: ts.Node) => {
    if (ts.isJsxText(n) && n.text.trim()) out.push({ where: at(n), text: n.text.trim() });
    else if (ts.isJsxExpression(n) && n.parent && (ts.isJsxElement(n.parent) || ts.isJsxFragment(n.parent)) && n.expression) strings(n.expression);
    else if (ts.isJsxAttribute(n) && TEXT_PROPS.has(n.name.getText(sf)) && n.initializer) strings(n.initializer);
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return out;
}

const lines = [...filesUnder(join(src, 'app')), ...filesUnder(join(src, 'components'))]
  .filter((f) => !SKIP.has(f.slice(src.length + 1)))
  .flatMap(screenText)
  .filter((l) => /\p{L}/u.test(l.text));

test('the scan reads the screens (a broken walker would pass everything)', () => {
  expect(lines.length).toBeGreaterThan(150);
});

test.each(lines.map((l) => [l.where, l.text] as const))('%s reads in the app voice', (_where, text) => {
  expect({ problems: voiceProblems(text), word: avoidedWord(text) }).toEqual({ problems: [], word: undefined });
});
