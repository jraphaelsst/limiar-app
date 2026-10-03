import { StyleSheet, View } from 'react-native';

import { AppText, BackBar, CheckItem, Screen } from '@/components/ui';
import { space } from '@/theme';

/**
 * What THIS build stores — stated exactly. The full privacy policy (spec §10,
 * legal review) does not exist yet; this screen says so instead of linking nowhere.
 */
export default function Privacidade() {
  return (
    <Screen edges={['top', 'bottom']}>
      <BackBar />
      <AppText variant="h1">Privacidade</AppText>
      <AppText variant="body" color="textBody">
        Esta é uma versão de teste. Tudo o que o app guarda fica apenas neste aparelho. Nada é enviado para servidores ou para outras
        pessoas.
      </AppText>
      <View style={styles.block}>
        <AppText variant="h3">O que fica guardado</AppText>
        <CheckItem text="A confirmação de que você tem 18 anos ou mais." />
        <CheckItem text="Os interesses e o tempo livre que você escolheu, se escolheu." />
        <CheckItem text="As atividades que você salvou." />
      </View>
      <View style={styles.block}>
        <AppText variant="h3">O que não é pedido</AppText>
        <CheckItem mark="dot" text="Nome, data de nascimento, CPF, endereço ou localização." />
        <CheckItem mark="dot" text="Informações de saúde, diagnósticos ou medicamentos." />
      </View>
      <AppText variant="bodySmall" color="textBody">
        Para apagar tudo, vá em Perfil e toque em “Apagar dados deste aparelho”. A política de privacidade completa será publicada antes
        do lançamento.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({ block: { gap: space[3] } });
