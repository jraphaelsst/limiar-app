import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, BackBar, Button, OptionPill, Screen } from '@/components/ui';
import { interestOptions, type InterestId } from '@/state/app-state';
import { useOnboardingDraft } from '@/state/onboarding-draft';
import { space } from '@/theme';

const MIN = 3;
const MAX = 5;

/** Spec screen 04 — optional 3–5 interests. Skipping is always allowed. */
export default function Interesses() {
  const { draft, setDraft } = useOnboardingDraft();
  const picked = draft.interests;
  const count = picked.length;

  const toggle = (id: InterestId) => {
    if (picked.includes(id)) setDraft({ ...draft, interests: picked.filter((x) => x !== id) });
    else if (count < MAX) setDraft({ ...draft, interests: [...picked, id] });
  };

  const valid = count === 0 || count >= MIN;
  const hint =
    count === 0 ? `Escolha de ${MIN} a ${MAX}, ou pule.` : count < MIN ? `Escolha mais ${MIN - count}.` : count === MAX ? 'Você escolheu o máximo.' : `${count} escolhidos.`;

  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        <Button
          label={count === 0 ? 'Pular' : 'Continuar'}
          arrow
          fullWidth
          disabled={!valid}
          onPress={() => router.push('/boas-vindas/tempo')}
        />
      }>
      <BackBar />
      <View style={styles.intro}>
        <AppText variant="h1">Do que você tem curiosidade?</AppText>
        <AppText variant="caption" color="textSubtle" accessibilityLiveRegion="polite">
          {hint}
        </AppText>
      </View>
      <View style={styles.grid}>
        {interestOptions.map((o) => (
          <OptionPill key={o.id} multiple label={o.label} selected={picked.includes(o.id)} onPress={() => toggle(o.id)} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: space[2] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
});
