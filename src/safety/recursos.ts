/**
 * Crisis resources — GOVERNED CONTENT (spec §8.1, §22: "revisão periódica de recursos de crise").
 * One source for the high-risk screen (/seguranca) and the help screen (/ajuda), so the numbers
 * and the approved paragraph can never drift apart. Static: no network, no AI (§25.8).
 */

/** Spec §8.1 approved copy, verbatim. */
export const TITULO_RISCO = 'Sua segurança vem primeiro agora.';

/** Spec §8.1 approved copy, verbatim (shown on screen). */
export const TEXTO_RISCO =
  'Este aplicativo não é um serviço de emergência. Se houver risco de se machucar ou de não conseguir se manter segura, procure ajuda humana imediatamente. No Brasil: SAMU 192, UPA/pronto-socorro ou hospital. Para apoio emocional, CVV 188. Se puder, fique perto de alguém de confiança.';

/** The same words for screen readers: a slash would be read aloud as "barra". */
export const TEXTO_RISCO_FALADO = TEXTO_RISCO.replace('UPA/pronto-socorro', 'UPA, pronto-socorro');

export type Linha = { readonly numero: string; readonly nome: string; readonly uso: string };

/** Official Brazilian lines (spec §8.1 [R8], [R9]). */
export const LINHAS = {
  '192': { numero: '192', nome: 'SAMU', uso: 'Emergência médica' },
  '188': { numero: '188', nome: 'CVV', uso: 'Apoio emocional, 24 horas' },
  '180': { numero: '180', nome: 'Central de Atendimento à Mulher', uso: 'Orientação e denúncia de violência' },
  '190': { numero: '190', nome: 'Polícia Militar', uso: 'Emergência em caso de violência' },
} as const satisfies Record<string, Linha>;

export type NumeroLinha = keyof typeof LINHAS;

/** Violence block (spec §8 table, VIOLÊNCIA): 190 in an emergency, Ligue 180 for guidance and reports. */
export const TITULO_VIOLENCIA = 'Se alguém ameaça ou agride você';
export const TEXTO_VIOLENCIA = 'Em perigo agora, ligue 190. Para orientação e denúncia de violência contra a mulher, ligue 180.';

/**
 * "Avisar alguém de confiança": a short, neutral message she sends through the system share
 * sheet to a person SHE picks. No contacts permission, nothing about the app or the reason.
 */
export const MENSAGEM_PARA_ALGUEM = 'Você pode falar comigo agora?';
