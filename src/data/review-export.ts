/**
 * Review pack — every piece of content that waits on Mônica (spec §22: nothing is published by AI
 * alone), exported from the code itself so the review page can never show a stale copy.
 *
 * `npm run review:export` writes it to `tools/revisao/conteudo.json` (gitignored: it is derived, and
 * regenerated before every publish of the review page). The page (tools/revisao/index.html) shows
 * one card per item; her verdict is stored against the item's `hash`, so an item Claude changes after
 * her review shows up again as "mudou desde a sua revisão".
 *
 * Pure: no fs, no clock. Imported only by tests — never by app code, so it never enters the bundle.
 */
import { activities, formatDuration, type Activity } from './activities';
import { directionLabel, games, pairs, reflectionQuestion, roleCards, stances, themes as gameThemes } from './games';
import { reflexoes, themes as reflectionThemes } from './reflexoes';
import { worlds } from './worlds';
import {
  LINHAS,
  MENSAGEM_PARA_ALGUEM,
  TEXTO_RISCO,
  TEXTO_VIOLENCIA,
  TITULO_RISCO,
  TITULO_VIOLENCIA,
} from '../safety/recursos';

export type Campo = { rotulo: string; valor: string | readonly string[] };

export type ItemDeRevisao = {
  /** Stable: the content id where there is one (act-0001, ref-0001), else `<grupo>:<id>`. */
  id: string;
  titulo: string;
  /** One line of context under the title. */
  linha: string;
  /** Where the text came from (spec seed, Claude's draft, spec verbatim). */
  origem: string;
  campos: readonly Campo[];
  /** FNV-1a of what she reads — a verdict given to another hash is shown as outdated. */
  hash: string;
};

export type GrupoDeRevisao = { id: string; titulo: string; nota: string; itens: readonly ItemDeRevisao[] };

export type PacoteDeRevisao = { formato: 'limiar.revisao/v1'; grupos: readonly GrupoDeRevisao[] };

/** FNV-1a 32-bit, hex. Enough to notice a change; not a security boundary. */
export function hashTexto(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

function item(id: string, titulo: string, linha: string, origem: string, campos: readonly Campo[]): ItemDeRevisao {
  return { id, titulo, linha, origem, campos, hash: hashTexto(JSON.stringify([titulo, linha, campos])) };
}

const CATEGORIA: Record<Activity['category'], string> = {
  criar: 'Criar',
  aprender: 'Aprender',
  sair: 'Sair',
  conectar: 'Conectar',
  organizar: 'Organizar',
  explorar: 'Explorar',
  refletir: 'Refletir',
};
const ENERGIA: Record<Activity['energy'], string> = { baixa: 'energia baixa', normal: 'energia normal', alta: 'energia alta' };
const AMBIENTE: Record<Activity['environment'], string> = { casa: 'em casa', fora: 'fora de casa', ambos: 'em casa ou fora' };
const COMPANHIA: Record<Activity['socialMode'], string> = { solo: 'sozinha', companhia: 'com alguém', ambos: 'sozinha ou com alguém' };
const CUSTO: Record<Activity['budget'], string> = { zero: 'sem custo', baixo: 'custo baixo', medio: 'custo médio' };
const MOBILIDADE: Record<Activity['mobility'], string> = { sentada: 'sentada', leve: 'movimento leve', moderada: 'movimento moderado' };

const tituloDoMundo = (id: string) => worlds.find((w) => w.id === id)?.title ?? id;

function atividade(a: Activity): ItemDeRevisao {
  const campos: Campo[] = [
    { rotulo: 'Resumo', valor: a.summary },
    { rotulo: 'Passos', valor: a.steps },
  ];
  if (a.materials.length > 0) campos.push({ rotulo: 'Materiais', valor: a.materials });
  if (a.variation) campos.push({ rotulo: 'Variação', valor: a.variation });
  campos.push({
    rotulo: 'Classificação',
    valor: [ENERGIA[a.energy], AMBIENTE[a.environment], COMPANHIA[a.socialMode], CUSTO[a.budget], MOBILIDADE[a.mobility]].join(' · '),
  });
  campos.push({ rotulo: 'Mundos', valor: a.worlds.map(tituloDoMundo) });
  return item(a.activityId, a.title, `${CATEGORIA[a.category]} · ${formatDuration(a.durationMin)}`, a.sourceNote, campos);
}

const temaDaReflexao = (id: string) => reflectionThemes.find((t) => t.id === id)?.label ?? id;

export function pacoteDeRevisao(): PacoteDeRevisao {
  const atividades: GrupoDeRevisao = {
    id: 'atividades',
    titulo: 'Atividades',
    nota: 'As 15 primeiras vêm da especificação (§5.1); as outras são rascunhos de Claude, em três lotes.',
    itens: activities.filter((a) => a.reviewStatus !== 'retirado').map(atividade),
  };

  const reflexoesGrupo: GrupoDeRevisao = {
    id: 'reflexoes',
    titulo: 'Reflexões guiadas',
    nota: 'Cartões de "Quer pensar sobre alguma coisa?": ela escolhe um tema e lê; nada é digitado.',
    itens: reflexoes
      .filter((r) => r.reviewStatus !== 'retirado')
      .map((r) =>
        item(r.reflectionId, r.title, `Tema: ${temaDaReflexao(r.theme)}`, r.sourceNote, [
          { rotulo: 'Texto', valor: r.body },
          { rotulo: 'Lentes (perguntas para pensar)', valor: r.lentes },
        ]),
      ),
  };

  const [jogoA, jogoB] = games;
  const origemJogos = 'Rascunho de Claude a partir dos exemplos da especificação (§4.5)';
  const jogos: GrupoDeRevisao = {
    id: 'jogos',
    titulo: 'Jogos',
    nota: 'Jogo A: rodadas de escolha entre duas coisas. Jogo B: cartões de hábitos e papéis para olhar com calma.',
    itens: [
      ...games.map((g) => item(`jogo:${g.id}`, g.title, 'Como o jogo se apresenta', origemJogos, [{ rotulo: 'Descrição', valor: g.description }])),
      ...pairs.map((p) =>
        item(`par:${p.id}`, p.options.map((o) => o.label).join(' ou '), `${jogoA.title} · par de escolha`, origemJogos, [
          { rotulo: 'Opções', valor: p.options.map((o) => (o.theme ? `${o.label} (tema: ${gameThemes[o.theme].word})` : o.label)) },
        ]),
      ),
      item('jogo:temas', 'Palavras dos temas', `${jogoA.title} · resultado`, origemJogos, [
        { rotulo: 'Como cada tema aparece no resultado', valor: Object.values(gameThemes).map((t) => t.word) },
        { rotulo: 'Botões ao fim do jogo', valor: Object.values(directionLabel) },
      ]),
      item('jogo:posturas', 'Respostas possíveis', `${jogoB.title} · para cada cartão`, 'Especificação §4.5, literal', [
        { rotulo: 'Opções', valor: stances.map((s) => s.label) },
      ]),
      ...roleCards.map((c) => item(`cartao:${c.id}`, c.text, `${jogoB.title} · cartão`, origemJogos, [{ rotulo: 'Cartão', valor: c.text }])),
      item('jogo:perguntas', 'Pergunta depois do cartão', `${jogoB.title} · uma pergunta, nunca uma resposta`, origemJogos, [
        { rotulo: 'Pergunta para cada resposta', valor: stances.map((s) => `${s.label}: ${reflectionQuestion[s.id]}`) },
      ]),
    ],
  };

  const origemSpec = 'Especificação §8.1, literal (texto aprovado)';
  const seguranca: GrupoDeRevisao = {
    id: 'seguranca',
    titulo: 'Segurança',
    nota: 'O que aparece quando há sinal de risco, e na tela de ajuda. Revisão periódica pedida pela especificação (§22).',
    itens: [
      item('seguranca:risco', TITULO_RISCO, 'Tela de risco alto', origemSpec, [{ rotulo: 'Texto', valor: TEXTO_RISCO }]),
      item('seguranca:violencia', TITULO_VIOLENCIA, 'Bloco de violência', 'Escrito por Claude a partir da especificação §8 (tabela, VIOLÊNCIA)', [
        { rotulo: 'Texto', valor: TEXTO_VIOLENCIA },
      ]),
      item('seguranca:linhas', 'Telefones de ajuda', 'Tela de risco e tela de ajuda', 'Linhas oficiais (especificação §8.1)', [
        { rotulo: 'Linhas', valor: Object.values(LINHAS).map((l) => `${l.numero} · ${l.nome} · ${l.uso}`) },
      ]),
      item('seguranca:mensagem', 'Mensagem para alguém de confiança', 'Botão "Avisar alguém de confiança"', 'Escrito por Claude (decisões, 2026-10-04)', [
        { rotulo: 'Mensagem enviada', valor: MENSAGEM_PARA_ALGUEM },
      ]),
    ],
  };

  return { formato: 'limiar.revisao/v1', grupos: [atividades, reflexoesGrupo, jogos, seguranca] };
}
