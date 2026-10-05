import { StyleSheet, View } from 'react-native';

import { ActivityRow } from '@/components/ActivityRow';
import { AppText, BackBar, Screen } from '@/components/ui';
import { activities } from '@/data/activities';
import { space } from '@/theme';

/** "Experimenta isso" — the full Phase 0 catalog; also where that world opens from Explorar (worldRoute). */
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
          <ActivityRow key={a.activityId} activity={a} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: space[2] },
  list: { gap: space[2] },
});
