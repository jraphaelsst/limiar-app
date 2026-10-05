/// <reference types="jest" />
/// <reference types="node" />
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import ts from 'typescript';

import { size } from '@/theme/tokens';
import { typography } from '@/theme/typography';

/**
 * Static screen-reader gates (spec §17–§20). What a test can prove without a device: every control has a
 * role and a name, headings are announced as headings, decorative visuals are hidden, text can scale.
 * What it cannot (reading order, focus moves, how VoiceOver/TalkBack actually speak) stays on the device
 * checklist in docs/plan/fase-1-mvp.md §8. Parsed with the TypeScript compiler, not regexes.
 */
const root = join(__dirname, '..', '..');

function filesUnder(dir: string, ext = /\.tsx$/): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (name === '__tests__') return [];
    return statSync(p).isDirectory() ? filesUnder(p, ext) : ext.test(name) ? [p] : [];
  });
}

type Hit = { sf: ts.SourceFile; file: string; line: number; tag: string; attrs: Map<string, ts.JsxAttribute>; spread: boolean; node: ts.JsxOpeningLikeElement; children: readonly ts.JsxChild[] };

function elements(file: string): Hit[] {
  const text = readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const out: Hit[] = [];
  const visit = (n: ts.Node) => {
    let opening: ts.JsxOpeningLikeElement | undefined;
    let children: readonly ts.JsxChild[] = [];
    if (ts.isJsxElement(n)) {
      opening = n.openingElement;
      children = n.children;
    } else if (ts.isJsxSelfClosingElement(n)) opening = n;
    if (opening) {
      const attrs = new Map<string, ts.JsxAttribute>();
      let spread = false;
      for (const a of opening.attributes.properties) {
        if (ts.isJsxAttribute(a)) attrs.set(a.name.getText(sf), a);
        else spread = true;
      }
      out.push({
        sf,
        file: file.slice(root.length + 1),
        line: sf.getLineAndCharacterOfPosition(opening.getStart(sf)).line + 1,
        tag: opening.tagName.getText(sf),
        attrs,
        spread,
        node: opening,
        children,
      });
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return out;
}

const files = filesUnder(root);
const all = files.flatMap(elements);
const where = (h: Hit) => `${h.file}:${h.line} <${h.tag}>`;

/** The literal value of an attribute: string, `{false}`/`{true}`, else undefined (dynamic). */
function literal(a: ts.JsxAttribute | undefined): string | boolean | undefined {
  const init = a?.initializer;
  if (!init) return a ? true : undefined; // bare attribute = true
  if (ts.isStringLiteral(init)) return init.text;
  if (ts.isJsxExpression(init) && init.expression) {
    const e = init.expression;
    if (e.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (e.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (ts.isStringLiteralLike(e)) return e.text;
  }
  return undefined;
}

const hasName = (h: Hit) => h.attrs.has('accessibilityLabel') || h.attrs.has('aria-label') || h.attrs.has('accessibilityLabelledBy');
const hasRole = (h: Hit) => h.attrs.has('accessibilityRole') || h.attrs.has('role');
const isText = (n: ts.Node) => (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) && /^(AppText|Text)$/.test(tagOf(n));
function tagOf(c: ts.JsxElement | ts.JsxSelfClosingElement): string {
  return (ts.isJsxElement(c) ? c.openingElement : c).tagName.getText();
}
/**
 * Rendered text anywhere inside the element (RN derives a button's name from its descendants). A child
 * `{body}` identifier is resolved to its `const body = …` in the same file (ListRow builds its content once).
 */
function subtreeHasText(node: ts.Node, sf: ts.SourceFile, seen = new Set<string>()): boolean {
  if (isText(node) || (ts.isJsxText(node) && node.text.trim() !== '')) return true;
  if (ts.isIdentifier(node) && !seen.has(node.text)) {
    seen.add(node.text);
    let found = false;
    sf.forEachChild(function find(n): void {
      if (found) return;
      if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === node.text && n.initializer) found = subtreeHasText(n.initializer, sf, seen);
      else n.forEachChild(find);
    });
    return found;
  }
  return !!ts.forEachChild(node, (c) => (subtreeHasText(c, sf, seen) ? true : undefined));
}
const hasTextChild = (h: Hit) => h.children.some((c) => subtreeHasText(c, h.sf));

describe('the scan is not vacuous', () => {
  test('finds the pressables, text and images it is meant to judge', () => {
    expect(all.filter((h) => h.tag === 'Pressable').length).toBeGreaterThanOrEqual(5);
    expect(all.filter((h) => h.tag === 'AppText').length).toBeGreaterThan(100);
    expect(all.filter((h) => h.tag === 'Image').length).toBeGreaterThanOrEqual(1);
  });
});

describe('every pressable has a role and an accessible name', () => {
  const touchables = all.filter((h) => /^(Pressable|Touchable\w*)$/.test(h.tag));
  test.each(touchables.map((h) => [where(h), h] as const))('%s', (_w, h) => {
    expect(hasRole(h)).toBe(true);
    // Name: an explicit label, or visible text inside (RN derives the name from it).
    expect(hasName(h) || hasTextChild(h)).toBe(true);
  });

  test('no raw touchable-by-gesture escape hatches (onPress on a plain View/Text)', () => {
    const bad = all.filter((h) => /^(View|Text|AppText|Image)$/.test(h.tag) && h.attrs.has('onPress'));
    expect(bad.map(where)).toEqual([]);
  });
});

describe('the control primitives name and role themselves', () => {
  test.each([
    ['Button', /accessibilityRole="button"/],
    ['IconButton', /accessibilityRole="button"/],
    ['OptionPill', /accessibilityRole=\{multiple \? 'checkbox' : 'radio'\}/],
  ])('ui/%s sets its role', (name, role) => {
    expect(readFileSync(join(root, 'components', 'ui', `${name}.tsx`), 'utf8')).toMatch(role);
  });

  test('IconButton gives the glyph button its name from the required `label`', () => {
    expect(readFileSync(join(root, 'components', 'ui', 'IconButton.tsx'), 'utf8')).toMatch(/accessibilityLabel=\{label\}/);
  });

  test.each(['Button', 'IconButton', 'OptionPill'])('every <%s> passes a non-empty label (never a bare spread)', (tag) => {
    const uses = all.filter((h) => h.tag === tag);
    expect(uses.length).toBeGreaterThan(0);
    const bad = uses.filter((h) => {
      const l = h.attrs.get('label');
      return !l || literal(l) === '';
    });
    expect(bad.map(where)).toEqual([]);
  });

  test('a custom accessibilityLabel on a Button/IconButton still carries its visible label (WCAG 2.5.3 label-in-name)', () => {
    const bad = all.filter((h) => (h.tag === 'Button' || h.tag === 'IconButton') && h.attrs.has('accessibilityLabel') && typeof literal(h.attrs.get('label')) === 'string').filter((h) => {
      const visible = String(literal(h.attrs.get('label'))).toLowerCase();
      const spoken = h.attrs.get('accessibilityLabel')!.initializer!.getText().toLowerCase();
      return !spoken.includes(visible);
    });
    expect(bad.map(where)).toEqual([]);
  });

  test('a radiogroup is named (the question), or the screen reader announces an anonymous group', () => {
    const groups = all.filter((h) => literal(h.attrs.get('accessibilityRole')) === 'radiogroup');
    expect(groups.length).toBeGreaterThan(0);
    expect(groups.filter((h) => !hasName(h)).map(where)).toEqual([]);
  });
});

describe('headings are announced as headings', () => {
  const headingVariants = Object.keys(typography).filter((k) => ['display', 'h1', 'h2', 'h3'].includes(k));

  test('AppText gives accessibilityRole="header" to display/h1/h2/h3', () => {
    const src = readFileSync(join(root, 'components', 'ui', 'AppText.tsx'), 'utf8');
    expect(headingVariants).toEqual(['display', 'h1', 'h2', 'h3']);
    for (const v of headingVariants) expect(src).toContain(`variant === '${v}'`);
    expect(src).toMatch(/accessibilityRole=\{isHeading \? 'header'/);
  });

  test('no heading-variant text overrides its role', () => {
    const bad = all.filter((h) => h.tag === 'AppText' && headingVariants.includes(String(literal(h.attrs.get('variant')))) && h.attrs.has('accessibilityRole') && literal(h.attrs.get('accessibilityRole')) !== 'header');
    expect(bad.map(where)).toEqual([]);
  });

  test('AppText is the only text primitive (a raw <Text> would skip the heading mapping and the tokens)', () => {
    expect(all.filter((h) => h.tag === 'Text' && !h.file.endsWith('AppText.tsx')).map(where)).toEqual([]);
  });

  test('every screen has a heading', () => {
    const screens = files.filter((f) => f.startsWith(join(root, 'app')) && !/_layout\.tsx$/.test(f));
    const missing = screens.filter((f) => {
      if (f.endsWith('tipografia.tsx')) return false; // dev-only specimen: renders every variant dynamically
      const els = elements(f);
      // a screen's heading may come from a component it renders (ActivityNotFound, AfterActivity, …)
      return !els.some((h) => h.tag === 'AppText' && headingVariants.includes(String(literal(h.attrs.get('variant'))))) && !els.some((h) => /^(ActivityNotFound|AfterActivity|EmergencyLines)$/.test(h.tag));
    });
    expect(missing.map((f) => f.slice(root.length + 1))).toEqual([]);
  });
});

describe('images and drawings', () => {
  const images = all.filter((h) => /^(Image|Svg|ImageBackground)$/.test(h.tag));
  const hidden = (h: Hit) =>
    literal(h.attrs.get('accessible')) === false ||
    literal(h.attrs.get('aria-hidden')) === true ||
    literal(h.attrs.get('importantForAccessibility')) === 'no-hide-descendants' ||
    h.attrs.has('accessibilityElementsHidden');
  test.each(images.map((h) => [where(h), h] as const))('%s is named as an image or hidden from assistive tech', (_w, h) => {
    const named = (h.attrs.has('accessibilityLabel') || h.attrs.has('alt') || h.attrs.has('aria-label')) && literal(h.attrs.get('accessibilityRole')) === 'image';
    expect(named || hidden(h)).toBe(true);
  });

  test.each(['components/WelcomeCollage.tsx', 'components/SofaCard.tsx'])('%s keeps its decorative shapes hidden', (rel) => {
    const els = elements(join(root, rel)).filter((h) => h.tag === 'View' && hidden(h));
    expect(els.length).toBeGreaterThan(0);
    for (const h of els) {
      expect(literal(h.attrs.get('importantForAccessibility'))).toBe('no-hide-descendants');
      expect(h.attrs.has('accessibilityElementsHidden')).toBe(true); // iOS needs this one, Android the other
    }
  });
});

describe('text scales with the system setting', () => {
  test('no allowFontScaling={false}, and no maxFontSizeMultiplier below 2', () => {
    const bad = all.filter((h) => literal(h.attrs.get('allowFontScaling')) === false || (h.attrs.has('maxFontSizeMultiplier') && Number(h.attrs.get('maxFontSizeMultiplier')!.initializer!.getText().replace(/[{}]/g, '')) < 2));
    expect(bad.map(where)).toEqual([]);
  });

  test('no allowFontScaling=false in non-JSX code either (style objects, screenOptions, defaultProps)', () => {
    const noComments = (t: string) => t.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
    const offenders = filesUnder(root, /\.tsx?$/).filter((f) => /allowFontScaling\s*[:=]\s*(\{\s*)?false/.test(noComments(readFileSync(f, 'utf8'))));
    expect(offenders).toEqual([]);
  });

  test('app.json does not switch scaling off', () => {
    expect(readFileSync(join(root, '..', 'app.json'), 'utf8')).not.toMatch(/allowFontScaling|"fontScale"/);
  });
});

describe('touch targets stay >= 48 pt', () => {
  test('size.touchMin is 48', () => expect(size.touchMin).toBeGreaterThanOrEqual(48));

  test.each(['Button', 'OptionPill', 'ListRow', 'IconButton'])('ui/%s declares no minHeight/height literal below 48', (name) => {
    const src = readFileSync(join(root, 'components', 'ui', `${name}.tsx`), 'utf8');
    const small = [...src.matchAll(/\b(?:minHeight|height|width):\s*(\d+)/g)].map((m) => Number(m[1])).filter((n) => n < 48);
    expect(small).toEqual([]);
  });
});
