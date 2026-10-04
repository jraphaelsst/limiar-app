import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ActivityFeedback } from '@/components/ActivityFeedback';
import { useBookmark } from '@/components/Bookmark';
import { AppText, BackBar, Button, Screen } from '@/components/ui';
import type { Activity } from '@/data/activities';
import { space } from '@/theme';

/**
 * Screen 09 "Pós-atividade" (spec §19) — a short, neutral close after "Concluir": no score,
 * streak, badge, celebration or guilt (spec §4.5, §15). Then the optional §6 feedback.
 *
 * `children` is the seam for spec §4.4 "Depois" (the optional "guardar uma frase" field),
 * which a later slice adds AFTER the safety layer — this screen says nothing about it until then.
 */
export function AfterActivity({ activity, children }: { activity: Activity; children?: ReactNode }) {
  const bookmark = useBookmark(activity.activityId);
  return (
    <Screen edges={['top', 'bottom']} footer={<Button label="Voltar ao início" fullWidth onPress={() => router.dismissTo('/')} />}>
      <BackBar right={bookmark.button} />
      {bookmark.error}
      <View style={styles.block}>
        <AppText variant="h1">Feito</AppText>
        <AppText variant="body" color="textBody">
          Você concluiu “{activity.title}”.{' '}
          {bookmark.saved ? 'Ela continua nos seus salvos.' : 'Para repetir outro dia, guarde no marcador acima.'}
        </AppText>
      </View>
      <ActivityFeedback activity={activity} />
      {children}
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { gap: space[3] },
});
