/// <reference types="jest" />
import { activities, type Activity } from '@/data/activities';
import { games } from '@/data/games';
import { reflectionsFor, themes, type Theme, type ThemeId } from '@/data/reflexoes';
import { activitiesForWorld, gamesForWorld, gameWorlds, themesForWorld, themeWorlds, worldRoute } from '@/data/world-content';
import { findWorld, worlds, type WorldId } from '@/data/worlds';

// Record<Union, true> fails to compile if a member is missing or extra — the runtime check stays exhaustive.
const worldIds: Record<WorldId, true> = {
  'quem-sou': true,
  'filhos-adultos': true,
  tempo: true,
  'nos-dois': true,
  mundo: true,
  experimenta: true,
};

// Fixtures: the selection must not depend on how the real catalog happens to be tagged today.
const mk = (id: string, over: Partial<Activity> = {}): Activity => ({ ...activities[0], activityId: id, ...over });

describe('worlds (spec §3.1)', () => {
  test('exactly the six worlds, each with a title, a short line and a scope', () => {
    expect(worlds.map((w) => w.id).sort()).toEqual(Object.keys(worldIds).sort());
    for (const w of worlds) {
      expect(w.title.trim()).not.toBe('');
      expect(w.description.trim()).not.toBe('');
      expect(w.scope.trim()).not.toBe('');
    }
  });

  test('"Nós dois agora" carries the visible no-partner note (spec §3.1)', () => {
    expect(findWorld('nos-dois')?.note).toMatch(/sem|não tem/);
  });

  test('findWorld: unknown or missing id is undefined', () => {
    expect(findWorld('quem-sou')?.title).toBe('Quem sou eu agora?');
    expect(findWorld('nao-existe')).toBeUndefined();
    expect(findWorld(undefined)).toBeUndefined();
  });
});

describe('activitiesForWorld', () => {
  const pool = [
    mk('a', { worlds: ['tempo'] }),
    mk('b', { worlds: ['tempo', 'mundo'] }),
    mk('d', { worlds: [] }),
    mk('e', { worlds: ['tempo'], reviewStatus: 'retirado' }),
    mk('f', { worlds: ['nos-dois'] }),
  ];
  const ids = (w: WorldId) => activitiesForWorld(w, pool).map((a) => a.activityId);

  test('only activities tagged with the world, in pool order', () => {
    expect(ids('tempo')).toEqual(['a', 'b']);
    expect(ids('mundo')).toEqual(['b']);
    expect(ids('nos-dois')).toEqual(['f']);
  });

  test('empty `worlds` is "not in any world"', () => {
    for (const w of Object.keys(worldIds) as WorldId[]) {
      expect(ids(w)).not.toContain('d');
    }
  });

  test("retired activities are left out", () => {
    expect(ids('tempo')).not.toContain('e');
  });

  test('a world with nothing tagged is empty (the screen shows its honest empty state)', () => {
    expect(ids('filhos-adultos')).toEqual([]);
    expect(activitiesForWorld('tempo', [])).toEqual([]);
  });
});

describe('themesForWorld', () => {
  const fixtureThemes: readonly Theme[] = [
    { id: 'amizades', label: 'A' },
    { id: 'relacionamento', label: 'R' },
    { id: 'trabalho-e-projetos', label: 'T' },
  ];
  const mapping: Record<ThemeId, readonly WorldId[]> = { ...themeWorlds, amizades: ['mundo'], relacionamento: ['nos-dois'], 'trabalho-e-projetos': ['tempo', 'mundo'] };

  test('themes mapped to the world, in theme order', () => {
    const got = themesForWorld('mundo', { themes: fixtureThemes, mapping, hasCards: () => true }).map((t) => t.id);
    expect(got).toEqual(['amizades', 'trabalho-e-projetos']);
  });

  test('a theme without cards is never linked', () => {
    const got = themesForWorld('mundo', { themes: fixtureThemes, mapping, hasCards: (t) => t !== 'amizades' }).map((t) => t.id);
    expect(got).toEqual(['trabalho-e-projetos']);
  });

  test('real mapping: every linked theme has cards; "Outro assunto" and "Experimenta isso" get none', () => {
    for (const w of Object.keys(worldIds) as WorldId[]) {
      for (const t of themesForWorld(w)) expect(reflectionsFor(t.id).length).toBeGreaterThan(0);
    }
    expect(themeWorlds['outro-assunto']).toEqual([]);
    expect(themesForWorld('experimenta')).toEqual([]);
    expect(themes.every((t) => t.id in themeWorlds)).toBe(true);
  });

  test('real mapping: each themed world reaches its spec §4.7 theme', () => {
    expect(themesForWorld('filhos-adultos').map((t) => t.id)).toContain('filhos-adultos');
    expect(themesForWorld('nos-dois').map((t) => t.id)).toContain('relacionamento');
    expect(themesForWorld('quem-sou').map((t) => t.id)).toContain('quem-sou-hoje');
    expect(themesForWorld('tempo').map((t) => t.id)).toContain('rotina-e-tempo');
    expect(themesForWorld('mundo').map((t) => t.id)).toContain('amizades');
  });
});

describe('gamesForWorld', () => {
  test('both games belong to "Quem sou eu agora?" and to no other world', () => {
    expect(gamesForWorld('quem-sou').map((g) => g.id)).toEqual(games.map((g) => g.id));
    for (const w of Object.keys(worldIds) as WorldId[]) if (w !== 'quem-sou') expect(gamesForWorld(w)).toEqual([]);
  });

  test('fixture mapping is honoured', () => {
    expect(gamesForWorld('tempo', { mapping: { ...gameWorlds, 'ainda-gosto': ['tempo'] } }).map((g) => g.id)).toEqual(['ainda-gosto']);
  });
});

describe('worldRoute', () => {
  test('"Experimenta isso" opens the catalog; every other world opens its own screen', () => {
    expect(worldRoute('experimenta')).toBe('/atividades');
    for (const w of Object.keys(worldIds) as WorldId[]) {
      if (w === 'experimenta') continue;
      expect(worldRoute(w)).toEqual({ pathname: '/mundo/[id]', params: { id: w } });
    }
  });
});
