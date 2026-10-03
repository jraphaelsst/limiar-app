import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Icons, ListRow, Screen } from '@/components/ui';
import { useAppState } from '@/state/app-state';
import { color, radius, space } from '@/theme';

/** Phase 0 profile: help/safety one tap away (spec §10.3, §16); erase-all per spec §10.3. */
export default function Perfil() {
  const { eraseAll } = useAppState();
  const [confirming, setConfirming] = useState(false);
  const [failed, setFailed] = useState(false);

  const erase = async () => {
    try {
      await eraseAll(); // guards flip: the app returns to onboarding
    } catch (e) {
      console.error('[perfil] erase failed', e);
      setFailed(true);
    }
  };

  return (
    <Screen edges={['top']}>
      <View style={styles.intro}>
        <AppText variant="h1">Perfil</AppText>
        <AppText variant="body" color="textBody">
          Nesta versão de teste, tudo fica guardado apenas neste aparelho.
        </AppText>
      </View>
      <View style={styles.list}>
        <ListRow icon={Icons.Lifebuoy} title="Ajuda e segurança" subtitle="Contatos de atendimento no Brasil" onPress={() => router.push('/ajuda')} />
        <ListRow icon={Icons.Info} title="Sobre o Nós no Limiar" subtitle="O que o app é e o que não é" onPress={() => router.push('/sobre')} />
        <ListRow title="Privacidade" subtitle="O que fica guardado e o que não é pedido" onPress={() => router.push('/privacidade')} />
        {__DEV__ && <ListRow title="Tipografia" subtitle="Somente desenvolvimento" onPress={() => router.push('/tipografia')} />}
      </View>

      {confirming ? (
        <View style={styles.confirm} accessibilityLiveRegion="polite">
          <AppText variant="h3">Apagar tudo deste aparelho?</AppText>
          <AppText variant="bodySmall" color="textBody">
            Suas escolhas e atividades salvas serão apagadas, e o app volta para as boas-vindas. Não dá para desfazer.
          </AppText>
          <View style={styles.row}>
            <Button label="Apagar" onPress={erase} />
            <Button variant="quiet" label="Cancelar" onPress={() => setConfirming(false)} />
          </View>
          {failed && (
            <AppText variant="label" color="error">
              Não foi possível apagar agora. Tente de novo.
            </AppText>
          )}
        </View>
      ) : (
        <Button variant="quiet" label="Apagar dados deste aparelho" onPress={() => setConfirming(true)} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: space[2], paddingTop: space[4] },
  list: { gap: space[2] },
  confirm: { backgroundColor: color.surface, borderRadius: radius.card, padding: space[5], gap: space[3] },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[4] },
});
