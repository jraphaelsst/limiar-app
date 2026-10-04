/**
 * The pure half of the safety gate used by every free-text feature (spec §7.1 steps 3–5):
 * triage the text and decide whether the normal flow may continue. The React half
 * (navigation) is `useSafetyGate` in ./use-safety-gate.ts.
 *
 * The text is only read here. It is never stored, logged or returned.
 */
import { triage, type TriageResult } from './triage';

/** `/seguranca?tipo=…` — which blocks the high-risk screen shows (see src/app/seguranca.tsx). */
export type TipoRisco = 'autolesao' | 'violencia' | 'ambos';

export type Decisao = TriageResult & {
  /** false ⇒ the normal flow is blocked (no generation, no activity, nothing kept). */
  podeSeguir: boolean;
  /** Where to send her when blocked; null when the flow may continue. */
  rota: { pathname: '/seguranca'; params: { tipo: TipoRisco } } | null;
};

/**
 * AMARELO note (spec §8 table): reinforce the app's limit, suggest human/professional support,
 * no diagnosis. Callers show it calmly next to the normal flow, with a way to /ajuda.
 */
export const AVISO_AMARELO =
  'Este app não substitui conversa com pessoas nem cuidado profissional. Falar com alguém de confiança pode ajudar, e a UBS ou o CAPS mais perto de você oferecem atendimento. Para conversar agora, o CVV atende pelo 188, a qualquer hora.';

export function tipoDoRisco(r: TriageResult): TipoRisco | null {
  const violencia = r.sinais.includes('violencia');
  if (r.nivel === 'vermelho') return violencia ? 'ambos' : 'autolesao';
  if (r.nivel === 'violencia') return 'violencia';
  return null;
}

export function decidir(text: string): Decisao {
  const r = triage(text);
  const tipo = tipoDoRisco(r);
  return { ...r, podeSeguir: tipo === null, rota: tipo === null ? null : { pathname: '/seguranca', params: { tipo } } };
}
