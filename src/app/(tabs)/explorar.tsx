import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, ListRow, Screen } from '@/components/ui';
import { worlds } from '@/data/worlds';
import { space } from '@/theme';

/**
 * Explorar — the six worlds of spec §3.1. Only "Experimenta isso" has content in
 * Phase 0 (the activity catalog), so only it is pressable; the others are listed
 * honestly as coming, never as fake links. No "planos" CTA (conflict C6).
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
          <ListRow
            key={w.id}
            title={w.title}
            subtitle={w.description}
            onPress={w.href ? () => router.push(w.href!) : undefined}
            trailing={w.href ? undefined : 'Em breve'}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: space[2], paddingTop: space[4] },
  list: { gap: space[2] },
});
