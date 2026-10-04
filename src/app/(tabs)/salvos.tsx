import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, ListRow, Screen, SectionHeader } from '@/components/ui';
import { categoryLabel, findActivity, formatDuration, type Activity } from '@/data/activities';
import { findReflection, findTheme, reflectionsFor, type Reflection } from '@/data/reflexoes';
import { useAppState } from '@/state/app-state';
import { space } from '@/theme';

/** Screen 15 "Salvos" (spec §19): activities and guided-reflection cards she bookmarked — ids only. */
export default function Salvos() {
  const { savedIds, savedReflectionIds } = useAppState();
  const saved = savedIds.map(findActivity).filter((a): a is Activity => !!a);
  // A retired card leaves Salvos the way it leaves its theme (its id stays stored until she erases it).
  const reflections = savedReflectionIds.map(findReflection).filter((r): r is Reflection => !!r && r.reviewStatus !== 'retirado');
  const empty = saved.length === 0 && reflections.length === 0;

  return (
    <Screen edges={['top']}>
      <View style={styles.intro}>
        <AppText variant="h1">Salvos</AppText>
        {!empty && (
          <AppText variant="body" color="textBody">
            O que você guardou para depois.
          </AppText>
        )}
      </View>

      {empty ? (
        <View style={styles.empty}>
          <AppText variant="body" color="textBody">
            As atividades e os cartões de reflexão que você guardar aparecem aqui. Toque no marcador de um deles para guardá-lo.
          </AppText>
          <Button label="Me tira do sofá" arrow onPress={() => router.push('/sofa')} />
        </View>
      ) : (
        <>
          {saved.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Atividades" />
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
            </View>
          )}
          {reflections.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Reflexões" />
              <View style={styles.list}>
                {reflections.map((r) => (
                  <ListRow
                    key={r.reflectionId}
                    title={r.title}
                    subtitle={findTheme(r.theme)?.label}
                    onPress={() =>
                      router.push({
                        pathname: '/reflexao/[tema]',
                        // 1-based card number inside its theme (src/lib/reflexao.ts startIndex)
                        params: { tema: r.theme, cartao: String(reflectionsFor(r.theme).indexOf(r) + 1) },
                      })
                    }
                  />
                ))}
              </View>
            </View>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: space[2], paddingTop: space[4] },
  empty: { gap: space[5], alignItems: 'flex-start' },
  section: { gap: space[3] },
  list: { gap: space[2] },
});
