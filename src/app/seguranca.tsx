import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';
import { useEffect, useRef, useState } from 'react';
import { Share, StyleSheet, View, type Text } from 'react-native';

import { EmergencyLines } from '@/components/EmergencyLines';
import { AppText, Button, IconButton, Icons, Screen } from '@/components/ui';
import { announce, focusForAccessibility } from '@/lib/a11y';
import { canShare, isShareCancel } from '@/lib/share';
import type { TipoRisco } from '@/safety/gate';
import { MENSAGEM_PARA_ALGUEM, TEXTO_RISCO, TEXTO_RISCO_FALADO, TEXTO_VIOLENCIA, TITULO_RISCO, TITULO_VIOLENCIA } from '@/safety/recursos';
import { useAppState } from '@/state/app-state';
import { isOneStepBack } from '@/state/use-previous-step-on-back';
import { color, radius, space } from '@/theme';

type AvisoStatus = 'idle' | 'failed' | 'unsupported';

const avisoTexto: Record<Exclude<AvisoStatus, 'idle'>, string> = {
  failed: 'Não foi possível abrir o compartilhamento. Copie a mensagem abaixo e envie para alguém de confiança.',
  unsupported: 'Copie a mensagem abaixo e envie para alguém de confiança.',
};

/**
 * Spec screen 19 — rota de risco alto (§8, §8.1, §8.2). Reached from the safety gate
 * (`useSafetyGate`) with `?tipo=autolesao|violencia|ambos`, or directly. Static and offline:
 * no AI, no network, nothing stored (§25.8). Following §8.2 there is no activity, game,
 * breathing prompt, motivational or promotional content, and no request for a promise.
 *
 * Leaving always goes to Home (the flow that led here is abandoned): the house button,
 * "Voltar ao início", Android back and the iOS swipe all do the same. Outside the onboarding
 * guards, like /ajuda: reachable in any state.
 */
export default function Seguranca() {
  const { tipo } = useLocalSearchParams<{ tipo?: TipoRisco }>();
  const comViolencia = tipo === 'violencia' || tipo === 'ambos';
  const violenciaPrimeiro = tipo === 'violencia'; // only violence detected: its lines first
  const { prefs } = useAppState();
  const inicio = prefs !== undefined ? '/' : '/boas-vindas';

  const navigation = useNavigation();
  const saindo = useRef(false);
  const sair = () => {
    saindo.current = true;
    router.dismissTo(inicio);
  };
  // Every plain "back" becomes "go Home"; the dismissTo it triggers (and any other removal) passes.
  usePreventRemove(true, ({ data }) => {
    if (!saindo.current && isOneStepBack(data.action)) sair();
    else navigation.dispatch(data.action);
  });

  // Screen readers start on the title, not on the house button.
  const tituloRef = useRef<Text>(null);
  useEffect(() => {
    const t = setTimeout(() => focusForAccessibility(tituloRef.current), 300);
    return () => clearTimeout(t);
  }, []);

  const [aviso, setAviso] = useState<AvisoStatus>('idle');
  const [compartilhando, setCompartilhando] = useState(false);
  const mostrarAviso = (next: Exclude<AvisoStatus, 'idle'>) => {
    setAviso(next);
    announce(avisoTexto[next]);
  };
  const avisarAlguem = async () => {
    if (compartilhando) return;
    if (!canShare()) {
      mostrarAviso('unsupported');
      return;
    }
    setCompartilhando(true);
    try {
      // She picks the person in the system sheet; no contacts permission. Outcomes are not
      // reliable across platforms (Android always reports "shared"), so nothing claims "sent".
      await Share.share({ message: MENSAGEM_PARA_ALGUEM });
    } catch (e) {
      if (!isShareCancel(e)) {
        console.error('[seguranca] share sheet failed', e);
        mostrarAviso('failed');
      }
    } finally {
      setCompartilhando(false);
    }
  };

  const blocoViolencia = (
    <View style={styles.block}>
      <AppText variant="h3">{TITULO_VIOLENCIA}</AppText>
      <AppText variant="body" color="textBody">
        {TEXTO_VIOLENCIA}
      </AppText>
      <EmergencyLines numeros={['190', '180']} />
    </View>
  );

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.bar}>
        <IconButton icon={Icons.House} label="Voltar ao início" onPress={sair} />
      </View>
      <AppText ref={tituloRef} variant="h1">
        {TITULO_RISCO}
      </AppText>

      {violenciaPrimeiro && blocoViolencia}

      <View style={styles.block}>
        <AppText variant="body" color="textBody" accessibilityLabel={TEXTO_RISCO_FALADO}>
          {TEXTO_RISCO}
        </AppText>
        <EmergencyLines numeros={['192', '188']} />
        <View style={styles.actions}>
          <Button variant="quiet" label="Ver opções de atendimento" onPress={() => router.push('/ajuda')} />
          <Button variant="quiet" label="Avisar alguém de confiança" disabled={compartilhando} onPress={avisarAlguem} />
        </View>
        {aviso !== 'idle' && (
          <View style={styles.block}>
            <AppText variant="label" color={aviso === 'failed' ? 'error' : 'text'} accessibilityLiveRegion={aviso === 'failed' ? 'assertive' : 'polite'}>
              {avisoTexto[aviso]}
            </AppText>
            <View style={styles.message}>
              <AppText variant="body" selectable>
                {MENSAGEM_PARA_ALGUEM}
              </AppText>
            </View>
          </View>
        )}
      </View>

      {comViolencia && !violenciaPrimeiro && blocoViolencia}

      <Button variant="quiet" label="Voltar ao início" onPress={sair} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', marginLeft: -space[3] },
  block: { gap: space[3] },
  actions: { alignItems: 'flex-start', gap: space[1] },
  message: { backgroundColor: color.surface, borderRadius: radius.card, padding: space[4], borderWidth: 1, borderColor: color.divider },
});
