import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { HelpButton } from '@/components/HelpButton';
import { AppText, BackBar, Button, ListRow, Screen } from '@/components/ui';
import { gameAPattern, games, themeList } from '@/data/games';
import { announce } from '@/lib/a11y';
import { longDate } from '@/lib/dates';
import { useAppState } from '@/state/app-state';
import { color, radius, space } from '@/theme';

const removeFailedText = 'Não foi possível apagar agora. Tente de novo.';

/**
 * "Quem sou eu agora?" — spec §3.1 world, entry to the discovery games of §4.5.
 * Also the one place where kept game A results are shown and removed: anything
 * the app stores must be visible and deletable where it was made (spec §10.3).
 */
export default function Jogos() {
  const { gameAResults, removeGameAResult } = useAppState();
  const [error, setError] = useState<string | null>(null);

  const remove = (savedAt: string) => {
    setError(null);
    removeGameAResult(savedAt).catch((e) => {
      console.error('[storage] could not remove a game result', e);
      setError(removeFailedText);
      announce(removeFailedText);
    });
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <BackBar right={<HelpButton />} />
      <View style={styles.intro}>
        <AppText variant="h1">Quem sou eu agora?</AppText>
        <AppText variant="body" color="textBody">
          Dois jogos curtos para olhar gostos e hábitos de hoje. Não há resposta certa nem pontuação.
        </AppText>
      </View>

      <View style={styles.list}>
        {games.map((g) => (
          <ListRow key={g.id} title={g.title} subtitle={g.description} onPress={() => router.push(g.href)} />
        ))}
      </View>

      {gameAResults.length > 0 && (
        <View style={styles.list}>
          <AppText variant="h3">Resultados guardados</AppText>
          {gameAResults.map((r) => {
            const p = gameAPattern(r.choices);
            const date = longDate(new Date(r.savedAt)); // same words as the export (no Intl dependency)
            return (
              <View key={r.savedAt} style={styles.saved}>
                <AppText variant="caption" color="textSubtle">
                  Ainda gosto disso? · {date}
                </AppText>
                <AppText variant="bodySmall" color="textBody">
                  {p.themes.length > 0 ? `Temas que se repetiram: ${themeList(p.themes)}.` : 'Nenhum tema se repetiu.'} Escolhas: {p.picked.join(', ')}.
                </AppText>
                <View style={styles.savedAction}>
                  <Button
                    variant="quiet"
                    label="Apagar"
                    accessibilityLabel={`Apagar resultado de ${date}`}
                    onPress={() => remove(r.savedAt)}
                  />
                </View>
              </View>
            );
          })}
          {error && (
            <AppText variant="caption" color="error" accessibilityLiveRegion="assertive">
              {error}
            </AppText>
          )}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: space[2] },
  list: { gap: space[2] },
  saved: { gap: space[1], backgroundColor: color.surface, borderRadius: radius.card, paddingHorizontal: space[4], paddingTop: space[3] },
  savedAction: { alignItems: 'flex-start', marginLeft: -space[2] },
});
