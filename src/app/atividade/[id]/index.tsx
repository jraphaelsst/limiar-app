import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ActivityFeedback } from '@/components/ActivityFeedback';
import { ActivityNotFound } from '@/components/ActivityNotFound';
import { useBookmark } from '@/components/Bookmark';
import { AppText, BackBar, Button, CheckItem, Chip, Icons, MetaRow, Screen, StepItem } from '@/components/ui';
import { categoryLabel, energyLabel, environmentLabel, findActivity, formatDuration, type Activity } from '@/data/activities';
import { color, radius, space } from '@/theme';

export default function ActivityRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const a = findActivity(id);
  if (!a) return <ActivityNotFound />;
  return <ActivityCardScreen key={a.activityId} activity={a} />;
}

/**
 * Activity card, full — spec §4.4: title · time · materials · 3–5 steps · variation, then the
 * actions. "Bora" opens the step-by-step view (screen 08); Concluir · Guardar (bookmark) ·
 * Outra ideia · Sair sem concluir are the same actions the step view and "Me tira do sofá" offer.
 * The §6 feedback can be given here too, without doing the activity.
 */
function ActivityCardScreen({ activity: a }: { activity: Activity }) {
  const bookmark = useBookmark(a.activityId);
  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        <View style={styles.actions}>
          <Button
            label="Bora"
            arrow
            fullWidth
            onPress={() => router.push({ pathname: '/atividade/[id]/passos', params: { id: a.activityId, from: 'card' } })}
          />
          <View style={styles.secondary}>
            <Button
              variant="quiet"
              label="Concluir"
              onPress={() => router.push({ pathname: '/atividade/[id]/concluida', params: { id: a.activityId } })}
            />
            <Button variant="quiet" label="Outra ideia" onPress={() => router.push('/sofa')} />
            <Button variant="quiet" label="Sair sem concluir" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
          </View>
        </View>
      }>
      <BackBar right={bookmark.button} />
      {bookmark.error}

      <View style={styles.block}>
        <Chip label={categoryLabel[a.category]} tone="sand" />
        <AppText variant="h1">{a.title}</AppText>
        <AppText variant="body" color="textBody">
          {a.summary}
        </AppText>
        <MetaRow
          items={[
            { icon: Icons.Clock, label: formatDuration(a.durationMin) },
            { icon: Icons.Lightning, label: energyLabel[a.energy] },
            { icon: Icons.MapPin, label: environmentLabel[a.environment] },
          ]}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.block}>
        <AppText variant="h3">O que precisa</AppText>
        {a.materials.length === 0 ? (
          <CheckItem mark="dot" text="Nada especial." />
        ) : a.materials.map((m) => (
          <CheckItem key={m} text={m} />
        ))}
      </View>

      <View style={styles.block}>
        <AppText variant="h3">Passos</AppText>
        {a.steps.map((s, i) => (
          <StepItem key={s} n={i + 1} text={s} />
        ))}
      </View>

      {a.variation && (
        <View style={styles.variation}>
          <AppText variant="label">Variação</AppText>
          <AppText variant="bodySmall" color="textBody">
            {a.variation}
          </AppText>
        </View>
      )}

      <View style={styles.divider} />

      <ActivityFeedback activity={a} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { gap: space[3] },
  divider: { height: 1, backgroundColor: color.divider },
  actions: { gap: space[1] },
  secondary: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', columnGap: space[4] },
  variation: { backgroundColor: color.surface, borderRadius: radius.card, padding: space[4], gap: space[2] },
});
