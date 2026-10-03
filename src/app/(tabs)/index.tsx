import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ActivityCard } from '@/components/ActivityCard';
import { SofaCard } from '@/components/SofaCard';
import { AppText, ListRow, Logo, Screen, SectionHeader } from '@/components/ui';
import { activities, type Activity } from '@/data/activities';
import { intents } from '@/data/intents';
import { timeCap } from '@/lib/recommend';
import { interestCategories, useAppState, type Prefs } from '@/state/app-state';
import { space } from '@/theme';

/**
 * Two ideas for today, shaped by what she chose in onboarding (interests →
 * categories, available time → duration). Falls back to short, low-energy
 * ideas when nothing was chosen or nothing matches.
 */
function pickToday(prefs: Prefs | undefined): readonly Activity[] {
  const cats = interestCategories(prefs);
  const cap = prefs?.availability ? timeCap[prefs.availability] : Infinity;
  const fits = activities.filter((a) => a.durationMin[0] <= cap && (cats.size === 0 || cats.has(a.category)));
  const fallback = activities.filter((a) => a.energy === 'baixa' && a.durationMin[1] <= 15);
  return (fits.length >= 2 ? fits : [...fits, ...fallback.filter((a) => !fits.includes(a))]).slice(0, 2);
}

/**
 * Home — spec §4.2: entry by intention, never a mood question. Leads with
 * "Me tira do sofá" (spec §4.3). No search (not in spec; conflict C9).
 */
export default function Home() {
  const { prefs } = useAppState();
  const today = pickToday(prefs);
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
