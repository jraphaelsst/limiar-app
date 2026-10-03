import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ActivityCard } from '@/components/ActivityCard';
import { SofaCard } from '@/components/SofaCard';
import { AppText, ListRow, Logo, Screen, SectionHeader } from '@/components/ui';
import { activities } from '@/data/activities';
import { intents } from '@/data/intents';
import { space } from '@/theme';

/** Two short, low-energy ideas so the Home always offers something to do right away. */
const today = activities.filter((a) => a.energy === 'baixa' && a.durationMin[1] <= 15).slice(0, 2);

/**
 * Home — spec §4.2: entry by intention, never a mood question. Leads with
 * "Me tira do sofá" (spec §4.3). No search (not in spec; conflict C9).
 */
export default function Home() {
  return (
    <Screen edges={['top']}>
      <View style={styles.header}>
        <Logo width={176} />
      </View>

      <AppText variant="h2">
        Olá,{'\n'}que bom ter você aqui!
      </AppText>

      <SofaCard onStart={() => router.push('/sofa')} />

      <View style={styles.section}>
        <SectionHeader title="O que combina com hoje?" />
        <View style={styles.list}>
          {intents.map((i) => (
            <ListRow key={i.id} title={i.label} onPress={() => router.push({ pathname: '/sofa', params: { preset: i.id } })} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Para você hoje" action={{ label: 'Ver todas', onPress: () => router.push('/atividades') }} />
        <View style={styles.cards}>
          {today.map((a) => (
            <ActivityCard key={a.activityId} activity={a} onPress={() => router.push(`/atividade/${a.activityId}`)} />
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingTop: space[2] },
  section: { gap: space[4] },
  list: { gap: space[2] },
  cards: { flexDirection: 'row', gap: space[3] },
});
