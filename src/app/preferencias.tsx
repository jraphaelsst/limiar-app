import { router, useNavigation } from 'expo-router';
import { usePreventRemove, type NavigationAction } from 'expo-router/react-navigation';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, BackBar, Button, OptionPill, Screen } from '@/components/ui';
import { announce } from '@/lib/a11y';
import type { TimeChoice } from '@/lib/recommend';
import {
  interestHint,
  interestLimits,
  interestOptions,
  isValidInterestPick,
  timeOptions,
  useAppState,
  type InterestId,
} from '@/state/app-state';
import { space } from '@/theme';

const unsavedText = 'Suas mudanças ainda não foram salvas.';
const failedText = 'Não foi possível salvar neste aparelho. Tente de novo.';
const timeQuestion = 'Quanto tempo livre costuma aparecer?';

/**
 * Spec screen 16 — change the onboarding choices later (spec §6: only what she
 * chose explicitly). Same options and 3–5-or-none rule as onboarding; nothing
 * is written until "Salvar". Leaving with unsaved changes (any back path) asks
 * first, in the screen — RN `Alert` does nothing on web.
 */
export default function Preferencias() {
  const { prefs, updatePrefs } = useAppState();
  const [interests, setInterests] = useState<InterestId[]>(prefs?.interests ?? []);
  const [availability, setAvailability] = useState<TimeChoice | undefined>(prefs?.availability);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pendingLeave, setPendingLeave] = useState<NavigationAction | null>(null);
  const navigation = useNavigation();

  const count = interests.length;
  const valid = isValidInterestPick(count);
  const changed =
    availability !== prefs?.availability ||
    count !== (prefs?.interests.length ?? 0) ||
    interests.some((id) => !prefs?.interests.includes(id));

  // Shown whatever else is on screen (including after a failed save): a leave attempt always gets an answer.
  usePreventRemove(changed && !saved, ({ data }) => {
    setPendingLeave(data.action);
    announce(unsavedText);
  });

  // Leave only after the re-render that lifts the guard above (prefs now equal the screen).
  useEffect(() => {
    if (!saved || changed) return;
    if (router.canGoBack()) router.back();
    else router.replace('/perfil');
  }, [saved, changed]);

  const toggle = (id: InterestId) => {
    setFailed(false);
    if (interests.includes(id)) setInterests(interests.filter((x) => x !== id));
    else if (count < interestLimits.max) setInterests([...interests, id]);
  };

  const pickTime = (t: TimeChoice | undefined) => {
    setFailed(false);
    setAvailability(t);
  };

  const submit = async () => {
    setSaving(true);
    setFailed(false);
    setPendingLeave(null);
    try {
      await updatePrefs({ interests, availability });
      setSaved(true);
    } catch (e) {
      console.error('[preferencias] could not save preferences', e);
      setFailed(true);
      setSaving(false);
      announce(failedText);
    }
  };

  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        <View style={styles.actions}>
          {pendingLeave && (
            <View style={styles.confirm} accessibilityLiveRegion="polite">
              <AppText variant="label">{unsavedText}</AppText>
              <View style={styles.row}>
                <Button variant="quiet" label="Sair sem salvar" onPress={() => navigation.dispatch(pendingLeave)} />
                <Button variant="quiet" label="Continuar aqui" onPress={() => setPendingLeave(null)} />
              </View>
            </View>
          )}
          {failed && (
            <AppText variant="label" color="error" accessibilityLiveRegion="assertive">
              {failedText}
            </AppText>
          )}
          <Button label="Salvar" fullWidth disabled={!valid || !changed || saving} onPress={submit} />
        </View>
      }>
      <BackBar />
      <View style={styles.block}>
        <AppText variant="h1">Preferências</AppText>
        <AppText variant="body" color="textBody">
          Servem só para sugerir atividades e ficam neste aparelho. Mude quando quiser.
        </AppText>
      </View>

      <View style={styles.block}>
        <AppText variant="h3">Do que você tem curiosidade?</AppText>
        <AppText variant="caption" color="textSubtle" accessibilityLiveRegion="polite">
          {interestHint(count)}
        </AppText>
        <View style={styles.grid}>
          {interestOptions.map((o) => (
            <OptionPill key={o.id} multiple label={o.label} selected={interests.includes(o.id)} onPress={() => toggle(o.id)} />
          ))}
        </View>
        {count > 0 && (
          <View style={styles.start}>
            <Button variant="quiet" label="Desmarcar todos" onPress={() => { setFailed(false); setInterests([]); }} />
          </View>
        )}
      </View>

      <View style={styles.block}>
        <AppText variant="h3">{timeQuestion}</AppText>
        <View style={styles.options} accessibilityRole="radiogroup" accessibilityLabel={timeQuestion}>
          {timeOptions.map((o) => (
            <OptionPill key={o.value} label={o.label} selected={availability === o.value} onPress={() => pickTime(o.value)} />
          ))}
          <OptionPill label="Sem preferência" selected={availability === undefined} onPress={() => pickTime(undefined)} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { gap: space[3] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  options: { gap: space[3] },
  start: { alignItems: 'flex-start' },
  actions: { gap: space[2], alignItems: 'center' },
  confirm: { alignSelf: 'stretch', alignItems: 'center', gap: space[1] },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: space[4] },
});
