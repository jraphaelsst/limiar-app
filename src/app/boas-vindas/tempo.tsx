import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { HelpButton } from '@/components/HelpButton';
import { AppText, BackBar, Button, OptionPill, Screen } from '@/components/ui';
import type { TimeChoice } from '@/lib/recommend';
import { timeOptions, useAppState } from '@/state/app-state';
import { useOnboardingDraft } from '@/state/onboarding-draft';
import { space } from '@/theme';

/**
 * Last onboarding step. The notifications step (spec §4.1.6) is left out of
 * Phase 0: there are no notifications yet, and a preference that does nothing
 * would mislead.
 */
export default function Tempo() {
  const { draft, setDraft } = useOnboardingDraft();
  const { completeOnboarding } = useAppState();
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  const finish = async (availability: TimeChoice | undefined) => {
    setSaving(true);
    setFailed(false);
    try {
      await completeOnboarding({ interests: draft.interests, availability });
      router.replace('/');
    } catch (e) {
      console.error('[onboarding] could not save preferences', e);
      setFailed(true);
      setSaving(false);
    }
  };

  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        <View style={styles.actions}>
          <Button label="Concluir" arrow fullWidth disabled={!draft.availability || saving} onPress={() => finish(draft.availability)} />
          <Button variant="quiet" label="Pular" disabled={saving} onPress={() => finish(undefined)} />
        </View>
      }>
      <BackBar right={<HelpButton />} />
      <AppText variant="h1">Quanto tempo livre costuma aparecer?</AppText>
      <View style={styles.options} accessibilityRole="radiogroup">
        {timeOptions.map((o) => (
          <OptionPill
            key={o.value}
            label={o.label}
            selected={draft.availability === o.value}
            onPress={() => setDraft({ ...draft, availability: o.value })}
          />
        ))}
      </View>
      {failed && (
        <AppText variant="label" color="error" accessibilityLiveRegion="assertive">
          Não foi possível salvar suas escolhas neste aparelho. Tente de novo.
        </AppText>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  options: { gap: space[3] },
  actions: { gap: space[1], alignItems: 'center' },
});
