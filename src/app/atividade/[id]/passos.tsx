import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type Text } from 'react-native';

import { ActivityNotFound } from '@/components/ActivityNotFound';
import { useBookmark } from '@/components/Bookmark';
import { AppText, BackBar, Button, IconButton, Icons, Screen } from '@/components/ui';
import { findActivity, type Activity } from '@/data/activities';
import { useFocusOnChange } from '@/lib/a11y';
import { backGoesToPreviousStep, isLastStep, nextStep, previousStep, stepLabel } from '@/lib/steps';
import { requestAnotherIdea } from '@/state/another-idea';
import { usePreviousStepOnBack } from '@/state/use-previous-step-on-back';
import { color, radius, space } from '@/theme';

/** Where the step view was opened from — decides where "Sair sem concluir" and "Outra ideia" go. */
type From = 'sofa' | 'card';

export default function StepsRoute() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: From }>();
  const a = findActivity(id);
  if (!a) return <ActivityNotFound />;
  return <Steps key={a.activityId} activity={a} from={from} />;
}

/**
 * Screen 08 "Atividade passo a passo" (spec §19): one step at a time, progress in words, the
 * activity's variation when it has one, and the spec §4.4 actions (Concluir · Guardar · Outra ideia ·
 * Sair sem concluir). Moving between steps is the arrows at the top (João 2026-10-05): ← is the
 * previous step (or leaves, on the first one — the same back as the system gesture, decision
 * 2026-10-03 usePreviousStepOnBack), → the next step; "Concluir" appears at the bottom on the last step.
 */
function Steps({ activity: a, from }: { activity: Activity; from: From | undefined }) {
  const total = a.steps.length;
  const [step, setStep] = useState(0);
  // A leave chosen by a button: the step-back guard is lifted first, then the navigation runs.
  const [leave, setLeave] = useState<(() => void) | null>(null);
  const stepText = useRef<Text>(null);
  const bookmark = useBookmark(a.activityId);

  usePreviousStepOnBack(backGoesToPreviousStep(step) && leave === null, () => setStep((s) => previousStep(s)));
  useFocusOnChange(stepText, step, stepLabel(step, total));

  useEffect(() => {
    leave?.();
  }, [leave]);

  /** Pops `depth` screens (this one and what opened it), or goes home when there is no history. */
  const leaveBy = (depth: number) =>
    setLeave(() => () => (router.canDismiss() ? router.dismiss(depth) : router.replace('/')));

  const next = () => {
    const n = nextStep(step, total);
    if (n === 'done') setLeave(() => () => router.replace({ pathname: '/atividade/[id]/concluida', params: { id: a.activityId } }));
    else setStep(n);
  };

  // From the sofa result: back to it (one screen). From the card: past the card too.
  const exit = () => leaveBy(from === 'card' ? 2 : 1);
  const another = () => {
    if (from === 'sofa') {
      requestAnotherIdea(); // the sofa screen shows its next idea when she lands back on it
      leaveBy(1);
    } else {
      router.push('/sofa');
    }
  };

  const last = isLastStep(step, total);
  return (
    <Screen
      key={`step-${step}`}
      edges={['top', 'bottom']}
      footer={
        <View style={styles.actions}>
          {last && <Button label="Concluir" fullWidth onPress={next} />}
          <View style={styles.secondary}>
            <Button variant="quiet" label="Outra ideia" onPress={another} />
            <Button variant="quiet" label="Sair sem concluir" onPress={exit} />
          </View>
        </View>
      }>
      <BackBar
        backLabel={step > 0 ? 'Passo anterior' : 'Voltar'}
        right={
          <>
            {bookmark.button}
            {!last && <IconButton icon={Icons.ArrowRight} label="Próximo passo" onPress={next} />}
          </>
        }
      />
      {bookmark.error}
      <View style={styles.block}>
        <AppText variant="label" color="textBody">
          {a.title}
        </AppText>
        <AppText variant="caption" color="textSubtle" accessibilityLiveRegion="polite">
          {stepLabel(step, total)}
        </AppText>
        <AppText ref={stepText} variant="bodyLarge" color="text">
          {a.steps[step]}
        </AppText>
      </View>
      {a.variation && (
        <View style={styles.variation}>
          <AppText variant="label">Variação</AppText>
          <AppText variant="bodySmall" color="textBody">
            {a.variation}
          </AppText>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { gap: space[3] },
  actions: { gap: space[1] },
  secondary: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', columnGap: space[4] },
  variation: { backgroundColor: color.surface, borderRadius: radius.card, padding: space[4], gap: space[2] },
});
