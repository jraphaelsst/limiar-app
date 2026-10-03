import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, BackBar, ListRow, Screen } from '@/components/ui';
import { activities, categoryLabel, formatDuration } from '@/data/activities';
import { space } from '@/theme';

/** "Experimenta isso" — the full Phase 0 catalog. */
export default function Atividades() {
  return (
    <Screen edges={['top', 'bottom']}>
      <BackBar />
      <View style={styles.intro}>
        <AppText variant="h1">Experimenta isso</AppText>
        <AppText variant="body" color="textBody">
          {activities.length} microexperiências para fazer hoje.
        </AppText>
      </View>
      <View style={styles.list}>
        {activities.map((a) => (
          <ListRow
            key={a.activityId}
            title={a.title}
            subtitle={`${categoryLabel[a.category]} · ${formatDuration(a.durationMin)}`}
            onPress={() => router.push(`/atividade/${a.activityId}`)}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: space[2] },
  list: { gap: space[2] },
});
