import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { HelpButton } from '@/components/HelpButton';
import { AppText, BackBar, ListRow, Screen } from '@/components/ui';
import { themes } from '@/data/reflexoes';
import { space } from '@/theme';

/**
 * Screen 13 "Pergunta aberta — tema" (spec §19, §4.7): she picks a theme first, which keeps the
 * feature from turning the app into a consulting room. Wave 2 has no text field at all (decisions.md
 * 2026-10-04): each theme opens curated cards to think about on paper or in her head.
 */
export default function Temas() {
  return (
    <Screen edges={['top', 'bottom']}>
      <BackBar right={<HelpButton />} />
      <View style={styles.intro}>
        <AppText variant="h1">Quer pensar sobre alguma coisa?</AppText>
        <AppText variant="body" color="textBody">
          Escolha um tema. Cada um tem alguns cartões com perguntas para pensar no papel ou de cabeça. Aqui não se escreve nada.
        </AppText>
      </View>
      <View style={styles.list}>
        {themes.map((t) => (
          <ListRow key={t.id} title={t.label} onPress={() => router.push({ pathname: '/reflexao/[tema]', params: { tema: t.id } })} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: space[3] },
  list: { gap: space[2] },
});
