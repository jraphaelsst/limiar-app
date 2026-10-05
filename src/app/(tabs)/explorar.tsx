import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, ListRow, Screen } from '@/components/ui';
import { worldRoute } from '@/data/world-content';
import { worlds } from '@/data/worlds';
import { space } from '@/theme';

/**
 * Explorar — the six worlds of spec §3.1, every one pressable. Each opens its world screen
 * (`mundo/[id]`), which shows only real content or says honestly that it is being prepared;
 * "Experimenta isso" opens the catalog, which is that world (worldRoute). No "planos" CTA (conflict C6).
 */
export default function Explorar() {
  return (
    <Screen edges={['top']}>
      <View style={styles.intro}>
        <AppText variant="h1">Explorar</AppText>
        <AppText variant="body" color="textBody">
          Seis caminhos para descobrir o que combina com a vida de hoje.
        </AppText>
      </View>
      <View style={styles.list}>
        {worlds.map((w) => (
          <ListRow key={w.id} title={w.title} subtitle={w.description} onPress={() => router.push(worldRoute(w.id))} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: space[2], paddingTop: space[4] },
  list: { gap: space[2] },
});
