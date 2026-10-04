const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

/** "3 de outubro de 2026" — built by hand so it reads the same on every engine (no Intl dependency). */
export function longDate(d: Date): string {
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}
