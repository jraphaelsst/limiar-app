/** The six content worlds — spec §3.1, verbatim titles and scopes. */
/** Stable world ids — the join key between worlds and content (activities, reflections). */
export type WorldId = 'quem-sou' | 'filhos-adultos' | 'tempo' | 'nos-dois' | 'mundo' | 'experimenta';

export type World = {
  id: WorldId;
  title: string;
  /** Short line for the Explorar list. */
  description: string;
  /** The spec §3.1 scope, verbatim (minus the spec's instructions to us) — shown on the world screen. */
  scope: string;
  /** A visible note on the world screen, where the spec asks for one (§3.1 "Nós dois agora"). */
  note?: string;
};

/**
 * Every world opens a real screen (`worldRoute` in src/data/world-content.ts): its tagged activities and the
 * related reflection themes and games, or an honest empty state while its content is being written.
 */
export const worlds: readonly World[] = [
  {
    id: 'quem-sou',
    title: 'Quem sou eu agora?',
    description: 'Gostos, curiosidades e desejos; partes da vida que ficaram pouco usadas.',
    scope: 'Identidade, gostos, curiosidades, desejos, partes da vida que ficaram pouco usadas.',
  },
  {
    id: 'filhos-adultos',
    title: 'Minha relação com filhos adultos',
    description: 'Autonomia, proximidade e novas formas de presença.',
    scope: 'Autonomia, proximidade, conselho versus interferência, novas formas de presença.',
  },
  {
    id: 'tempo',
    title: 'O que faço com esse tempo?',
    description: 'Atividades rápidas, projetos, rotina e curiosidade.',
    scope: 'Atividades rápidas, projetos, organização de rotina, experiências e curiosidade.',
  },
  {
    id: 'nos-dois',
    title: 'Nós dois agora',
    description: 'Programas, conversas e descobertas a dois. Também para quem não tem parceiro.',
    scope: 'Vida a dois depois de mudanças familiares; programas, conversas e descobertas compartilhadas.',
    // Spec §3.1: an alternative for "não tenho parceiro(a)", without embarrassment — visible, not a footnote.
    note: 'Também para quem não tem parceiro ou parceira: muitas ideias daqui funcionam com uma amiga, com alguém da família ou sozinha.',
  },
  {
    id: 'mundo',
    title: 'Meu mundo pode aumentar',
    description: 'Amizades, estudo, cultura, trabalho, voluntariado, cidade e viagens.',
    scope: 'Amizades, estudo, cultura, trabalho, voluntariado, cidade, viagens, grupos e interesses.',
  },
  {
    id: 'experimenta',
    title: 'Experimenta isso',
    description: 'Microexperiências criativas e concretas, com filtros de tempo e energia.',
    scope: 'Baralho de microexperiências criativas e concretas, com filtros de tempo, energia, orçamento e ambiente.',
  },
];

export function findWorld(id: string | undefined): World | undefined {
  return worlds.find((w) => w.id === id);
}
