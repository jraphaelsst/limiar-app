import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ActivityRow } from '@/components/ActivityRow';
import { HelpButton } from '@/components/HelpButton';
import { AppText, BackBar, Button, ListRow, Screen, SectionHeader } from '@/components/ui';
import { activitiesForWorld, gamesForWorld, themesForWorld, worldRoute } from '@/data/world-content';
import { findWorld, type World } from '@/data/worlds';
import { color, radius, space } from '@/theme';

export default function MundoRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const world = findWorld(id);
  if (!world) return <WorldNotFound />;
  const route = worldRoute(world.id);
  // "Experimenta isso" IS the catalog screen (worldRoute) — an old or typed link lands there too.
  if (typeof route === 'string') return <Redirect href={route} />;
  return <WorldScreen world={world} />;
}

/**
 * Screen 10 "Explorar mundos" (spec §19), one world of §3.1: its activities first (spec §4.7 keeps the
 * reflection less prominent than activities), then its games and reflection themes. Only real content is
 * linked; while a world has no tagged activities yet, it says so and offers the full catalog.
 */
function WorldScreen({ world }: { world: World }) {
  const items = activitiesForWorld(world.id);
  const games = gamesForWorld(world.id);
  const themes = themesForWorld(world.id);

  return (
    <Screen edges={['top', 'bottom']}>
      <BackBar right={<HelpButton />} />
      <View style={styles.intro}>
        <AppText variant="h1">{world.title}</AppText>
        <AppText variant="body" color="textBody">
          {world.scope}
        </AppText>
        {world.note && (
          <View style={styles.note}>
            {/* ink on the warm tint, as the reflection lentes — stone on a tint is the low-contrast pair */}
            <AppText variant="body" color="text">
              {world.note}
            </AppText>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <SectionHeader title="Atividades" />
        {items.length > 0 ? (
          <View style={styles.list}>
            {items.map((a) => (
              <ActivityRow key={a.activityId} activity={a} />
            ))}
          </View>
        ) : (
          <View style={styles.empty}>
            <AppText variant="body" color="textBody">
              As atividades deste mundo ainda estão sendo preparadas.
            </AppText>
            <Button variant="quiet" label="Ver todas as atividades" onPress={() => router.push('/atividades')} />
          </View>
        )}
      </View>

      {games.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Jogos" />
          <View style={styles.list}>
            {games.map((g) => (
              <ListRow key={g.id} title={g.title} subtitle={g.description} onPress={() => router.push(g.href)} />
            ))}
          </View>
        </View>
      )}

      {themes.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Para pensar" />
          <AppText variant="bodySmall" color="textBody">
            Cartões com perguntas para pensar no papel ou de cabeça.
          </AppText>
          <View style={styles.list}>
            {themes.map((t) => (
              <ListRow key={t.id} title={t.label} onPress={() => router.push({ pathname: '/reflexao/[tema]', params: { tema: t.id } })} />
            ))}
          </View>
        </View>
      )}
    </Screen>
  );
}

function WorldNotFound() {
  return (
    <Screen edges={['top', 'bottom']}>
      <BackBar />
      <AppText variant="h1">Mundo não encontrado</AppText>
      <AppText variant="body" color="textBody">
        Este mundo não existe nesta versão do app.
      </AppText>
      <Button label="Ver os mundos" onPress={() => router.replace('/explorar')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: space[3] },
  note: { backgroundColor: color.tintWarm, borderRadius: radius.tile, padding: space[4] },
  section: { gap: space[3] },
  list: { gap: space[2] },
  empty: { gap: space[1], alignItems: 'flex-start' },
});
