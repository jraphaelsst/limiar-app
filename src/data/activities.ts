/**
 * Activity catalog — spec §5 schema, seeded from spec §5.1 (15 seeds).
 *
 * Every item is `rascunho`: titles, summaries, time and materials come from the
 * spec; steps and variations were written to be faithful to each summary and
 * still need editorial review (spec §22 — nothing is published by AI alone).
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
  return min === max ? fmt(min) : max < 60 ? `${min}–${max} min` : `${fmt(min)}–${fmt(max)}`;
}

export function findActivity(id: string): Activity | undefined {
  return activities.find((a) => a.activityId === id);
}
