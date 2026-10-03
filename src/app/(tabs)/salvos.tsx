import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, ListRow, Screen } from '@/components/ui';
import { categoryLabel, findActivity, formatDuration, type Activity } from '@/data/activities';
import { useSaved } from '@/state/app-state';
import { space } from '@/theme';

export default function Salvos() {
  const { savedIds } = useSaved();
  const saved = savedIds.map(findActivity).filter((a): a is Activity => !!a);

  return (
    <Screen edges={['top']}>
      <View style={styles.intro}>
        <AppText variant="h1">Salvos</AppText>
        {saved.length > 0 && (
          <AppText variant="body" color="textBody">
            Atividades que você guardou para depois.
          </AppText>
        )}
      </View>

      {saved.length === 0 ? (
        <View style={styles.empty}>
          <AppText variant="body" color="textBody">
            As atividades que você guardar aparecem aqui. Toque no marcador de uma atividade para guardá-la.
          </AppText>
          <Button label="Me tira do sofá" arrow onPress={() => router.push('/sofa')} />
        </View>
      ) : (
        <View style={styles.list}>
          {saved.map((a) => (
            <ListRow
              key={a.activityId}
              title={a.title}
              subtitle={`${categoryLabel[a.category]} · ${formatDuration(a.durationMin)}`}
              onPress={() => router.push(`/atividade/${a.activityId}`)}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: space[2], paddingTop: space[4] },
  empty: { gap: space[5], alignItems: 'flex-start' },
  list: { gap: space[2] },
});
