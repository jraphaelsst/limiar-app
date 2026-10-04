import { router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View, type Text } from 'react-native';

import { HelpButton } from '@/components/HelpButton';
import { AppText, BackBar, Button, CheckItem, Chip, ListRow, OptionPill, Screen } from '@/components/ui';
import { reflectionQuestion, roleCards, stances, type Stance } from '@/data/games';
import { useFocusOnChange } from '@/lib/a11y';
import { usePreviousStepOnBack } from '@/state/use-previous-step-on-back';
import { color, radius, space } from '@/theme';

/**
 * Jogo B — "Isso ainda é meu?" (spec §4.5, screen 12). One card per screen,
 * classified in the four spec categories or skipped. The summary only lists the
 * cards as classified — no interpretation of family relationships. Optionally
 * ONE card gets ONE reflection question. Nothing is typed and nothing is kept
 * (spec §6): the answers live only in this screen's memory.
 */
export default function IssoAindaEMeu() {
  const [step, setStepState] = useState(-1); // -1 intro · 0..n-1 cards · n summary
  const [answers, setAnswers] = useState<Readonly<Record<string, Stance | null>>>({});
  const [reflectOn, setReflectOn] = useState<string | null>(null);
  // The step a tap belongs to: a second tap on the same card (before the re-render) is ignored.
  const stepRef = useRef(-1);
  const setStep = useCallback((n: number) => {
    stepRef.current = n;
    setStepState(n);
  }, []);
  const h1 = useRef<Text>(null);

  const total = roleCards.length;
  const inCards = step >= 0 && step < total;
  const goBack = useCallback(() => setStep(stepRef.current - 1), [setStep]);
  const closeReflection = useCallback(() => setReflectOn(null), []);
  // Same rule as Me tira do sofá (decision nnl-hardware-back), on every back path: with the
  // reflection open, back closes it; during cards (after the first), back is the previous card.
  // On the first card, the intro and the summary, back leaves normally.
  usePreviousStepOnBack(reflectOn !== null || (inCards && step > 0), () => (reflectOn !== null ? closeReflection() : goBack()));
  useFocusOnChange(h1, reflectOn ? `reflect-${reflectOn}` : step, inCards ? `Cartão ${step + 1} de ${total}` : undefined);

  const restart = () => {
    setAnswers({});
    setReflectOn(null);
    setStep(0);
  };
  const toGames = () => (router.canGoBack() ? router.back() : router.replace('/jogos'));

  if (step < 0) {
    return (
      <Screen edges={['top', 'bottom']} footer={<Button label="Começar" arrow fullWidth onPress={() => setStep(0)} />}>
        <BackBar right={<HelpButton />} />
        <View style={styles.block}>
          <AppText ref={h1} variant="h1">
            Isso ainda é meu?
          </AppText>
          <AppText variant="body" color="textBody">
            {total} cartões com hábitos e papéis do dia a dia. Para cada um, escolha o que descreve melhor como ele está hoje. O
            que não faz parte da sua rotina pode ser pulado.
          </AppText>
          <AppText variant="body" color="textBody">
            Nada deste jogo fica guardado.
          </AppText>
        </View>
      </Screen>
    );
  }

  if (inCards) {
    const c = roleCards[step];
    const answer = (value: Stance | null) => {
      if (stepRef.current !== step) return; // stale double-tap
      setAnswers((a) => ({ ...a, [c.id]: value }));
      setStep(step + 1);
    };
    return (
      <Screen key={`card-${step}`} edges={['top', 'bottom']}>
        <BackBar right={<HelpButton />} />
        <AppText variant="caption" color="textSubtle" accessibilityLiveRegion="polite">
          Cartão {step + 1} de {total}
        </AppText>
        <View style={styles.card}>
          <AppText ref={h1} variant="h2">
            {c.text}
          </AppText>
        </View>
        <View style={styles.options} accessibilityRole="radiogroup" accessibilityLabel="Como isso está hoje?">
          {stances.map((s) => (
            <OptionPill key={s.id} label={s.label} selected={answers[c.id] === s.id} onPress={() => answer(s.id)} />
          ))}
        </View>
        <View style={styles.secondary}>
          <Button variant="quiet" label="Pular este cartão" onPress={() => answer(null)} />
          {step > 0 && <Button variant="quiet" label="Voltar ao cartão anterior" onPress={goBack} />}
        </View>
      </Screen>
    );
  }

  const classified = roleCards.filter((c) => answers[c.id]);

  if (reflectOn) {
    const c = roleCards.find((x) => x.id === reflectOn)!;
    const stance = answers[c.id]!;
    return (
      <Screen
        key={`reflect-${c.id}`}
        edges={['top', 'bottom']}
        footer={
          <View style={styles.actions}>
            <Button label="Me tira do sofá" arrow fullWidth onPress={() => router.push('/sofa')} />
            <View style={styles.secondary}>
              <Button variant="quiet" label="Escolher outro cartão" onPress={closeReflection} />
              <Button variant="quiet" label="Voltar aos jogos" onPress={toGames} />
            </View>
          </View>
        }>
        <BackBar right={<HelpButton />} />
        <View style={styles.block}>
          <Chip label={stances.find((s) => s.id === stance)!.label} tone="sand" />
          <AppText ref={h1} variant="h1">
            {c.text}
          </AppText>
          <AppText variant="body" color="text">
            {reflectionQuestion[stance]}
          </AppText>
        </View>
        <AppText variant="caption" color="textSubtle">
          É só uma pergunta para levar com você. Não precisa responder aqui.
        </AppText>
      </Screen>
    );
  }

  return (
    <Screen key="summary" edges={['top', 'bottom']}>
      <BackBar right={<HelpButton />} />
      <View style={styles.block}>
        <AppText ref={h1} variant="h1">
          Seus cartões hoje
        </AppText>
        <AppText variant="body" color="textBody">
          {classified.length === 0
            ? 'Todos os cartões foram pulados. Dá para jogar de novo quando quiser.'
            : 'Do jeito que você classificou. Ao sair desta tela, nada fica guardado.'}
        </AppText>
      </View>

      {stances.map((s) => {
        const group = classified.filter((c) => answers[c.id] === s.id);
        if (group.length === 0) return null;
        return (
          <View key={s.id} style={styles.block}>
            <AppText variant="h3">{s.label}</AppText>
            {group.map((c) => (
              <CheckItem key={c.id} mark="dot" text={c.text} />
            ))}
          </View>
        );
      })}

      {classified.length > 0 && (
        <View style={styles.block}>
          <AppText variant="h3">Quer pensar sobre um deles?</AppText>
          <AppText variant="bodySmall" color="textBody">
            Escolha um cartão para ver uma pergunta curta sobre ele. É opcional.
          </AppText>
          <View style={styles.list}>
            {classified.map((c) => (
              <ListRow key={c.id} title={c.text} onPress={() => setReflectOn(c.id)} />
            ))}
          </View>
        </View>
      )}

      <View style={styles.secondary}>
        <Button variant="quiet" label="Jogar de novo" onPress={restart} />
        <Button variant="quiet" label="Voltar aos jogos" onPress={toGames} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { gap: space[3] },
  options: { gap: space[3] },
  list: { gap: space[2] },
  actions: { gap: space[1] },
  secondary: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', columnGap: space[4] },
  card: { backgroundColor: color.tintWarm, borderRadius: radius.panel, padding: space[6] },
});
