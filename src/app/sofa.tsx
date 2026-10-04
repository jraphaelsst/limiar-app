import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, BackBar, Button, CheckItem, Chip, IconButton, Icons, MetaRow, OptionPill, Screen } from '@/components/ui';
import { categoryLabel, energyLabel, environmentLabel, formatDuration } from '@/data/activities';
import { match, presetFor, questions, shuffle, type Choices, type Preset } from '@/lib/recommend';
import { useSaved } from '@/state/app-state';
import { color, radius, space } from '@/theme';

const relaxedLabel = { company: 'companhia', place: 'ambiente', energy: 'energia', time: 'tempo', category: 'tipo de atividade' } as const;

/**
 * "Me tira do sofá" — spec §4.3. At most 4 choices (fewer when an intent preset
 * already answered one), then ONE idea at a time: Bora · Outra · Guardar.
 */
export default function Sofa() {
  const { preset } = useLocalSearchParams<{ preset?: Preset }>();
  const base = useMemo(() => presetFor(preset), [preset]);
  const pending = useMemo(() => questions.filter((q) => base.choices[q.key] === undefined), [base]);

  const [choices, setChoices] = useState<Choices>(base.choices);
  const [step, setStep] = useState(0);
  const [seed, setSeed] = useState(() => Date.now());
  const [index, setIndex] = useState(0);
  const { isSaved, toggle } = useSaved();

  const done = step >= pending.length;
  const result = useMemo(() => {
    if (!done) return null;
    const m = match(choices, base.category);
    return { ...m, items: shuffle(m.items, seed) };
  }, [done, choices, base.category, seed]);

  if (!done) {
    const q = pending[step];
    const answer = (value: string) => {
      setChoices((c) => ({ ...c, [q.key]: value }));
      setStep((s) => s + 1);
    };
    return (
      <Screen key={`q-${step}`} edges={['top', 'bottom']}>
        <BackBar />
        <View style={styles.block}>
          <AppText variant="caption" color="textSubtle" accessibilityLiveRegion="polite">
            {step + 1} de {pending.length}
          </AppText>
          <AppText variant="h1">{q.title}</AppText>
        </View>
        <View style={styles.options} accessibilityRole="radiogroup">
          {q.options.map((o) => (
            <OptionPill key={o.value} label={o.label} selected={choices[q.key] === o.value} onPress={() => answer(o.value)} />
          ))}
        </View>
        {step > 0 && <Button variant="quiet" label="Voltar à pergunta anterior" onPress={() => setStep((s) => s - 1)} />}
      </Screen>
    );
  }

  const items = result!.items;
  if (items.length === 0) {
    return (
      <Screen edges={['top', 'bottom']}>
        <BackBar />
        <AppText variant="h1">Ainda não há ideias aqui</AppText>
        <AppText variant="body" color="textBody">
          O catálogo desta versão ainda é pequeno. Tente outras escolhas.
        </AppText>
        <Button label="Escolher de novo" onPress={() => { setChoices(base.choices); setStep(0); setSeed(Date.now()); }} />
      </Screen>
    );
  }

  const a = items[index % items.length];
  const saved = isSaved(a.activityId);
  return (
    <Screen
      key={`idea-${a.activityId}`}
      edges={['top', 'bottom']}
      footer={
        <View style={styles.actions}>
          <Button label="Bora" arrow fullWidth onPress={() => router.push({ pathname: '/atividade/[id]', params: { id: a.activityId, from: 'sofa' } })} />
          <View style={styles.secondary}>
            <Button variant="quiet" label="Outra ideia" onPress={() => setIndex((i) => i + 1)} disabled={items.length < 2} />
            <Button variant="quiet" label="Escolher de novo" onPress={() => { setChoices(base.choices); setStep(0); setIndex(0); setSeed(Date.now()); }} />
          </View>
        </View>
      }>
      <BackBar right={<IconButton icon={Icons.Bookmark} label={saved ? 'Remover dos salvos' : 'Guardar'} selected={saved} onPress={() => toggle(a.activityId)} />} />
      {result!.relaxed.length > 0 && (
        <View style={styles.note}>
          <AppText variant="caption" color="text">
            Não encontramos uma ideia com todas as escolhas. Esta deixa de lado: {result!.relaxed.map((r) => relaxedLabel[r]).join(', ')}.
          </AppText>
        </View>
      )}
      <View style={styles.block}>
        <Chip label={categoryLabel[a.category]} tone="sand" />
        <AppText variant="h1">{a.title}</AppText>
        <AppText variant="body" color="textBody">
          {a.summary}
        </AppText>
      </View>
      <MetaRow
        items={[
          { icon: Icons.Clock, label: formatDuration(a.durationMin) },
          { icon: Icons.Lightning, label: energyLabel[a.energy] },
          { icon: Icons.MapPin, label: environmentLabel[a.environment] },
        ]}
      />
      <View style={styles.block}>
        <AppText variant="h3">O que precisa</AppText>
        {a.materials.length === 0 ? (
          <CheckItem mark="dot" text="Nada especial." />
        ) : a.materials.map((m) => (
          <CheckItem key={m} text={m} />
        ))}
      </View>
      {items.length > 1 && (
        <AppText variant="caption" color="textSubtle" accessibilityLiveRegion="polite">
          Ideia {(index % items.length) + 1} de {items.length}
          {index % items.length === items.length - 1 ? ' · a próxima recomeça a lista' : ''}
        </AppText>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { gap: space[3] },
  options: { gap: space[3] },
  actions: { gap: space[1] },
  secondary: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', columnGap: space[4] },
  note: { backgroundColor: color.tintWarm, borderRadius: radius.tile, padding: space[3] },
});
