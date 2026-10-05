/**
 * What each world of spec §3.1 shows — pure selection over the content modules, so the world screen
 * (src/app/mundo/[id].tsx) only renders. Every function takes its sources as parameters (defaulting to
 * the real catalog) so tests run on fixtures, independent of how the catalog is tagged today.
 *
 * Activities carry their own `worlds` (src/data/activities.ts). Reflection themes and games have no such
 * field, so their world membership lives here, typed against their id unions — a new theme or game fails
 * to compile until it is placed (even if in no world).
 */
import { activities as catalog, type Activity } from './activities';
import { games as allGames, type GameId, type GameInfo } from './games';
import { reflectionsFor, themes as allThemes, type Theme, type ThemeId } from './reflexoes';
import type { WorldId } from './worlds';

/**
 * Spec §4.7 themes → §3.1 worlds, by the scope words of each world. A proposal like the content it
 * points at (rascunho) — Mônica may move it.
 * - "Trabalho e projetos": projetos ∈ "O que faço com esse tempo?", trabalho ∈ "Meu mundo pode aumentar".
 * - "Planos e interesses": desejos ∈ "Quem sou eu agora?", interesses ∈ "Meu mundo pode aumentar".
 * - "Outro assunto…" is by definition outside the worlds; "Experimenta isso" is the activity deck only.
 */
export const themeWorlds: Readonly<Record<ThemeId, readonly WorldId[]>> = {
  'filhos-adultos': ['filhos-adultos'],
  relacionamento: ['nos-dois'],
  'rotina-e-tempo': ['tempo'],
  'trabalho-e-projetos': ['tempo', 'mundo'],
  amizades: ['mundo'],
  'quem-sou-hoje': ['quem-sou'],
  'planos-e-interesses': ['quem-sou', 'mundo'],
  'outro-assunto': [],
};

/** Spec §4.5 games are the entry to "Quem sou eu agora?" (gostos, partes da vida pouco usadas). */
export const gameWorlds: Readonly<Record<GameId, readonly WorldId[]>> = {
  'ainda-gosto': ['quem-sou'],
  'isso-ainda-e-meu': ['quem-sou'],
};

/**
 * The activities of one world, in catalog order; retired activities are left out.
 */
export function activitiesForWorld(world: WorldId, pool: readonly Activity[] = catalog): readonly Activity[] {
  return pool.filter((a) => a.reviewStatus !== 'retirado' && a.worlds.includes(world));
}

/**
 * The reflection themes of one world, in spec §4.7 order — only themes that have at least one card to
 * read, so the world screen never links to an empty theme.
 */
export function themesForWorld(
  world: WorldId,
  {
    themes = allThemes,
    mapping = themeWorlds,
    hasCards = (t: ThemeId) => reflectionsFor(t).length > 0,
  }: { themes?: readonly Theme[]; mapping?: Readonly<Record<ThemeId, readonly WorldId[]>>; hasCards?: (t: ThemeId) => boolean } = {},
): readonly Theme[] {
  return themes.filter((t) => mapping[t.id].includes(world) && hasCards(t.id));
}

/** The games of one world, in their list order. */
export function gamesForWorld(
  world: WorldId,
  { games = allGames, mapping = gameWorlds }: { games?: readonly GameInfo[]; mapping?: Readonly<Record<GameId, readonly WorldId[]>> } = {},
): readonly GameInfo[] {
  return games.filter((g) => mapping[g.id].includes(world));
}

/**
 * Where a world opens. "Experimenta isso" is, by spec §3.1, the deck of microexperiences — the whole
 * catalog — and that screen already exists (`/atividades`, titled "Experimenta isso", also the Home's
 * "Ver todas"); a second screen with the same title and a narrower list would contradict it. Every
 * other world opens its own screen.
 */
export function worldRoute(world: WorldId): '/atividades' | { pathname: '/mundo/[id]'; params: { id: WorldId } } {
  return world === 'experimenta' ? '/atividades' : { pathname: '/mundo/[id]', params: { id: world } };
}
