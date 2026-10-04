import { router } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, type Text } from 'react-native';

import { HelpButton } from '@/components/HelpButton';
import { AppText, BackBar, Button, CheckItem, OptionPill, Screen } from '@/components/ui';
import { directionLabel, gameAPattern, pairs, patternSentence, type GameAChoices } from '@/data/games';
import { announce, useFocusOnChange } from '@/lib/a11y';
import { useAppState } from '@/state/app-state';
import { usePreviousStepOnBack } from '@/state/use-previous-step-on-back';
import { space } from '@/theme';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

const saveText = {
  saved: 'Guardado só neste aparelho. Dá para apagar na lista de jogos.',
  error: 'Não foi possível guardar agora. Tente de novo.',
  idle: 'Este resultado some quando você sair, a menos que escolha guardar.',
} as const;

/**
 * Jogo A — "Ainda gosto disso?" (spec §4.5, screen 11). One pair per screen,
 * skippable. The end shows observable patterns in plain words — no profile, no
 * score — and is temporary unless the user taps "Guardar este resultado".
 */
export default function AindaGosto() {
  const { saveGameAResult } = useAppState();
  const [step, setStepState] = useState(-1); // -1 intro · 0..n-1 rounds · n result
  const [choices, setChoices] = useState<GameAChoices>({});
  const [saveState, setSaveState] = useState<SaveState>('idle');
  // The step a tap belongs to: a second tap on the same round (before the re-render) is ignored
  // instead of recording an answer for a round she never saw.
  const stepRef = useRef(-1);
  const setStep = useCallback((n: number) => {
    stepRef.current = n;
    setStepState(n);
  }, []);
  const h1 = useRef<Text>(null);

  const total = pairs.length;
  const inRounds = step >= 0 && step < total;
  const goBack = useCallback(() => setStep(stepRef.current - 1), [setStep]);
  // Same rule as Me tira do sofá (decision nnl-hardware-back): during rounds, back goes to the
  // previous round. At round 1, on the intro and on the result, back leaves normally.
  usePreviousStepOnBack(inRounds && step > 0, goBack);
  useFocusOnChange(h1, step, inRounds ? `Rodada ${step + 1} de ${total}` : undefined);

  const result = useMemo(() => (step >= total ? gameAPattern(choices) : null), [step, total, choices]);

  const restart = () => {
    setChoices({});
    setSaveState('idle');
    setStep(0);
  };

  if (step < 0) {
    return (
      <Screen edges={['top', 'bottom']} footer={<Button label="Começar" arrow fullWidth onPress={() => setStep(0)} />}>
        <BackBar right={<HelpButton />} />
        <View style={styles.block}>
          <AppText ref={h1} variant="h1">Ainda gosto disso?</AppText>
          <AppText variant="body" color="textBody">
            {total} rodadas rápidas, cada uma com duas opções. Escolha a que combina mais com você hoje, ou pule.
          </AppText>
          <AppText variant="body" color="textBody">
            No fim aparecem os temas que mais se repetiram. Nada fica guardado, a menos que você escolha guardar.
          </AppText>
        </View>
      </Screen>
    );
  }

  if (inRounds) {
    const p = pairs[step];
    const answer = (value: string | null) => {
      if (stepRef.current !== step) return; // stale double-tap
      setChoices((c) => ({ ...c, [p.id]: value }));
      setStep(step + 1);
    };
    return (
      <Screen key={`round-${step}`} edges={['top', 'bottom']}>
        <BackBar right={<HelpButton />} />
        <View style={styles.block}>
          <AppText variant="caption" color="textSubtle" accessibilityLiveRegion="polite">
            Rodada {step + 1} de {total}
          </AppText>
          <AppText ref={h1} variant="h1">
            Qual combina mais com você hoje?
          </AppText>
        </View>
        <View style={styles.options} accessibilityRole="radiogroup" accessibilityLabel="Qual combina mais com você hoje?">
          {p.options.map((o) => (
            <OptionPill key={o.id} label={o.label} selected={choices[p.id] === o.id} onPress={() => answer(o.id)} />
          ))}
        </View>
        <View style={styles.secondary}>
          <Button variant="quiet" label="Pular" onPress={() => answer(null)} />
          {step > 0 && <Button variant="quiet" label="Voltar à rodada anterior" onPress={goBack} />}
        </View>
      </Screen>
    );
  }

  const r = result!;
  const nothingPicked = r.picked.length === 0;
  const save = () => {
    setSaveState('saving');
    saveGameAResult(choices)
      .then(() => {
        setSaveState('saved');
        announce(saveText.saved);
      })
      .catch((e) => {
        console.error('[storage] could not save the game result', e);
        setSaveState('error');
        announce(saveText.error);
      });
  };

  return (
    <Screen
      key="result"
      edges={['top', 'bottom']}
      footer={
        <View style={styles.actions}>
          <Button
            label={r.preset ? directionLabel[r.preset] : 'Me tira do sofá'}
            arrow
            fullWidth
            onPress={() => router.push(r.preset ? { pathname: '/sofa', params: { preset: r.preset } } : '/sofa')}
          />
          <View style={styles.secondary}>
            {!nothingPicked && (
              <Button
                variant="quiet"
                label={saveState === 'saved' ? 'Resultado guardado' : 'Guardar este resultado'}
                disabled={saveState === 'saving' || saveState === 'saved'}
                onPress={save}
              />
            )}
            <Button variant="quiet" label="Jogar de novo" onPress={restart} />
          </View>
        </View>
      }>
      <BackBar right={<HelpButton />} />
      <View style={styles.block}>
        <AppText ref={h1} variant="h1">
          O que apareceu hoje
        </AppText>
        <AppText variant="body" color="textBody">
          {nothingPicked
            ? 'Todas as rodadas foram puladas. Dá para jogar de novo quando quiser, ou procurar uma atividade agora.'
            : r.themes.length > 0
              ? `${patternSentence(r.themes)} ${r.preset ? 'Quer explorar atividades nessa direção?' : 'Quer procurar uma atividade para agora?'}`
              : 'As escolhas de hoje ficaram variadas, sem um tema que se repetisse. Quer procurar uma atividade para agora?'}
        </AppText>
      </View>
      {!nothingPicked && (
        <View style={styles.block}>
          <AppText variant="h3">Suas escolhas</AppText>
          {r.picked.map((label) => (
            <CheckItem key={label} mark="dot" text={label} />
          ))}
        </View>
      )}
      {!nothingPicked && (
        <AppText
          variant="caption"
          color={saveState === 'error' ? 'error' : 'textSubtle'}
          accessibilityLiveRegion={saveState === 'error' ? 'assertive' : 'polite'}>
          {saveText[saveState === 'saving' ? 'idle' : saveState]}
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
});
