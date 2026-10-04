import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, ListRow } from '@/components/ui';
import { findActivity } from '@/data/activities';
import { announce } from '@/lib/a11y';
import { feedbackLabel, useAppState } from '@/state/app-state';
import { color, radius, space } from '@/theme';

const failedText = 'Não foi possível remover neste aparelho. Tente de novo.';

/**
 * Spec §10.3 "ver o que está salvo" for the §6 feedback: every answer, by activity, with
 * remove one / remove all. Changes apply at once (unlike the rest of Preferências, which
 * waits for "Salvar") — the caption says so. Tapping a row opens the activity to change it.
 */
export function FeedbackList() {
  const { feedback, setFeedback, clearFeedback } = useAppState();
  const [confirmingAll, setConfirmingAll] = useState(false);
  const [failed, setFailed] = useState(false);
  const answers = Object.entries(feedback);

  const run = (p: Promise<void>, done: string) => {
    setFailed(false);
    p.then(() => announce(done)).catch((e) => {
      console.error('[storage] could not update activity feedback', e);
      setFailed(true);
      announce(failedText);
    });
  };

  return (
    <View style={styles.block}>
      <AppText variant="h3">Suas respostas sobre atividades</AppText>
      {answers.length === 0 ? (
        <AppText variant="bodySmall" color="textBody">
          Nenhuma resposta guardada. Em cada atividade dá para marcar “mais disso”, “menos disso” ou “não combina comigo”.
        </AppText>
      ) : (
        <>
          <AppText variant="caption" color="textSubtle">
            Mudam só a ordem das sugestões. Remover vale na hora, sem precisar salvar.
          </AppText>
          <View style={styles.list}>
            {answers.map(([id, f]) => {
              const a = findActivity(id);
              const title = a?.title ?? 'Uma atividade que saiu do catálogo desta versão';
              return (
                <View key={id} style={styles.item}>
                  <ListRow
                    title={title}
                    subtitle={feedbackLabel(f)}
                    onPress={a ? () => router.push({ pathname: '/atividade/[id]', params: { id } }) : undefined}
                  />
                  <View style={styles.start}>
                    <Button
                      variant="quiet"
                      label="Remover"
                      accessibilityLabel={`Remover a resposta sobre ${title}`}
                      onPress={() => run(setFeedback(id, undefined), 'Resposta removida.')}
                    />
                  </View>
                </View>
              );
            })}
          </View>
          {confirmingAll ? (
            <View style={styles.confirm} accessibilityLiveRegion="polite">
              <AppText variant="label">Remover todas as respostas?</AppText>
              <View style={styles.row}>
                <Button
                  variant="quiet"
                  label="Remover todas"
                  onPress={() => {
                    setConfirmingAll(false);
                    run(clearFeedback(), 'Respostas removidas.');
                  }}
                />
                <Button variant="quiet" label="Cancelar" onPress={() => setConfirmingAll(false)} />
              </View>
            </View>
          ) : (
            <View style={styles.start}>
              <Button variant="quiet" label="Remover todas as respostas" onPress={() => setConfirmingAll(true)} />
            </View>
          )}
        </>
      )}
      {failed && (
        <AppText variant="label" color="error" accessibilityLiveRegion="assertive">
          {failedText}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: space[3] },
  list: { gap: space[3] },
  item: { gap: space[1] },
  start: { alignItems: 'flex-start' },
  confirm: { backgroundColor: color.surface, borderRadius: radius.card, padding: space[4], gap: space[2] },
  row: { flexDirection: 'row', flexWrap: 'wrap', columnGap: space[4] },
});
