/** The six content worlds — spec §3.1, verbatim titles and scopes. */
export type World = {
  id: string;
  title: string;
  description: string;
  /** Destination when the world already has real content in Phase 0; absent ⇒ not pressable yet. */
  href?: '/atividades';
};

export const worlds: readonly World[] = [
  { id: 'quem-sou', title: 'Quem sou eu agora?', description: 'Gostos, curiosidades e desejos; partes da vida que ficaram pouco usadas.' },
  { id: 'filhos-adultos', title: 'Minha relação com filhos adultos', description: 'Autonomia, proximidade e novas formas de presença.' },
  { id: 'tempo', title: 'O que faço com esse tempo?', description: 'Atividades rápidas, projetos, rotina e curiosidade.' },
  { id: 'nos-dois', title: 'Nós dois agora', description: 'Programas, conversas e descobertas a dois. Também para quem não tem parceiro.' },
  { id: 'mundo', title: 'Meu mundo pode aumentar', description: 'Amizades, estudo, cultura, trabalho, voluntariado, cidade e viagens.' },
  { id: 'experimenta', title: 'Experimenta isso', description: 'Microexperiências criativas e concretas, com filtros de tempo e energia.', href: '/atividades' },
];
