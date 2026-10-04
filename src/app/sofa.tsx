import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, type Text } from 'react-native';

import { useBookmark } from '@/components/Bookmark';
import { AppText, BackBar, Button, CheckItem, Chip, Icons, MetaRow, OptionPill, Screen } from '@/components/ui';
import { categoryLabel, energyLabel, environmentLabel, formatDuration } from '@/data/activities';
import { useFocusOnChange } from '@/lib/a11y';
import { presetFor, questions, recommend, type Choices, type Preset } from '@/lib/recommend';
import { takeAnotherIdeaRequest } from '@/state/another-idea';
import { useAppState } from '@/state/app-state';
import { usePreviousStepOnBack } from '@/state/use-previous-step-on-back';
import { color, radius, space } from '@/theme';

const relaxedLabel = { company: 'companhia', place: 'ambiente', energy: 'energia', time: 'tempo', category: 'tipo de atividade' } as const;

/**
 * "Me tira do sofá" — spec §4.3. At most 4 choices (fewer when an intent preset
 * already answered one), then ONE idea at a time: Bora · Outra · Guardar.
 * "Bora" opens the step view (screen 08). "Outra" never penalises (spec §20): nothing is
 * recorded about the skipped idea. Her §6 feedback orders and filters the ideas
 * (src/lib/recommend.ts), read once per round so the list does not reshuffle under her.
 */
export default function Sofa() {
  const { preset } = useLocalSearchParams<{ preset?: Preset }>();
  const base = useMemo(() => presetFor(preset), [preset]);
  const pending = useMemo(() => questions.filter((q) => base.choices[q.key] === undefined), [base]);

  const [choices, setChoices] = useState<Choices>(base.choices);
  const [step, setStepState] = useState(0);
  // The question a tap belongs to: a second tap before the re-render is ignored, not taken as the next answer.
  const stepRef = useRef(0);
  const setStep = useCallback((n: number) => {
    stepRef.current = n;
    setStepState(n);
  }, []);
  const h1 = useRef<Text>(null);
  const [seed, setSeed] = useState(() => Date.now());
  const [index, setIndex] = useState(0);
  const { feedback } = useAppState();
  // The answers this round of ideas was built with — taken when the questions are answered.
  const [roundFeedback, setRoundFeedback] = useState(feedback);
  // A stale "outra ideia" request from a sofa screen that is gone must not skip this one's first idea.
  useState(() => takeAnotherIdeaRequest());

  const done = step >= pending.length;

  // Decision 2026-10-03 (board nnl-hardware-back): while answering, "back" means the previous
  // question — see usePreviousStepOnBack for which back paths it covers. At step 0 and on the
  // result screen, back leaves normally.
  usePreviousStepOnBack(!done && step > 0, () => setStep(Math.max(0, stepRef.current - 1)));
  useFocusOnChange(h1, done ? `idea-${index}-${seed}` : step, done ? undefined : `${step + 1} de ${pending.length}`);
  const result = useMemo(
    () => (done ? recommend(choices, base.category, roundFeedback, seed) : null),
    [done, choices, base.category, roundFeedback, seed],
  );
  const current = result && result.items.length > 0 ? result.items[index % result.items.length] : undefined;
  const bookmark = useBookmark(current?.activityId ?? '');
  const { reset: resetBookmark } = bookmark;

  const nextIdea = useCallback(() => {
    resetBookmark();
    setIndex((i) => i + 1);
  }, [resetBookmark]);

  // "Outra ideia" pressed in the step view she opened from here: show the next idea on return.
  useFocusEffect(
    useCallback(() => {
      if (done && takeAnotherIdeaRequest()) nextIdea();
    }, [done, nextIdea]),
  );

  const restart = () => {
    resetBookmark();
    setChoices(base.choices);
    setStep(0);
    setIndex(0);
    setSeed(Date.now());
    setRoundFeedback(feedback);
  };

  if (!done) {
    const q = pending[step];
    const answer = (value: string) => {
      if (stepRef.current !== step) return; // stale double-tap
      setChoices((c) => ({ ...c, [q.key]: value }));
      setRoundFeedback(feedback);
      setStep(step + 1);
    };
    return (
      <Screen key={`q-${step}`} edges={['top', 'bottom']}>
        <BackBar />
        <View style={styles.block}>
          <AppText variant="caption" color="textSubtle" accessibilityLiveRegion="polite">
            {step + 1} de {pending.length}
          </AppText>
          <AppText ref={h1} variant="h1">
            {q.title}
          </AppText>
        </View>
        <View style={styles.options} accessibilityRole="radiogroup" accessibilityLabel={q.title}>
          {q.options.map((o) => (
            <OptionPill key={o.value} label={o.label} selected={choices[q.key] === o.value} onPress={() => answer(o.value)} />
          ))}
        </View>
        {step > 0 && <Button variant="quiet" label="Voltar à pergunta anterior" onPress={() => setStep(step - 1)} />}
      </Screen>
    );
  }

  const items = result!.items;
  if (!current) {
    const someUnsuited = Object.values(roundFeedback).includes('nao-combina');
    return (
      <Screen edges={['top', 'bottom']}>
        <BackBar />
        <AppText variant="h1">Ainda não há ideias aqui</AppText>
        <AppText variant="body" color="textBody">
          O catálogo desta versão ainda é pequeno. Tente outras escolhas.
          {someUnsuited ? ' As atividades que você marcou como “não combina comigo” ficam de fora; dá para mudar isso em Preferências.' : ''}
        </AppText>
        <Button label="Escolher de novo" onPress={restart} />
      </Screen>
    );
  }

  const a = current;
  return (
    <Screen
      key={`idea-${a.activityId}`}
      edges={['top', 'bottom']}
      footer={
        <View style={styles.actions}>
          <Button
            label="Bora"
            arrow
            fullWidth
            onPress={() => router.push({ pathname: '/atividade/[id]/passos', params: { id: a.activityId, from: 'sofa' } })}
          />
          <View style={styles.secondary}>
            <Button variant="quiet" label="Outra ideia" onPress={nextIdea} disabled={items.length < 2} />
            <Button variant="quiet" label="Escolher de novo" onPress={restart} />
          </View>
        </View>
      }>
      <BackBar right={bookmark.button} />
      {bookmark.error}
      {result!.relaxed.length > 0 && (
        <View style={styles.note}>
          <AppText variant="caption" color="text">
            Não encontramos uma ideia com todas as escolhas. Esta deixa de lado: {result!.relaxed.map((r) => relaxedLabel[r]).join(', ')}.
          </AppText>
        </View>
      )}
      <View style={styles.block}>
        <Chip label={categoryLabel[a.category]} tone="sand" />
        <AppText ref={h1} variant="h1">
          {a.title}
        </AppText>
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
