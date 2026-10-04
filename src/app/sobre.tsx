import { StyleSheet, View } from 'react-native';

import { AppText, BackBar, CheckItem, Screen } from '@/components/ui';
import { space } from '@/theme';

/** Sobre — spec §1.2 / §1.5 / §9, in plain language. */
export default function Sobre() {
  return (
    <Screen edges={['top', 'bottom']}>
      <BackBar />
      <AppText variant="h1">Sobre o Nós no Limiar</AppText>
      <AppText variant="body" color="textBody">
        Um espaço para transformar tempo disponível em curiosidade: pequenas experiências, jogos de reflexão, ideias criativas e
        atividades para descobrir o que combina com a vida de hoje.
      </AppText>
      <View style={styles.block}>
        <AppText variant="h3">O que o app não é</AppText>
        <CheckItem mark="dot" text="Não é psicoterapia nem atendimento clínico." />
        <CheckItem mark="dot" text="Não faz diagnóstico nem avaliação psicológica." />
        <CheckItem mark="dot" text="Não é serviço de emergência." />
      </View>
      <AppText variant="bodySmall" color="textBody">
        Conteúdo editorial inspirado em estudos sobre vida adulta, relações e reflexão. As atividades e suas fontes estão em revisão.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({ block: { gap: space[3] } });
