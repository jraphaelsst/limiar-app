/**
 * Activity catalog — spec §5 schema. Every item is `rascunho` until Mônica approves it
 * (spec §22 — nothing is published by AI alone; decisions.md 2026-10-04 `nnl-f1-editorial`).
 *
 * act-0001…act-0015 — `seed(...)`: the 15 seeds of spec §5.1. Titles, summaries, time and
 * materials come from the spec; steps and the one variation (act-0003) were written to be
 * faithful to each summary. The other 14 seeds have no `variation` ON PURPOSE: variations
 * of the seeds are Mônica's content and are pending her, first for the ones that involve
 * going out, walking or the kitchen (act-0007, act-0009, act-0012, act-0015).
 *
 * act-0016…act-0030 — `draft(...)`: batch 1 written whole by Claude (2026-10-04), with João's
 * approval to draft in batches of 15 for Mônica's review. They fill the gaps of the seeds
 * (organizar / conectar / explorar / refletir, "companhia", energy "alta", mobility
 * "moderada", ≤10-min items, the "filhos adultos" and "nós dois" worlds). As drafts, their
 * variations are written too, and are as provisional as the rest. Review sheet with the
 * world and the gap of each one: docs/content/atividades-lote-1.md.
 *
 * Ids are stable and never reused: an activity leaves the catalog by `retirado`, not by deletion.
 */

export type Category = 'criar' | 'aprender' | 'sair' | 'conectar' | 'organizar' | 'explorar' | 'refletir';
export type Energy = 'baixa' | 'normal' | 'alta';
export type Environment = 'casa' | 'fora' | 'ambos';
export type SocialMode = 'solo' | 'companhia' | 'ambos';
export type Budget = 'zero' | 'baixo' | 'medio';
export type Mobility = 'sentada' | 'leve' | 'moderada';
export type ReviewStatus = 'rascunho' | 'revisado' | 'publicado' | 'retirado';

export type Activity = {
  activityId: string; // stable, never reused
  title: string;
  summary: string;
  category: Category;
  durationMin: readonly [min: number, max: number];
  energy: Energy;
  environment: Environment;
  socialMode: SocialMode;
  budget: Budget;
  mobility: Mobility;
  materials: readonly string[];
  steps: readonly string[];
  /** Spec §4.4 — optional; see the header for who writes it. */
  variation?: string;
  safetyTags: readonly string[];
  sourceNote: string;
  reviewStatus: ReviewStatus;
  reviewedBy: string | null;
  version: number;
};

const seed = (a: Omit<Activity, 'sourceNote' | 'reviewStatus' | 'reviewedBy' | 'version'>): Activity => ({
  ...a,
  sourceNote: 'Semente da especificação mestre v1.0 §5.1',
  reviewStatus: 'rascunho',
  reviewedBy: null,
  version: 1,
});

/** Batch drafts by Claude — same review state as the seeds, different provenance. */
const draft =
  (batch: number, date: string) =>
  (a: Omit<Activity, 'sourceNote' | 'reviewStatus' | 'reviewedBy' | 'version'>): Activity => ({
    ...a,
    sourceNote: `Rascunho de Claude (lote ${batch}, ${date}) para revisão da Mônica`,
    reviewStatus: 'rascunho',
    reviewedBy: null,
    version: 1,
  });

const lote1 = draft(1, '2026-10-04');

export const activities: readonly Activity[] = [
  seed({
    activityId: 'act-0001',
    title: 'Mapa da casa da infância',
    summary: 'Desenhar a planta e marcar três lugares que guardam lembranças boas ou curiosas.',
    category: 'criar',
    durationMin: [10, 15],
    energy: 'baixa',
    environment: 'casa',
    socialMode: 'solo',
    budget: 'zero',
    mobility: 'sentada',
    materials: ['Papel', 'Caneta'],
    steps: [
      'Desenhe a planta da casa onde passou a infância, sem se preocupar com proporções.',
      'Marque três lugares que guardam lembranças boas ou curiosas.',
      'Se quiser, dê um nome curto para cada lugar.',
    ],
    safetyTags: [],
  }),
  seed({
    activityId: 'act-0002',
    title: 'Música de outra década',
    summary: 'Escolher uma música marcante de uma época e ouvir inteira, sem fazer outra coisa.',
    category: 'explorar',
    durationMin: [5, 10],
    energy: 'baixa',
    environment: 'ambos',
    socialMode: 'solo',
    budget: 'zero',
    mobility: 'sentada',
    materials: ['Celular'],
    steps: [
      'Escolha uma época da sua vida.',
      'Lembre de uma música que marcou essa época.',
      'Ouça a música inteira, sem fazer outra coisa ao mesmo tempo.',
    ],
    safetyTags: [],
  }),
  seed({
    activityId: 'act-0003',
    title: 'Uma rua nova',
    summary: 'Escolher uma rua ou praça pouco conhecida e caminhar ou observar, respeitando mobilidade e segurança.',
    category: 'sair',
    durationMin: [30, 60],
    energy: 'normal',
    environment: 'fora',
    socialMode: 'ambos',
    budget: 'zero',
    mobility: 'leve',
    materials: ['Sair de casa'],
    steps: [
      'Escolha uma rua ou praça pouco conhecida perto de você.',
      'Vá até lá no seu ritmo.',
      'Caminhe ou sente e observe fachadas, árvores, pessoas e sons.',
    ],
    variation: 'Com pouca energia ou mobilidade reduzida: escolha um banco numa praça e observe dali.',
    safetyTags: ['caminhada', 'deslocamento'],
  }),
  seed({
    activityId: 'act-0004',
    title: 'O curso que sempre ficou para depois',
    summary: 'Pesquisar três opções concretas de curso, sem compromisso de matrícula.',
    category: 'aprender',
    durationMin: [10, 10],
    energy: 'baixa',
    environment: 'casa',
    socialMode: 'solo',
    budget: 'zero',
    mobility: 'sentada',
    materials: ['Internet'],
    steps: [
      'Pense num assunto que sempre quis estudar.',
      'Pesquise três opções concretas de curso.',
      'Anote nome, formato e preço de cada uma, sem compromisso de matrícula.',
    ],
    safetyTags: [],
  }),
  seed({
    activityId: 'act-0005',
    title: 'Mini exposição em casa',
    summary: 'Escolher cinco objetos e montar uma pequena composição; fotografar se quiser.',
    category: 'criar',
    durationMin: [20, 20],
    energy: 'normal',
    environment: 'casa',
    socialMode: 'solo',
    budget: 'zero',
    mobility: 'leve',
    materials: ['Objetos da casa'],
    steps: [
      'Escolha cinco objetos da casa.',
      'Monte uma pequena composição numa mesa ou prateleira.',
      'Fotografe, se quiser, e dê um título à exposição.',
    ],
    safetyTags: [],
  }),
  seed({
    activityId: 'act-0006',
    title: 'Telefonema sem pauta',
    summary: 'Ligar para alguém com quem é gostoso conversar, sem transformar a ligação em tarefa.',
    category: 'conectar',
    durationMin: [10, 20],
    energy: 'baixa',
    environment: 'ambos',
    socialMode: 'companhia',
    budget: 'zero',
    mobility: 'sentada',
    materials: ['Uma pessoa', 'Telefone'],
    steps: [
      'Pense em alguém com quem é gostoso conversar.',
      'Ligue sem um assunto definido.',
      'Deixe a conversa ir para onde for.',
    ],
    safetyTags: [],
  }),
  seed({
    activityId: 'act-0007',
    title: 'Receita de um lugar',
    summary: 'Escolher um país ou cidade e preparar algo simples ligado a ele.',
    category: 'criar',
    durationMin: [30, 60],
    energy: 'normal',
    environment: 'casa',
    socialMode: 'ambos',
    budget: 'baixo',
    mobility: 'leve',
    materials: ['Cozinha', 'Ingredientes simples'],
    steps: [
      'Escolha um país ou uma cidade.',
      'Procure uma receita simples ligada a esse lugar.',
      'Prepare e prove com calma.',
    ],
    safetyTags: ['cozinha'],
  }),
  seed({
    activityId: 'act-0008',
    title: 'Lista das coisas que sei fazer',
    summary: 'Anotar dez habilidades que não dependem do papel de mãe.',
    category: 'refletir',
    durationMin: [10, 10],
    energy: 'baixa',
    environment: 'casa',
    socialMode: 'solo',
    budget: 'zero',
    mobility: 'sentada',
    materials: ['Papel', 'Caneta'],
    steps: [
      'Pegue papel e caneta.',
      'Anote dez habilidades que não dependem do papel de mãe.',
      'Vale incluir as pequenas.',
    ],
    safetyTags: [],
  }),
  seed({
    activityId: 'act-0009',
    title: 'Turista no próprio bairro',
    summary: 'Escolher um lugar local nunca visitado.',
    category: 'sair',
    durationMin: [30, 90],
    energy: 'normal',
    environment: 'fora',
    socialMode: 'ambos',
    budget: 'baixo',
    mobility: 'leve',
    materials: ['Sair de casa'],
    steps: [
      'Escolha um lugar do bairro onde nunca entrou: café, biblioteca, loja, igreja, praça.',
      'Vá com calma, como quem visita.',
      'Repare em uma coisa que não esperava encontrar.',
    ],
    safetyTags: ['deslocamento'],
  }),
  seed({
    activityId: 'act-0010',
    title: 'Foto de cinco detalhes',
    summary: 'Fotografar cinco detalhes bonitos ou curiosos do cotidiano.',
    category: 'criar',
    durationMin: [15, 15],
    energy: 'baixa',
    environment: 'ambos',
    socialMode: 'solo',
    budget: 'zero',
    mobility: 'leve',
    materials: ['Celular'],
    steps: [
      'Pegue o celular.',
      'Fotografe cinco detalhes bonitos ou curiosos do cotidiano.',
      'Escolha a foto favorita.',
    ],
    safetyTags: [],
  }),
  seed({
    activityId: 'act-0011',
    title: 'Uma habilidade em 20 minutos',
    summary: 'Experimentar uma microaula: origami, desenho, idioma, história da arte ou fotografia.',
    category: 'aprender',
    durationMin: [20, 20],
    energy: 'normal',
    environment: 'casa',
    socialMode: 'solo',
    budget: 'zero',
    mobility: 'sentada',
    materials: ['Internet', 'Papel'],
    steps: [
      'Escolha um tema: origami, desenho, idioma, história da arte ou fotografia.',
      'Encontre uma microaula de até 20 minutos.',
      'Experimente, sem se cobrar resultado.',
    ],
    safetyTags: [],
  }),
  seed({
    activityId: 'act-0012',
    title: 'Mesa para dois ou um',
    summary: 'Preparar uma refeição simples com um detalhe diferente, sem esperar ocasião especial.',
    category: 'criar',
    durationMin: [20, 40],
    energy: 'normal',
    environment: 'casa',
    socialMode: 'ambos',
    budget: 'baixo',
    mobility: 'leve',
    materials: ['Cozinha'],
    steps: [
      'Prepare uma refeição simples.',
      'Acrescente um detalhe diferente: uma toalha, uma flor, uma música.',
      'Sente e aproveite, sem esperar ocasião especial.',
    ],
    safetyTags: ['cozinha'],
  }),
  seed({
    activityId: 'act-0013',
    title: "Pasta 'quero conhecer'",
    summary: 'Criar uma lista de lugares, livros, filmes ou cursos que despertam curiosidade.',
    category: 'organizar',
    durationMin: [10, 10],
    energy: 'baixa',
    environment: 'ambos',
    socialMode: 'solo',
    budget: 'zero',
    mobility: 'sentada',
    materials: ['Celular'],
    steps: [
      'Crie uma nota no celular chamada “quero conhecer”.',
      'Anote lugares, livros, filmes ou cursos que despertam curiosidade.',
      'Volte a ela quando surgir tempo livre.',
    ],
    safetyTags: [],
  }),
  seed({
    activityId: 'act-0014',
    title: 'Cartão para o futuro',
    summary: 'Escrever uma nota curta para abrir daqui a seis meses com algo que gostaria de ter experimentado.',
    category: 'refletir',
    durationMin: [10, 10],
    energy: 'baixa',
    environment: 'casa',
    socialMode: 'solo',
    budget: 'zero',
    mobility: 'sentada',
    materials: ['Papel', 'Caneta'],
    steps: [
      'Pegue um papel.',
      'Escreva uma nota curta com algo que gostaria de ter experimentado daqui a seis meses.',
      'Guarde a nota e marque na agenda a data para abrir.',
    ],
    safetyTags: [],
  }),
  seed({
    activityId: 'act-0015',
    title: 'Troca de rota',
    summary: 'Fazer um caminho diferente para uma tarefa cotidiana e observar o que aparece.',
    category: 'sair',
    durationMin: [15, 30],
    energy: 'normal',
    environment: 'fora',
    socialMode: 'solo',
    budget: 'zero',
    mobility: 'leve',
    materials: ['Uma saída do dia'],
    steps: [
      'Escolha uma tarefa do dia que exige sair.',
      'Faça um caminho diferente do habitual.',
      'Repare no que aparece pelo caminho.',
    ],
    safetyTags: ['deslocamento'],
  }),
  lote1({
    activityId: 'act-0016',
    title: 'Uma gaveta por vez',
    summary: 'Esvaziar uma única gaveta, decidir o que volta para ela e parar por ali.',
    category: 'organizar',
    durationMin: [10, 15],
    energy: 'normal',
    environment: 'casa',
    socialMode: 'solo',
    budget: 'zero',
    mobility: 'leve',
    materials: ['Uma gaveta', 'Uma mesa'],
    steps: [
      'Escolha uma gaveta pequena, dessas que juntam coisas soltas.',
      'Tire tudo e espalhe sobre uma mesa.',
      'Separe em três montes: volta para a gaveta, vai para outro lugar, sai de casa.',
      'Guarde o que fica. A gaveta de hoje é só essa.',
    ],
    variation:
      'Com pouca energia ou mobilidade reduzida: troque a gaveta por uma caixa, bolsa ou nécessaire que já esteja ao alcance e faça sentada.',
    safetyTags: [],
  }),
  lote1({
    activityId: 'act-0017',
    title: 'A semana numa folha',
    summary: 'Desenhar a semana numa folha e reservar nela um espaço para algo escolhido por você.',
    category: 'organizar',
    durationMin: [10, 10],
    energy: 'baixa',
    environment: 'casa',
    socialMode: 'solo',
    budget: 'zero',
    mobility: 'sentada',
    materials: ['Papel', 'Caneta'],
    steps: [
      'Divida uma folha em sete colunas, uma para cada dia.',
      'Anote o que já está marcado: compromissos, horários, tarefas fixas.',
      'Procure um espaço livre e escreva nele uma coisa que gostaria de fazer.',
      'Deixe a folha num lugar onde você a veja durante a semana.',
    ],
    safetyTags: [],
  }),
  lote1({
    activityId: 'act-0018',
    title: 'Um canto para o que é seu',
    summary: 'Liberar um pequeno espaço da casa para algo seu: um livro em andamento, um bordado, uma planta.',
    category: 'organizar',
    durationMin: [20, 30],
    energy: 'normal',
    environment: 'casa',
    socialMode: 'solo',
    budget: 'zero',
    mobility: 'leve',
    materials: ['Um canto da casa'],
    steps: [
      'Escolha um canto pequeno: uma ponta de mesa, uma prateleira, o lado de uma poltrona.',
      'Tire o que não precisa ficar ali.',
      'Coloque uma coisa sua que queira ter à mão: um livro, um caderno, um bordado, uma planta.',
      'Se mora com outras pessoas, combine que aquele canto fica assim.',
    ],
    variation:
      'Com pouca energia ou mobilidade reduzida: use o espaço que já está ao alcance de onde você costuma sentar, como a mesinha ao lado da poltrona.',
    safetyTags: [],
  }),
  lote1({
    activityId: 'act-0019',
    title: 'Rabisco de um minuto',
    summary: 'Rabiscar por um minuto sem tentar fazer algo bonito e depois dar um título ao resultado.',
    category: 'criar',
    durationMin: [5, 5],
    energy: 'baixa',
    environment: 'ambos',
    socialMode: 'solo',
    budget: 'zero',
    mobility: 'sentada',
    materials: ['Papel', 'Caneta', 'Relógio ou celular'],
    steps: [
      'Pegue papel e caneta e marque um minuto no relógio ou no celular.',
      'Rabisque sem parar e sem tentar fazer algo bonito.',
      'Quando o tempo acabar, gire a folha e olhe o rabisco de vários lados.',
      'Dê um título a ele.',
    ],
    safetyTags: [],
  }),
  lote1({
    activityId: 'act-0020',
    title: 'Paleta de cinco cores',
    summary: 'Escolher cinco cores para a fase atual e dar a cada uma o nome de uma coisa do dia a dia.',
    category: 'refletir',
    durationMin: [10, 15],
    energy: 'baixa',
    environment: 'casa',
    socialMode: 'solo',
    budget: 'zero',
    mobility: 'sentada',
    materials: ['Papel', 'Lápis de cor, canetinhas ou o que tiver em casa'],
    steps: [
      'Pense na sua vida de agora, do jeito que ela está.',
      'Escolha cinco cores que combinam com ela.',
      'Pinte um quadradinho de cada cor numa folha.',
      'Ao lado de cada cor, escreva uma palavra do dia a dia: café, varanda, domingo, estrada.',
    ],
    variation: 'Sem lápis de cor: junte cinco objetos coloridos da casa sobre a mesa e anote uma palavra para cada um.',
    safetyTags: [],
  }),
  lote1({
    activityId: 'act-0021',
    title: 'Mudei de ideia',
    summary: 'Anotar três coisas sobre as quais você mudou de ideia nos últimos anos e o que pensa delas hoje.',
    category: 'refletir',
    durationMin: [10, 10],
    energy: 'baixa',
    environment: 'ambos',
    socialMode: 'solo',
    budget: 'zero',
    mobility: 'sentada',
    materials: ['Papel e caneta ou celular'],
    steps: [
      'Pegue papel e caneta ou abra uma nota no celular.',
      'Anote três coisas sobre as quais mudou de ideia nos últimos anos: uma comida, um lugar, um costume, um jeito de passar o domingo.',
      'Ao lado de cada uma, escreva em uma frase o que pensa hoje.',
    ],
    safetyTags: [],
  }),
  lote1({
    activityId: 'act-0022',
    title: 'Museu pela tela',
    summary: 'Visitar o acervo on-line de um museu que gostaria de conhecer e escolher uma obra.',
    category: 'explorar',
    durationMin: [15, 30],
    energy: 'baixa',
    environment: 'casa',
    socialMode: 'solo',
    budget: 'zero',
    mobility: 'sentada',
    materials: ['Internet', 'Celular, tablet ou computador'],
    steps: [
      'Escolha um museu que gostaria de conhecer, no Brasil ou fora.',
      'Procure na internet o acervo on-line ou a visita virtual dele.',
      'Passeie sem roteiro, no seu ritmo.',
      'Escolha uma obra e anote o nome dela e de quem fez.',
    ],
    safetyTags: [],
  }),
  lote1({
    activityId: 'act-0023',
    title: 'Feira sem lista',
    summary: 'Percorrer uma feira ou um mercado sem lista de compras, reparando no que não conhece.',
    category: 'explorar',
    durationMin: [45, 90],
    energy: 'alta',
    environment: 'fora',
    socialMode: 'ambos',
    budget: 'baixo',
    mobility: 'moderada',
    materials: ['Sair de casa', 'Uma sacola'],
    steps: [
      'Escolha uma feira livre ou um mercado municipal que ainda não conhece ou que não visita há tempo.',
      'Percorra as bancas sem lista de compras.',
      'Pergunte a quem vende o nome de uma fruta, um tempero ou um peixe que não conhece.',
      'Se quiser, leve uma coisa pequena para provar em casa.',
    ],
    variation:
      'Com pouca energia ou mobilidade reduzida: vá num horário com menos movimento, escolha um trecho curto ou uma banca só e pare onde houver lugar para sentar.',
    safetyTags: ['caminhada', 'deslocamento'],
  }),
  lote1({
    activityId: 'act-0024',
    title: 'Rádio de outra cidade',
    summary: 'Ouvir por alguns minutos uma rádio ao vivo de uma cidade de outro país.',
    category: 'explorar',
    durationMin: [5, 10],
    energy: 'baixa',
    environment: 'ambos',
    socialMode: 'solo',
    budget: 'zero',
    mobility: 'sentada',
    materials: ['Celular', 'Internet'],
    steps: [
      'Escolha uma cidade de outro país que nunca visitou.',
      'Procure na internet uma rádio ao vivo de lá.',
      'Ouça alguns minutos do que estiver passando: música, notícia, conversa.',
      'Anote o nome da cidade e uma coisa que chamou sua atenção.',
    ],
    safetyTags: [],
  }),
  lote1({
    activityId: 'act-0025',
    title: 'O que você anda ouvindo?',
    summary: 'Pedir a alguém mais jovem uma música, série ou livro de que anda gostando e conhecer a indicação.',
    category: 'conectar',
    durationMin: [15, 30],
    energy: 'baixa',
    environment: 'ambos',
    socialMode: 'companhia',
    budget: 'zero',
    mobility: 'sentada',
    materials: ['Uma pessoa', 'Celular'],
    steps: [
      'Escolha alguém mais jovem com quem tem contato: filho, filha, sobrinha, afilhado, uma colega.',
      'Pergunte, por mensagem ou pessoalmente, o que essa pessoa anda ouvindo, vendo ou lendo.',
      'Experimente um pedaço da indicação.',
      'Se quiser, conte depois uma coisa de que gostou ou que chamou sua atenção.',
    ],
    safetyTags: [],
  }),
  lote1({
    activityId: 'act-0026',
    title: 'Me ensina uma coisa?',
    summary: 'Pedir a alguém que sabe fazer algo que você não sabe uma aula curta, de até meia hora.',
    category: 'aprender',
    durationMin: [20, 40],
    energy: 'normal',
    environment: 'ambos',
    socialMode: 'companhia',
    budget: 'zero',
    mobility: 'sentada',
    materials: ['Uma pessoa'],
    steps: [
      'Pense em alguém que sabe uma coisa que você não sabe: filho ou filha, amiga, vizinha, alguém do trabalho.',
      'Peça uma aula curta, de até meia hora: um recurso do celular, um ponto de crochê, um atalho no computador.',
      'Faça junto com a pessoa, lado a lado ou por chamada de vídeo.',
      'Anote o passo que quiser lembrar.',
    ],
    safetyTags: [],
  }),
  lote1({
    activityId: 'act-0027',
    title: 'Sorteio de programas',
    summary: 'Escrever ideias de programas em papeizinhos, sortear um e marcar o dia.',
    category: 'conectar',
    durationMin: [10, 15],
    energy: 'baixa',
    environment: 'casa',
    socialMode: 'companhia',
    budget: 'zero',
    mobility: 'sentada',
    materials: ['Papel', 'Caneta', 'Uma pessoa'],
    steps: [
      'Chame uma pessoa para fazer junto: parceiro ou parceira, amiga, irmã.',
      'Cada pessoa escreve três programas em papeizinhos, simples ou fora do habitual.',
      'Dobre os papéis, misture e sorteie um.',
      'Marquem um dia para fazer.',
    ],
    variation: 'Sozinha: escreva seis programas, sorteie um e marque o dia na agenda.',
    safetyTags: [],
  }),
  lote1({
    activityId: 'act-0028',
    title: 'Convite para um café',
    summary: 'Mandar um convite simples para alguém que você gostaria de conhecer melhor.',
    category: 'conectar',
    durationMin: [5, 10],
    energy: 'baixa',
    environment: 'ambos',
    socialMode: 'companhia',
    budget: 'zero',
    mobility: 'sentada',
    materials: ['Celular'],
    steps: [
      'Pense em alguém que gostaria de conhecer melhor: uma vizinha, uma colega, alguém de um grupo que frequenta.',
      'Escreva uma mensagem curta com um convite simples: um café, uma volta na praça, uma visita.',
      'Sugira um ou dois dias possíveis.',
      'Envie e deixe a resposta chegar no tempo da outra pessoa.',
    ],
    safetyTags: [],
  }),
  lote1({
    activityId: 'act-0029',
    title: 'Carteirinha da biblioteca',
    summary: 'Ir à biblioteca pública mais perto, fazer o cadastro e sair com um livro.',
    category: 'sair',
    durationMin: [30, 60],
    energy: 'normal',
    environment: 'fora',
    socialMode: 'solo',
    budget: 'zero',
    mobility: 'leve',
    materials: ['Sair de casa', 'Documento com foto'],
    steps: [
      'Procure a biblioteca pública mais perto de você: municipal, estadual ou de um centro cultural.',
      'Confira o horário e os documentos pedidos para o cadastro.',
      'Vá até lá e faça a carteirinha.',
      'Antes de sair, passeie pelas estantes e escolha um livro.',
    ],
    variation:
      'Com pouca energia ou mobilidade reduzida: veja se a biblioteca da sua cidade empresta livros digitais e faça o cadastro pela internet.',
    safetyTags: ['deslocamento'],
  }),
  lote1({
    activityId: 'act-0030',
    title: 'Como isso funciona?',
    summary: 'Escolher um objeto do dia a dia e descobrir como ele funciona.',
    category: 'aprender',
    durationMin: [10, 15],
    energy: 'baixa',
    environment: 'casa',
    socialMode: 'solo',
    budget: 'zero',
    mobility: 'sentada',
    materials: ['Internet'],
    steps: [
      'Escolha um objeto que você usa sem saber explicar como funciona: zíper, geladeira, controle remoto, código de barras.',
      'Procure uma explicação curta, em texto ou vídeo.',
      'Explique com suas palavras, em voz alta ou numa anotação.',
    ],
    safetyTags: [],
  }),
];

export const categoryLabel: Record<Category, string> = {
  criar: 'Criar',
  aprender: 'Aprender',
  sair: 'Sair',
  conectar: 'Conectar',
  organizar: 'Organizar',
  explorar: 'Explorar',
  refletir: 'Refletir',
};

export const energyLabel: Record<Energy, string> = { baixa: 'Energia baixa', normal: 'Energia normal', alta: 'Energia alta' };
export const environmentLabel: Record<Environment, string> = { casa: 'Em casa', fora: 'Fora de casa', ambos: 'Em casa ou fora' };

export function formatDuration([min, max]: Activity['durationMin']): string {
  const fmt = (m: number) => (m >= 60 && m % 60 === 0 ? `${m / 60} h` : `${m} min`);
  if (min === max) return fmt(min);
  const hours = (m: number) => m >= 60 && m % 60 === 0;
  if (hours(min) && hours(max)) return `${min / 60}–${max / 60} h`; // 60–120 → "1–2 h"
  if (hours(max) && !hours(min)) return `${min} min–${fmt(max)}`; // 30–60 → "30 min–1 h"
  return `${min}–${max} min`; // 30–90 → "30–90 min", never "30 min–90 min"
}

export function findActivity(id: string): Activity | undefined {
  return activities.find((a) => a.activityId === id);
}
