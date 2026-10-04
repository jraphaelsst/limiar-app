import { useRef, useState } from 'react';
import { Platform, Share, StyleSheet, View } from 'react-native';

import { AppText, BackBar, Button, CheckItem, Screen } from '@/components/ui';
import { announce } from '@/lib/a11y';
import { buildExportText, useAppState } from '@/state/app-state';
import { color, radius, space } from '@/theme';

/** What happened after "Exportar meus dados" — every outcome is said on screen. */
type ExportStatus = 'idle' | 'shared' | 'cancelled' | 'failed' | 'unsupported';

const statusText: Record<Exclude<ExportStatus, 'idle'>, string> = {
  shared: 'Texto compartilhado com o app que você escolheu.',
  cancelled: 'Exportação cancelada. Nada saiu do aparelho.',
  failed: 'Não foi possível abrir o compartilhamento. O texto está abaixo para você copiar.',
  unsupported: 'Este navegador não compartilha direto. Selecione e copie o texto abaixo.',
};

/** Web without the Web Share API (most desktop browsers): skip straight to the copyable text. */
function canShare(): boolean {
  return Platform.OS !== 'web' || (typeof navigator !== 'undefined' && typeof navigator.share === 'function');
}

/**
 * Spec screen 17 — what THIS build stores, stated exactly, plus export (§10.3).
 * The full privacy policy (spec §10, legal review) does not exist yet; this
 * screen says so instead of linking nowhere. Reachable before onboarding too,
 * so export only appears once there is something to export.
 */
export default function Privacidade() {
  const { prefs, savedIds, gameAResults } = useAppState();
  const [status, setStatus] = useState<ExportStatus>('idle');
  const [text, setText] = useState<string | null>(null);
  // One share sheet at a time: the button is disabled while it is open, and the ref
  // also catches a second tap that lands before that re-render.
  const [sharing, setSharing] = useState(false);
  const sharingRef = useRef(false);

  const show = (next: ExportStatus) => {
    setStatus(next);
    if (next !== 'idle') announce(statusText[next]);
  };

  const exportData = async () => {
    if (!prefs || sharingRef.current) return;
    const message = buildExportText(prefs, savedIds, new Date(), gameAResults);
    setText(null);
    if (!canShare()) {
      setText(message);
      show('unsupported');
      return;
    }
    sharingRef.current = true;
    setSharing(true);
    try {
      // Nothing leaves the device unless she picks a target in the system sheet.
      const result = await Share.share({ title: 'Meus dados do Nós no Limiar', message });
      if (result?.action === Share.dismissedAction) show('cancelled');
      // Android always reports sharedAction, even when the sheet is closed: say nothing rather than claim a send.
      else show(Platform.OS === 'android' ? 'idle' : 'shared');
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') {
        show('cancelled'); // web: navigator.share rejects with AbortError when the sheet is dismissed
        return;
      }
      console.error('[privacidade] export share failed', e);
      setText(message);
      show('failed');
    } finally {
      sharingRef.current = false;
      setSharing(false);
    }
  };

  const showHere = () => {
    if (!prefs) return;
    setText(buildExportText(prefs, savedIds, new Date(), gameAResults));
    setStatus('idle');
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <BackBar />
      <AppText variant="h1">Privacidade</AppText>
      <AppText variant="body" color="textBody">
        Esta é uma versão de teste. Tudo o que o app guarda fica apenas neste aparelho. O app não envia nada para servidores; seus dados só
        saem daqui se você exportar e escolher para onde.
      </AppText>
      <View style={styles.block}>
        <AppText variant="h3">O que fica guardado</AppText>
        <CheckItem text="A confirmação de que você tem 18 anos ou mais." />
        <CheckItem text="A data em que você começou a usar o app." />
        <CheckItem text="Os interesses e o tempo livre que você escolheu, se escolheu. Você pode mudar isso em Perfil, na opção Preferências." />
        <CheckItem text="As atividades que você salvou." />
        <CheckItem text="Os resultados do jogo “Ainda gosto disso?” que você escolheu guardar." />
      </View>
      <View style={styles.block}>
        <AppText variant="h3">O que não é pedido</AppText>
        <CheckItem mark="dot" text="Nome, data de nascimento, CPF, endereço ou localização." />
        <CheckItem mark="dot" text="Informações de saúde, diagnósticos ou medicamentos." />
      </View>

      {prefs && (
        <View style={styles.block}>
          <AppText variant="h3">Exportar seus dados</AppText>
          <AppText variant="bodySmall" color="textBody">
            Gera um texto com suas escolhas, os títulos das atividades salvas e os resultados de jogo que você guardou. Você escolhe para onde enviar, ou cancela. Uma cópia
            enviada fica com quem a recebe: apagar os dados aqui não apaga essa cópia.
          </AppText>
          <View style={styles.actions}>
            <Button label="Exportar meus dados" disabled={sharing} onPress={exportData} />
            {text === null && <Button variant="quiet" label="Ver o texto aqui" onPress={showHere} />}
          </View>
          {status !== 'idle' && (
            <AppText variant="label" color={status === 'failed' ? 'error' : 'text'} accessibilityLiveRegion={status === 'failed' ? 'assertive' : 'polite'}>
              {statusText[status]}
            </AppText>
          )}
          {text !== null && (
            <View style={styles.export}>
              <AppText variant="bodySmall" selectable>
                {text}
              </AppText>
            </View>
          )}
        </View>
      )}

      <AppText variant="bodySmall" color="textBody">
        Para apagar tudo, vá em Perfil e toque em “Apagar dados deste aparelho”. A política de privacidade completa será publicada antes
        do lançamento.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { gap: space[3] },
  actions: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space[4] },
  export: { backgroundColor: color.surface, borderRadius: radius.card, padding: space[4], borderWidth: 1, borderColor: color.divider },
});
