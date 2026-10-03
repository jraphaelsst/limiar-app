import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, Icons, ListRow, Screen } from '@/components/ui';
import { space } from '@/theme';

/** Phase 0 profile: help/safety is always one tap away (spec §10.3, §16 — never behind a paywall). */
export default function Perfil() {
  return (
    <Screen edges={['top']}>
      <View style={styles.intro}>
        <AppText variant="h1">Perfil</AppText>
        <AppText variant="body" color="textBody">
          Nesta versão de teste, nada sai do seu aparelho e nada fica salvo depois que o app fecha.
        </AppText>
      </View>
      <View style={styles.list}>
        <ListRow icon={Icons.Lifebuoy} title="Ajuda e segurança" subtitle="Contatos de atendimento no Brasil" onPress={() => router.push('/ajuda')} />
        <ListRow icon={Icons.Info} title="Sobre o Nós no Limiar" subtitle="O que o app é e o que não é" onPress={() => router.push('/sobre')} />
        {__DEV__ && <ListRow title="Tipografia" subtitle="Somente desenvolvimento" onPress={() => router.push('/tipografia')} />}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: space[2], paddingTop: space[4] },
  list: { gap: space[2] },
});
