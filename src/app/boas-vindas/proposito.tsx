import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { HelpButton } from '@/components/HelpButton';
import { AppText, BackBar, Button, CheckItem, Screen } from '@/components/ui';
import { color, radius, space } from '@/theme';

/**
 * Spec screens 02 + 03 — what the app is and is not, then the 18+ confirmation
 * (a yes/no only: no birth date is ever asked — spec §4.1.3).
 */
export default function Proposito() {
  const [under18, setUnder18] = useState(false);

  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        under18 ? undefined : (
          <View style={styles.actions}>
            <Button label="Tenho 18 anos ou mais" fullWidth onPress={() => router.push('/boas-vindas/interesses')} />
            <Button variant="quiet" label="Tenho menos de 18 anos" onPress={() => setUnder18(true)} />
          </View>
        )
      }>
      <BackBar right={<HelpButton />} />
      <AppText variant="h1">Antes de começar</AppText>
      <AppText variant="body" color="textBody">
        O Nós no Limiar é um espaço de reflexão, descoberta e experiências para a vida adulta.
      </AppText>
      <View style={styles.block}>
        <CheckItem mark="dot" text="Não é psicoterapia nem atendimento clínico." />
        <CheckItem mark="dot" text="Não faz diagnóstico nem avaliação psicológica." />
        <CheckItem mark="dot" text="Não é serviço de emergência." />
      </View>
      <View style={styles.links}>
        <Button variant="quiet" label="Privacidade" onPress={() => router.push('/privacidade')} />
        <AppText variant="caption" color="textSubtle">
          Termos de uso: em preparação
        </AppText>
      </View>

      {under18 && (
        <View style={styles.notice} accessibilityLiveRegion="polite">
          <AppText variant="h3">O app é para maiores de 18 anos</AppText>
          <AppText variant="bodySmall" color="textBody">
            Nesta fase, o Nós no Limiar é só para pessoas adultas. Os contatos de ajuda continuam disponíveis.
          </AppText>
          <Button label="Ver contatos de ajuda" onPress={() => router.push('/ajuda')} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { gap: space[3] },
  links: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: space[4], marginLeft: -space[2] },
  actions: { gap: space[1], alignItems: 'center' },
  notice: { backgroundColor: color.surface, borderRadius: radius.card, padding: space[5], gap: space[3], alignItems: 'flex-start' },
});
