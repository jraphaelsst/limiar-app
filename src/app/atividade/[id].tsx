import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, BackBar, Button, CheckItem, Chip, IconButton, Icons, MetaRow, Screen, StepItem } from '@/components/ui';
import { categoryLabel, energyLabel, environmentLabel, findActivity, formatDuration } from '@/data/activities';
import { useSaved } from '@/state/app-state';
import { color, radius, space } from '@/theme';

/** Activity card, full — spec §4.4: title · time · materials · 3–5 steps · variation · Concluir/Guardar/Outra/Sair. */
export default function ActivityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const a = findActivity(id);
  const { isSaved, toggle } = useSaved();
  const [finished, setFinished] = useState(false);

  if (!a) {
    return (
      <Screen edges={['top', 'bottom']}>
        <BackBar />
        <AppText variant="h1">Atividade não encontrada</AppText>
        <AppText variant="body" color="textBody">
          Ela pode ter sido retirada do catálogo.
        </AppText>
        <Button label="Ver atividades" onPress={() => router.replace('/atividades')} />
      </Screen>
    );
  }

  const saved = isSaved(a.activityId);
  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        finished ? (
          <Button label="Voltar ao início" fullWidth onPress={() => router.dismissTo('/')} />
        ) : (
          <View style={styles.actions}>
            <Button label="Concluir" fullWidth onPress={() => setFinished(true)} />
            <View style={styles.secondary}>
              <Button variant="quiet" label="Outra ideia" onPress={() => router.replace('/sofa')} />
              <Button variant="quiet" label="Sair sem concluir" onPress={() => router.back()} />
            </View>
          </View>
        )
      }>
      <BackBar right={<IconButton icon={Icons.Bookmark} label={saved ? 'Remover dos salvos' : 'Guardar'} selected={saved} onPress={() => toggle(a.activityId)} />} />

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
        {a.materials.map((m) => (
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

      {finished && (
        <View style={styles.variation} accessibilityLiveRegion="polite">
          <AppText variant="h3">Feito.</AppText>
          <AppText variant="bodySmall" color="textBody">
            {saved ? 'A atividade continua nos seus salvos.' : 'Se quiser repetir outro dia, guarde no marcador acima.'}
          </AppText>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { gap: space[3] },
  divider: { height: 1, backgroundColor: color.divider },
  actions: { gap: space[1] },
  secondary: { flexDirection: 'row', justifyContent: 'space-between' },
  variation: { backgroundColor: color.surface, borderRadius: radius.card, padding: space[4], gap: space[2] },
});
