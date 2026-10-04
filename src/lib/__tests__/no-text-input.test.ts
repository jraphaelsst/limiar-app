/// <reference types="jest" />
/// <reference types="node" />
// (@types/node is present via jest; the app tsconfig does not load it for app code.)
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

/**
 * decisions.md 2026-10-04: no free-text field ships before a semantic classifier — the rules alone
 * caught 32% / 36% of the high-risk phrasing in blind sets. The guided reflection is built without
 * typing; this test keeps it that way for every file of its routes and the components they render.
 */
const root = join(__dirname, '..', '..');

function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? filesUnder(p) : /\.(t|j)sx?$/.test(name) ? [p] : [];
  });
}

const routeFiles = readdirSync(join(root, 'app'))
  .filter((name) => name.startsWith('reflexao'))
  .flatMap((name) => {
    const p = join(root, 'app', name);
    return statSync(p).isDirectory() ? filesUnder(p) : [p];
  });

/** Local components the routes import (one level), so a TextInput cannot hide one import away. */
const componentFiles = [...new Set(routeFiles.flatMap((f) => [...readFileSync(f, 'utf8').matchAll(/from '@\/components\/([\w-]+)'/g)].map((m) => m[1])))]
  .filter((name) => name !== 'ui')
  .map((name) => join(root, 'components', `${name}.tsx`));

describe('guided reflection has no text input', () => {
  test('the routes exist (the scan is not vacuous)', () => {
    expect(routeFiles.map((f) => f.slice(root.length + 1)).sort()).toEqual(['app/reflexao/[tema].tsx', 'app/reflexao/index.tsx']);
    expect(componentFiles.length).toBeGreaterThan(0);
  });

  test.each([...routeFiles, ...componentFiles].map((f) => [f.slice(root.length + 1), f] as const))('%s', (_rel, file) => {
    const src = readFileSync(file, 'utf8');
    expect(src).not.toMatch(/\bTextInput\b/);
    expect(src).not.toMatch(/\b(TextField|SearchBar|contentEditable|<input|<textarea)\b/i);
    expect(src).not.toMatch(/useSafetyGate/); // a gate would mean free text is being read
  });

  test('the ui kit itself has no text input either', () => {
    for (const f of filesUnder(join(root, 'components', 'ui'))) expect(readFileSync(f, 'utf8')).not.toMatch(/\bTextInput\b/);
  });
});
