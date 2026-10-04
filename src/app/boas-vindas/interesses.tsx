import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { HelpButton } from '@/components/HelpButton';
import { AppText, BackBar, Button, OptionPill, Screen } from '@/components/ui';
import { interestHint, interestLimits, interestOptions, isValidInterestPick, type InterestId } from '@/state/app-state';
import { useOnboardingDraft } from '@/state/onboarding-draft';
import { space } from '@/theme';

/** Spec screen 04 — optional 3–5 interests. Skipping is always allowed. */
export default function Interesses() {
  const { draft, setDraft } = useOnboardingDraft();
  const picked = draft.interests;
  const count = picked.length;

  const toggle = (id: InterestId) => {
    if (picked.includes(id)) setDraft({ ...draft, interests: picked.filter((x) => x !== id) });
    else if (count < interestLimits.max) setDraft({ ...draft, interests: [...picked, id] });
  };

  const valid = isValidInterestPick(count);
  const hint = interestHint(count);

  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        <View style={styles.actions}>
          <Button label="Continuar" arrow fullWidth disabled={count === 0 || !valid} onPress={() => router.push('/boas-vindas/tempo')} />
          <Button
            variant="quiet"
            label="Pular"
            onPress={() => {
              setDraft({ ...draft, interests: [] }); // skipping never keeps a partial pick
              router.push('/boas-vindas/tempo');
            }}
          />
        </View>
      }>
      <BackBar right={<HelpButton />} />
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
  actions: { gap: space[1], alignItems: 'center' },
});
