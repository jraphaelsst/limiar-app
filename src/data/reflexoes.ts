/**
 * Guided reflection — spec §4.7 "Quer pensar sobre alguma coisa?", wave 2 (plan §3, decisions.md
 * 2026-10-04): she picks one of the 8 themes and reads curated cards. NOTHING is typed, sent or
 * stored as text — no free-text field ships before the semantic classifier.
 *
 * Each card follows the §4.7 response shape: (1) a short acknowledgement of the theme that does not
 * amplify drama, (2) two concrete "lentes" (questions to think about, on paper or in her head);
 * the screen adds (3) at most two choices. §7.2 rules apply to this curated text too: no
 * diagnosis, no interpretation of family or the unconscious, no therapeutic-bond phrases, no forced
 * positivity, no "não é X, é Y", 80–130 words at most per card (title + body + lentes).
 *
 * Plural lives: not everyone has children, a partner, a job or money; nothing presumes loss.
 *
 * ref-0001…ref-0024 — drafts by Claude (2026-10-04), `rascunho` until Mônica approves them
 * (spec §22). Review sheet: docs/content/reflexoes-lote-1.md. Ids are stable and never reused:
 * a card leaves by `retirado`, not by deletion (a saved id must keep pointing at the same card).
 */
import type { ReviewStatus } from './activities';

export type ThemeId =
  | 'filhos-adultos'
  | 'relacionamento'
  | 'rotina-e-tempo'
  | 'trabalho-e-projetos'
  | 'amizades'
  | 'quem-sou-hoje'
  | 'planos-e-interesses'
  | 'outro-assunto';

export type Theme = { id: ThemeId; label: string };

/** Spec §4.7, in the spec's order and words. */
export const themes: readonly Theme[] = [
  { id: 'filhos-adultos', label: 'Filhos adultos' },
  { id: 'relacionamento', label: 'Relacionamento' },
  { id: 'rotina-e-tempo', label: 'Rotina e tempo' },
  { id: 'trabalho-e-projetos', label: 'Trabalho e projetos' },
  { id: 'amizades', label: 'Amizades' },
  { id: 'quem-sou-hoje', label: 'Quem sou hoje' },
  { id: 'planos-e-interesses', label: 'Planos e interesses' },
  { id: 'outro-assunto', label: 'Outro assunto dentro da proposta do app' },
];

export type Reflection = {
  reflectionId: string; // stable, never reused
  theme: ThemeId;
  title: string;
  /** The acknowledgement — reconhece o tema sem amplificar drama. */
  body: string;
  /** The "lentes" (spec §4.7: uma ou duas) — questions to think about, never answered in the app. */
  lentes: readonly string[];
  sourceNote: string;
  reviewStatus: ReviewStatus;
  reviewedBy: string | null;
  version: number;
};

const lote1 = (r: Omit<Reflection, 'sourceNote' | 'reviewStatus' | 'reviewedBy' | 'version'>): Reflection => ({
  ...r,
  sourceNote: 'Rascunho de Claude (2026-10-04) para revisão da Mônica',
  reviewStatus: 'rascunho',
  reviewedBy: null,
  version: 1,
});

export const reflexoes: readonly Reflection[] = [
  // — Filhos adultos: the relationship as it is now; never an "empty nest".
  lote1({
    reflectionId: 'ref-0001',
    theme: 'filhos-adultos',
    title: 'Uma relação que muda de forma',
    body:
      'Quando os filhos viram adultos, a relação continua, com outro formato: menos rotina em comum, outras conversas, outros combinados. Para algumas mulheres isso traz alívio; para outras, estranhamento; muitas vezes, um pouco de cada. Dá para olhar para como está hoje sem pressa de dar nome.',
    lentes: [
      'O que mudou no jeito de vocês conversarem nos últimos anos? E o que continua igual?',
      'Que tipo de contato combina com você hoje: frequência, assunto, jeito?',
    ],
  }),
  lote1({
    reflectionId: 'ref-0002',
    theme: 'filhos-adultos',
    title: 'O que cabe a quem',
    body:
      'Com filhos adultos, muitas decisões passam a ser deles: onde morar, com quem, como usar o tempo e o dinheiro. Às vezes dá vontade de opinar; às vezes, de dar um passo para trás. Separar o que cabe a você do que cabe a eles costuma deixar as conversas mais leves.',
    lentes: [
      'Pense numa situação recente com um filho ou uma filha. Que parte dela estava nas suas mãos, e que parte não estava?',
      'Existe algum assunto em que você gostaria de opinar menos? E algum em que gostaria de ser mais ouvida?',
    ],
  }),
  lote1({
    reflectionId: 'ref-0003',
    theme: 'filhos-adultos',
    title: 'Ajudar do jeito que combina',
    body:
      'Filhos adultos às vezes pedem ajuda: com uma mudança, com as crianças da família, com uma decisão, com um favor de última hora. Ajudar pode ser um prazer e também pode ocupar mais espaço do que você gostaria. As duas coisas podem ser verdade na mesma semana.',
    lentes: [
      'Que tipo de ajuda você oferece com gosto? E qual oferece mais por hábito?',
      'Se pudesse ajustar uma coisa nesse equilíbrio, qual seria?',
    ],
  }),

  // — Relacionamento: with a partner, a new person, after a separation, or by choice without one.
  lote1({
    reflectionId: 'ref-0004',
    theme: 'relacionamento',
    title: 'Do jeito que está hoje',
    body:
      'Relacionamento pode querer dizer muita coisa: uma união longa, alguém que chegou há pouco, uma separação, a escolha de viver sem par. Cada situação tem seus dias bons e seus pontos de atrito. A ideia aqui é olhar para a sua, do jeito que está.',
    lentes: [
      'O que funciona bem hoje no seu jeito de viver os relacionamentos?',
      'O que você gostaria que fosse diferente, mesmo que seja um detalhe?',
    ],
  }),
  lote1({
    reflectionId: 'ref-0005',
    theme: 'relacionamento',
    title: 'Tempo junto, tempo só seu',
    body:
      'Quem divide a casa ou a vida com alguém negocia, quase sem perceber, quanto tempo passa junto e quanto passa sozinha. Quem vive sem par faz essa conta de outro jeito, com amigas, família ou consigo mesma. Esse equilíbrio costuma mudar de uma fase para outra.',
    lentes: [
      'Numa semana comum, quanto do seu tempo é compartilhado e quanto é só seu?',
      'Esse equilíbrio combina com você agora? O que mudaria nele, se pudesse?',
    ],
  }),
  lote1({
    reflectionId: 'ref-0006',
    theme: 'relacionamento',
    title: 'Um assunto para depois',
    body:
      'Em qualquer relação, alguns assuntos vão ficando para depois: um plano, um incômodo pequeno, uma vontade nova. Nem tudo pede uma conversa. Mas às vezes ajuda escolher um desses assuntos e pensar com calma em como gostaria de tocar nele.',
    lentes: [
      'Há algum assunto que você gostaria de conversar com alguém próximo? O que torna difícil começar?',
      'Qual poderia ser uma primeira frase, simples, para abrir esse assunto?',
    ],
  }),

  // — Rotina e tempo
  lote1({
    reflectionId: 'ref-0007',
    theme: 'rotina-e-tempo',
    title: 'Uma semana comum',
    body:
      'A rotina se mexe em várias fases: um trabalho que termina ou começa, alguém que sai ou chega em casa, um cuidado novo com outra pessoa. Às vezes sobra tempo, às vezes falta. Olhar para uma semana comum ajuda a ver o que está ali de fato.',
    lentes: [
      'Numa semana comum, que momentos são escolhidos por você e quais acontecem por obrigação?',
      'Que parte do dia você gostaria de mudar primeiro, mesmo que um pouco?',
    ],
  }),
  lote1({
    reflectionId: 'ref-0008',
    theme: 'rotina-e-tempo',
    title: 'A hora que combina com você',
    body:
      'Há fases em que o dia se organiza em volta de outras pessoas e fases em que há mais espaço para os próprios horários. Em qualquer uma delas, dá para notar que momentos do dia combinam mais com você e o que costuma acontecer neles.',
    lentes: [
      'Em que hora do dia você costuma ter mais disposição? E o que faz nela hoje?',
      'Se tivesse meia hora livre amanhã, o que gostaria de fazer com ela?',
    ],
  }),
  lote1({
    reflectionId: 'ref-0009',
    theme: 'rotina-e-tempo',
    title: 'O que pode sair da lista',
    body:
      'Algumas tarefas continuam na rotina por costume, mesmo quando já não fazem tanto sentido: um compromisso fixo, uma arrumação semanal, um cuidado que outra pessoa já poderia assumir. Rever a lista de vez em quando abre espaço para outras coisas.',
    lentes: [
      'Qual tarefa da sua semana você faz mais por costume do que por escolha?',
      'O que aconteceria se ela fosse feita de outro jeito, por outra pessoa ou com menos frequência?',
    ],
  }),

  // — Trabalho e projetos: employment, own business, housework, volunteering, retirement, restarting.
  lote1({
    reflectionId: 'ref-0010',
    theme: 'trabalho-e-projetos',
    title: 'O lugar do trabalho hoje',
    body:
      'Trabalho pode ser emprego, negócio próprio, trabalho de casa, voluntariado, uma aposentadoria recente ou a vontade de recomeçar. Nesta fase, o lugar que ele ocupa costuma se mexer: às vezes cresce, às vezes diminui, às vezes muda de forma.',
    lentes: [
      'Hoje, que espaço o trabalho, de qualquer tipo, ocupa na sua semana? Esse espaço combina com você?',
      'O que você gostaria de levar do que já fez para o que vem pela frente?',
    ],
  }),
  lote1({
    reflectionId: 'ref-0011',
    theme: 'trabalho-e-projetos',
    title: 'Um projeto pequeno',
    body:
      'Nem todo projeto tem chefe, prazo ou salário. Pode ser aprender uma coisa, organizar as fotos da família, cuidar de umas plantas, escrever, ensinar o que você sabe. Projetos pequenos costumam ser mais fáceis de começar e de manter.',
    lentes: [
      'Que projeto você já pensou em começar algumas vezes?',
      'Qual seria o menor passo possível para começar, algo que caberia em uma hora?',
    ],
  }),
  lote1({
    reflectionId: 'ref-0012',
    theme: 'trabalho-e-projetos',
    title: 'O que você sabe fazer',
    body:
      'Com os anos, cada pessoa junta um repertório de coisas que sabe fazer, muitas vezes sem dar nome a elas: resolver imprevistos, cozinhar para muita gente, negociar, ouvir, consertar, organizar. Esse repertório pode servir para outros caminhos também.',
    lentes: [
      'Pense em três coisas que você faz bem e que raramente aparecem num currículo.',
      'Em que lugar, trabalho ou projeto uma delas poderia ser útil ou dar prazer?',
    ],
  }),

  // — Amizades
  lote1({
    reflectionId: 'ref-0013',
    theme: 'amizades',
    title: 'Quem está por perto',
    body:
      'Amizades mudam com as fases: algumas ficam mais próximas, outras se afastam sem briga, outras começam tarde e ganham importância. É comum que as amizades de hoje sejam bem diferentes das de dez anos atrás.',
    lentes: [
      'Com quem você conversou com gosto no último mês?',
      'Há alguém de quem você gostaria de se aproximar, ou se reaproximar?',
    ],
  }),
  lote1({
    reflectionId: 'ref-0014',
    theme: 'amizades',
    title: 'Amizades novas',
    body:
      'Fazer amizades na vida adulta costuma pedir mais iniciativa do que na escola ou no começo da vida profissional: os encontros nem sempre acontecem sozinhos. Grupos, cursos, caminhadas e trabalhos voluntários são lugares comuns onde elas começam.',
    lentes: [
      'Em que lugares você costuma encontrar pessoas com interesses parecidos com os seus?',
      'Que atividade você faria com gosto sozinha e que também poderia juntar pessoas?',
    ],
  }),
  lote1({
    reflectionId: 'ref-0015',
    theme: 'amizades',
    title: 'O ritmo de cada amizade',
    body:
      'Cada amizade tem seu ritmo: há amigas de conversa longa, de mensagem curta, de encontro uma vez por ano, de atividade em comum. Nenhum desses jeitos vale mais que outro. Perceber o ritmo de cada uma pode tirar um pouco da cobrança dos dois lados.',
    lentes: [
      'Pense em duas ou três amizades. Que jeito de estar junto funciona com cada uma?',
      'Há alguma amizade em que você gostaria de mudar o ritmo, para mais ou para menos?',
    ],
  }),

  // — Quem sou hoje: tastes, roles, words — never an interpretation of who she "really" is.
  lote1({
    reflectionId: 'ref-0016',
    theme: 'quem-sou-hoje',
    title: 'Gostos de agora',
    body:
      'Gostos mudam com o tempo. Algumas coisas de que você gostava muito podem ter perdido a graça, e outras que nunca chamaram atenção podem começar a interessar. Notar essas mudanças é um jeito simples de conhecer a pessoa que você é hoje.',
    lentes: [
      'De que coisa você passou a gostar nos últimos anos e que antes não chamava sua atenção?',
      'E que coisa você ainda faz por hábito, mesmo sem tanto gosto?',
    ],
  }),
  lote1({
    reflectionId: 'ref-0017',
    theme: 'quem-sou-hoje',
    title: 'Os papéis do dia a dia',
    body:
      'Ao longo da vida, cada pessoa junta papéis: filha, tia, mãe, companheira, profissional, vizinha, amiga, a que organiza, a que resolve. Alguns continuam, outros mudam de tamanho, outros ficam para trás. Às vezes um papel novo aparece sem aviso.',
    lentes: [
      'Que papéis ocupam mais do seu tempo hoje? E quais você escolheria ocupar mais?',
      'Existe algum papel que você gostaria de experimentar, mesmo que por pouco tempo?',
    ],
  }),
  lote1({
    reflectionId: 'ref-0018',
    theme: 'quem-sou-hoje',
    title: 'Como você se apresentaria',
    body:
      'Quando alguém pergunta “o que você faz?”, a resposta costuma vir pronta: uma profissão, uma família, uma cidade. Essa resposta nem sempre conta o que mais importa para você hoje. Dá para experimentar outros jeitos de se apresentar, só para você.',
    lentes: [
      'Como você se apresentaria falando só do que gosta de fazer?',
      'Que três palavras descrevem bem esta fase da sua vida?',
    ],
  }),

  // — Planos e interesses: small, cheap versions first (not everyone has money or time to spare).
  lote1({
    reflectionId: 'ref-0019',
    theme: 'planos-e-interesses',
    title: 'Uma curiosidade antiga',
    body:
      'Muita gente guarda uma curiosidade antiga: um instrumento, uma língua, um lugar, um assunto que sempre quis entender. Às vezes ela fica guardada por falta de tempo, de dinheiro ou de companhia. Às vezes, só porque ainda não houve um começo.',
    lentes: [
      'Que curiosidade você carrega há muito tempo?',
      'Que versão bem pequena dela daria para experimentar este mês, de graça ou quase?',
    ],
  }),
  lote1({
    reflectionId: 'ref-0020',
    theme: 'planos-e-interesses',
    title: 'Planos de tamanhos diferentes',
    body:
      'Planos podem ser grandes, como uma mudança ou uma viagem longa, ou pequenos, como conhecer um bairro, voltar a uma aula, receber gente em casa. Os pequenos costumam caber melhor na semana, e muitas vezes abrem caminho para os grandes.',
    lentes: [
      'Pense em um plano grande e um plano pequeno para os próximos meses.',
      'O que o plano pequeno pede: tempo, companhia, dinheiro, informação?',
    ],
  }),
  lote1({
    reflectionId: 'ref-0021',
    theme: 'planos-e-interesses',
    title: 'Pistas de interesse',
    body:
      'Interesses às vezes aparecem em pistas pequenas: uma vitrine onde você para, um assunto que puxa conversa, um tipo de notícia que você sempre lê até o fim. Juntar essas pistas pode mostrar um interesse que ainda não tem nome.',
    lentes: [
      'Nos últimos dias, o que fez você parar para olhar, ler ou perguntar mais?',
      'O que essas coisas têm em comum?',
    ],
  }),

  // — Outro assunto dentro da proposta do app: everyday adult life; health, money and legal
  //   questions are pointed to people who know the subject (spec §7.2 rule 7).
  lote1({
    reflectionId: 'ref-0022',
    theme: 'outro-assunto',
    title: 'Dar nome ao assunto',
    body:
      'Às vezes o assunto não cabe em nenhum tema da lista: uma mudança de casa, um cuidado com alguém da família, uma decisão de compra, uma vontade de mexer em alguma coisa sem saber bem qual. Dizer o assunto em poucas palavras costuma ser um bom começo.',
    lentes: [
      'Em uma frase, que assunto você quer pensar hoje?',
      'Ele é mais sobre uma decisão a tomar, uma situação a entender ou uma vontade a explorar?',
    ],
  }),
  lote1({
    reflectionId: 'ref-0023',
    theme: 'outro-assunto',
    title: 'O que está nas suas mãos',
    body:
      'Em quase toda situação há uma parte que depende de você e outra que não depende. Separar as duas costuma deixar o assunto mais claro e mostrar por onde dá para começar, seja uma coisa pequena, seja uma decisão maior.',
    lentes: [
      'Pensando no seu assunto, o que depende de você?',
      'Qual seria um passo pequeno, possível nesta semana?',
    ],
  }),
  lote1({
    reflectionId: 'ref-0024',
    theme: 'outro-assunto',
    title: 'Com quem conversar',
    body:
      'Alguns assuntos ficam mais leves quando são conversados com alguém: uma amiga, uma pessoa da família, alguém que já passou por algo parecido. Outros pedem quem entende do tema, como uma advogada, um médico ou uma psicóloga.',
    lentes: [
      'Quem, na sua vida, costuma ouvir bem esse tipo de assunto?',
      'Esse assunto pede alguma informação de saúde, dinheiro ou direitos? Quem poderia dar essa informação?',
    ],
  }),
];

export function findTheme(id: string | undefined): Theme | undefined {
  return themes.find((t) => t.id === id);
}

export function findReflection(id: string): Reflection | undefined {
  return reflexoes.find((r) => r.reflectionId === id);
}

/** The cards of one theme, in id order — the order she reads them in. Retired cards are left out. */
export function reflectionsFor(theme: ThemeId): readonly Reflection[] {
  return reflexoes.filter((r) => r.theme === theme && r.reviewStatus !== 'retirado');
}

/** Words of a card as she reads it (title + body + lentes) — spec §4.7/§20: 80–130 at most. */
export function cardWordCount(r: Reflection): number {
  return [r.title, r.body, ...r.lentes].join(' ').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}
