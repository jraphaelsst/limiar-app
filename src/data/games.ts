/**
 * Discovery games — spec §4.5, games A and B (screens 11–12).
 *
 * ⚠️ ALL CONTENT HERE IS `rascunho`: pairs, cards, classifications and reflection
 * questions were written from the spec examples and still await Mônica's editorial
 * review (spec §22 — nothing is published by AI alone). Change `reviewStatus` only
 * after that review.
 *
 * Rules these games keep (spec §4.5, §6, §9):
 * - never a "teste", "avaliação", "perfil" or score — results are observable
 *   patterns in plain words, recomputed from the choices, never stored as text;
 * - game A is temporary unless the user taps "Guardar este resultado" (ids only);
 * - game B stores nothing and never interprets family relationships.
 */
import type { ReviewStatus } from '@/data/activities';
import type { Preset } from '@/lib/recommend';

export type GameId = 'ainda-gosto' | 'isso-ainda-e-meu';

export type GameInfo = {
  id: GameId;
  title: string;
  description: string;
  href: '/jogos/ainda-gosto' | '/jogos/isso-ainda-e-meu';
  reviewStatus: ReviewStatus;
};

export const games: readonly GameInfo[] = [
  {
    id: 'ainda-gosto',
    title: 'Ainda gosto disso?',
    description: 'Rodadas rápidas de escolha entre duas coisas. No fim, os temas que mais apareceram.',
    href: '/jogos/ainda-gosto',
    reviewStatus: 'rascunho',
  },
  {
    id: 'isso-ainda-e-meu',
    title: 'Isso ainda é meu?',
    description: 'Cartões com hábitos e papéis do dia a dia para olhar com calma, um de cada vez.',
    href: '/jogos/isso-ainda-e-meu',
    reviewStatus: 'rascunho',
  },
];

// ─── Game A — "Ainda gosto disso?" ───────────────────────────────────────────

/**
 * A theme is what a choice has in common with other choices. Only themes are
 * summarised — never a trait of the person. `preset` is set ONLY where "Me tira
 * do sofá" can honestly open that direction today (spec §4.3 presets); every
 * other theme leads to the plain flow.
 */
export type ThemeId =
  | 'natureza'
  | 'cidade'
  | 'aprendizado'
  | 'criacao'
  | 'cultura'
  | 'companhia'
  | 'tempo-so'
  | 'planejamento'
  | 'improviso'
  | 'troca'
  | 'calma'
  | 'passeios';

type DirectionPreset = Extract<Preset, 'criar' | 'aprender' | 'sair'>;

export const themes: Record<ThemeId, { word: string; preset?: DirectionPreset }> = {
  natureza: { word: 'natureza', preset: 'sair' },
  cidade: { word: 'cidade', preset: 'sair' },
  aprendizado: { word: 'aprendizado', preset: 'aprender' },
  criacao: { word: 'fazer com as mãos', preset: 'criar' },
  cultura: { word: 'cultura' },
  companhia: { word: 'companhia' },
  'tempo-so': { word: 'tempo sozinha' },
  planejamento: { word: 'planejamento' },
  improviso: { word: 'improviso' },
  troca: { word: 'ensinar' },
  calma: { word: 'silêncio' },
  passeios: { word: 'passeios', preset: 'sair' },
};

/** What "Me tira do sofá" opens for each direction (button label). */
export const directionLabel: Record<DirectionPreset, string> = {
  criar: 'Ver ideias para criar',
  aprender: 'Ver ideias para aprender',
  sair: 'Ver ideias para sair de casa',
};

export type PairOption = { id: string; label: string; theme?: ThemeId };
export type Pair = { id: string; options: readonly [PairOption, PairOption]; reviewStatus: ReviewStatus };

const pair = (id: string, a: PairOption, b: PairOption): Pair => ({ id, options: [a, b], reviewStatus: 'rascunho' });

/** The first five come verbatim from spec §4.5; the rest follow the same shape. */
export const pairs: readonly Pair[] = [
  pair('praia-serra', { id: 'praia', label: 'Praia' }, { id: 'serra', label: 'Serra' }),
  pair('grupo-sozinha', { id: 'grupo', label: 'Em grupo', theme: 'companhia' }, { id: 'sozinha', label: 'Sozinha', theme: 'tempo-so' }),
  pair('planejar-improvisar', { id: 'planejar', label: 'Planejar', theme: 'planejamento' }, { id: 'improvisar', label: 'Improvisar', theme: 'improviso' }),
  pair('aprender-ensinar', { id: 'aprender', label: 'Aprender', theme: 'aprendizado' }, { id: 'ensinar', label: 'Ensinar', theme: 'troca' }),
  pair('cidade-natureza', { id: 'cidade', label: 'Cidade', theme: 'cidade' }, { id: 'natureza', label: 'Natureza', theme: 'natureza' }),
  pair('maos-leitura', { id: 'maos', label: 'Fazer com as mãos', theme: 'criacao' }, { id: 'leitura', label: 'Ler sobre o assunto', theme: 'aprendizado' }),
  pair('museu-trilha', { id: 'museu', label: 'Museu', theme: 'cultura' }, { id: 'trilha', label: 'Trilha', theme: 'natureza' }),
  pair('show-silencio', { id: 'show', label: 'Música ao vivo', theme: 'cultura' }, { id: 'silencio', label: 'Silêncio', theme: 'calma' }),
  pair('receita-jardim', { id: 'receita', label: 'Testar uma receita nova', theme: 'criacao' }, { id: 'jardim', label: 'Mexer com plantas', theme: 'natureza' }),
  pair('viagem-bairro', { id: 'viagem', label: 'Uma viagem curta', theme: 'passeios' }, { id: 'bairro', label: 'Um passeio pelo bairro', theme: 'cidade' }),
];

/** One answer: the option id, or `null` when the round was skipped. */
export type GameAChoices = Readonly<Record<string, string | null>>;

export type GameAPattern = {
  /** Themes that appeared at least twice, most frequent first (max 2 — one idea per surface). */
  themes: readonly ThemeId[];
  /** Labels of what was picked, in round order — shown as-is, never interpreted. */
  picked: readonly string[];
  /** The first direction "Me tira do sofá" can open, if any theme has one. */
  preset?: DirectionPreset;
};

/** Pure: same choices ⇒ same result. A theme must repeat to count as a pattern. */
export function gameAPattern(choices: GameAChoices): GameAPattern {
  const counts = new Map<ThemeId, number>();
  const picked: string[] = [];
  for (const p of pairs) {
    const opt = p.options.find((o) => o.id === choices[p.id]);
    if (!opt) continue;
    picked.push(opt.label);
    if (opt.theme) counts.set(opt.theme, (counts.get(opt.theme) ?? 0) + 1);
  }
  const order = Object.keys(themes) as ThemeId[];
  const top = [...counts.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1] || order.indexOf(a[0]) - order.indexOf(b[0]))
    .slice(0, 2)
    .map(([t]) => t);
  const preset = top.map((t) => themes[t].preset).find((x): x is DirectionPreset => !!x);
  return { themes: top, picked, preset };
}

/** "natureza e aprendizado". */
export function themeList(ids: readonly ThemeId[]): string {
  return ids.map((t) => themes[t].word).join(' e ');
}

/**
 * The observable pattern as one plain sentence: "Nas escolhas de hoje, dois temas
 * se repetiram: natureza e aprendizado." Themes are listed, never conjugated into
 * the sentence — the spec example ("apareceram bastante X") breaks with themes
 * that are not plain nouns. `undefined` when no theme repeated.
 */
export function patternSentence(ids: readonly ThemeId[]): string | undefined {
  if (ids.length === 0) return undefined;
  const words = themeList(ids);
  return ids.length === 1 ? `Nas escolhas de hoje, um tema se repetiu: ${words}.` : `Nas escolhas de hoje, dois temas se repetiram: ${words}.`;
}

/** Valid ids, for the stored-result type guard. */
export function isValidGameAChoice(pairId: string, optionId: string | null): boolean {
  const p = pairs.find((x) => x.id === pairId);
  return !!p && (optionId === null || p.options.some((o) => o.id === optionId));
}

// ─── Game B — "Isso ainda é meu?" ────────────────────────────────────────────

/** Spec §4.5, verbatim. */
export type Stance = 'gosto' | 'habito' | 'esperam' | 'nao-sei';

export const stances: readonly { id: Stance; label: string }[] = [
  { id: 'gosto', label: 'Faço porque gosto' },
  { id: 'habito', label: 'Faço por hábito' },
  { id: 'esperam', label: 'Faço porque esperam' },
  { id: 'nao-sei', label: 'Não sei mais' },
];

export type RoleCard = { id: string; text: string; reviewStatus: ReviewStatus };

const card = (id: string, text: string): RoleCard => ({ id, text, reviewStatus: 'rascunho' });

export const roleCards: readonly RoleCard[] = [
  card('encontros-familia', 'Organizar os encontros de família'),
  card('aniversarios', 'Ser quem lembra os aniversários'),
  card('cozinhar', 'Cozinhar no dia a dia'),
  card('amigos', 'Ser quem organiza os encontros com amigos'),
  card('mesmo-caminho', 'Fazer sempre o mesmo caminho'),
  card('mensagens', 'Responder mensagens assim que chegam'),
  card('caminhada', 'Caminhar sempre no mesmo horário'),
  card('viagens', 'Planejar as viagens'),
  card('serie', 'Ver a mesma série ou novela todo dia'),
  card('conversa', 'Ser quem as pessoas procuram para conversar'),
  card('presentes', 'Escolher presentes'),
  card('plantas', 'Cuidar das plantas'),
];

/**
 * The optional reflection: ONE question about ONE card the user picked. A
 * question, never an answer or interpretation. Nothing typed is asked for or kept.
 */
export const reflectionQuestion: Record<Stance, string> = {
  gosto: 'O que exatamente nisso dá gosto?',
  habito: 'Se isso ficasse de lado por uma semana, o que você notaria?',
  esperam: 'Se dependesse só de você, isso continuaria igual, mudaria ou sairia da rotina?',
  'nao-sei': 'O que precisaria ser diferente para essa resposta ficar mais clara?',
};
