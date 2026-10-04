import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type Text } from 'react-native';

import { useReflectionBookmark } from '@/components/Bookmark';
import { HelpLink } from '@/components/HelpLink';
import { AppText, BackBar, Button, CheckItem, Chip, Screen } from '@/components/ui';
import { findTheme, reflectionsFor, type Reflection, type Theme } from '@/data/reflexoes';
import { useFocusOnChange } from '@/lib/a11y';
import {
  backGoesToPreviousCard,
  cardLabel,
  choiceLabel,
  choicesFor,
  nextCard,
  previousCard,
  startIndex,
  type ReflectionChoice,
} from '@/lib/reflexao';
import { usePreviousStepOnBack } from '@/state/use-previous-step-on-back';
import { color, radius, space } from '@/theme';

export default function ReflexaoRoute() {
  const { tema, cartao } = useLocalSearchParams<{ tema: string; cartao?: string }>();
  const theme = findTheme(tema);
  const cards = theme ? reflectionsFor(theme.id) : [];
  if (!theme || cards.length === 0) return <ThemeNotFound />;
  return <Cards key={`${theme.id}-${cartao ?? ''}`} theme={theme} cards={cards} start={startIndex(cartao, cards.length)} />;
}

/**
 * Screen 14 "Pergunta aberta — reflexão" (spec §19, §4.7), wave 2 without typing: ONE curated card
 * at a time — a short acknowledgement + two lentes to think about on paper or in her head — then at
 * most two choices (spec §20). Nothing is typed, sent or stored except, if she taps the bookmark,
 * the card's id. Back after the card she opened goes to the previous card (decision 2026-10-03, one
 * mechanism app-wide: usePreviousStepOnBack).
 */
function Cards({ theme, cards, start }: { theme: Theme; cards: readonly Reflection[]; start: number }) {
  const total = cards.length;
  const [index, setIndexState] = useState(start);
  // The card a tap belongs to: a second tap before the re-render is not taken as "the next card".
  const indexRef = useRef(start);
  // A leave chosen by a button: the card-back guard is lifted first, then the navigation runs
  // (the step view's pattern — agents/mobile-dev LEARNINGS 2026-10-04).
  const [leave, setLeave] = useState<(() => void) | null>(null);
  const h1 = useRef<Text>(null);
  const card = cards[index];
  const bookmark = useReflectionBookmark(card.reflectionId);
  const { reset: resetBookmark } = bookmark;

  const go = useCallback(
    (n: number) => {
      resetBookmark();
      indexRef.current = n;
      setIndexState(n);
    },
    [resetBookmark],
  );

  usePreviousStepOnBack(backGoesToPreviousCard(index, start) && leave === null, () => go(previousCard(indexRef.current, start)));
  useFocusOnChange(h1, index, cardLabel(index, total));

  useEffect(() => {
    leave?.();
  }, [leave]);

  const choose = (c: ReflectionChoice) => {
    if (indexRef.current !== index) return; // stale double tap
    if (c === 'pensar-mais') go(nextCard(index, total));
    // Back to screen 13, or opens it in place of this one when she came from Salvos.
    else if (c === 'outro-tema') setLeave(() => () => router.dismissTo('/reflexao'));
    else router.push('/sofa');
  };

  const { primary, secondary } = choicesFor(index, total);
  return (
    <Screen
      key={`card-${index}`}
      edges={['top', 'bottom']}
      footer={
        <View style={styles.actions}>
          <Button label={choiceLabel[primary]} arrow fullWidth onPress={() => choose(primary)} />
          <Button variant="quiet" label={choiceLabel[secondary]} onPress={() => choose(secondary)} />
          <HelpLink />
        </View>
      }>
      <BackBar right={bookmark.button} />
      {bookmark.error}
      <View style={styles.block}>
        <Chip label={theme.label} tone="sand" />
        <AppText ref={h1} variant="h1">
          {card.title}
        </AppText>
        <AppText variant="body" color="textBody">
          {card.body}
        </AppText>
      </View>
      <View style={styles.lentes}>
        <AppText variant="h3">Para pensar, no papel ou de cabeça</AppText>
        {card.lentes.map((l) => (
          <CheckItem key={l} mark="dot" text={l} />
        ))}
      </View>
      <AppText variant="caption" color="textSubtle" accessibilityLiveRegion="polite">
        {cardLabel(index, total)}
      </AppText>
    </Screen>
  );
}

/** A link to a theme this version does not have (an old link, or a typo). */
function ThemeNotFound() {
  return (
    <Screen edges={['top', 'bottom']}>
      <BackBar />
      <AppText variant="h1">Tema não encontrado</AppText>
      <AppText variant="body" color="textBody">
        Este tema não existe nesta versão do app.
      </AppText>
      <Button label="Ver os temas" onPress={() => router.replace('/reflexao')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { gap: space[3] },
  lentes: { gap: space[3], backgroundColor: color.tintWarm, borderRadius: radius.tile, padding: space[4] },
  actions: { gap: space[1], alignItems: 'center' },
});
