import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, OptionPill } from '@/components/ui';
import { categoryLabel, type Activity } from '@/data/activities';
import { announce } from '@/lib/a11y';
import { feedbackOptions, useAppState, type Feedback } from '@/state/app-state';
import { space } from '@/theme';

const title = 'Para as próximas sugestões';
const failedText = 'Não foi possível guardar sua resposta neste aparelho. Tente de novo.';

/** What her answer does, in plain words — exactly what src/lib/recommend.ts does with it. */
export function feedbackEffect(f: Feedback, a: Activity): string {
  const cat = categoryLabel[a.category];
  if (f === 'mais') return `Ideias do tipo “${cat}” sobem nas sugestões.`;
  if (f === 'menos') return `Ideias do tipo “${cat}” descem nas sugestões, sem sumir.`;
  return 'Esta atividade sai das sugestões. Ela continua na lista de atividades.';
}

/**
 * Spec §6 feedback on one activity — optional, one answer, changeable and removable.
 * Written first, then shown (the pills reflect what is really stored); a failed write is
 * said where she tapped. Never asks why, never infers anything (spec §6, §20).
 */
export function ActivityFeedback({ activity }: { activity: Activity }) {
  const { feedback, setFeedback } = useAppState();
  const [failed, setFailed] = useState(false);
  const current = feedback[activity.activityId];

  const choose = (value: Feedback | undefined) => {
    setFailed(false);
    setFeedback(activity.activityId, value)
      .then(() => announce(value ? feedbackEffect(value, activity) : 'Resposta removida.'))
      .catch((e) => {
        console.error('[storage] could not store activity feedback', e);
        setFailed(true);
        announce(failedText);
      });
  };

  return (
    <View style={styles.block}>
      <AppText variant="h3">{title}</AppText>
      <AppText variant="caption" color="textSubtle">
        Opcional. Fica só neste aparelho e muda apenas a ordem das ideias.
      </AppText>
      <View style={styles.options} accessibilityRole="radiogroup" accessibilityLabel={title}>
        {feedbackOptions.map((o) => (
          <OptionPill key={o.value} label={o.label} selected={current === o.value} onPress={() => choose(o.value)} />
        ))}
      </View>
      {current && (
        <View style={styles.status}>
          <AppText variant="caption" color="text" accessibilityLiveRegion="polite">
            {feedbackEffect(current, activity)}
          </AppText>
          <Button variant="quiet" label="Remover resposta" onPress={() => choose(undefined)} />
        </View>
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
  options: { gap: space[2] },
  status: { alignItems: 'flex-start', gap: space[1] },
});
