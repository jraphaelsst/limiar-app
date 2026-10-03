import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { AppText, BackBar, Button, Screen } from '@/components/ui';
import { color, family, radius, space } from '@/theme';

/**
 * Ajuda e segurança — spec §8.1 approved copy (Brasil). Fully static: works
 * offline and without any AI (spec §25.8). Numbers are always shown as text,
 * so the screen is useful even where a device cannot place calls.
 */
const lines = [
  { number: '192', name: 'SAMU', use: 'Emergência médica' },
  { number: '188', name: 'CVV', use: 'Apoio emocional, 24 horas' },
  { number: '180', name: 'Central de Atendimento à Mulher', use: 'Orientação e denúncia de violência' },
  { number: '190', name: 'Polícia Militar', use: 'Emergência em caso de violência' },
] as const;

export default function Ajuda() {
  const [failed, setFailed] = useState<string | null>(null);
  const call = async (n: string) => {
    try {
      await Linking.openURL(`tel:${n}`);
      setFailed(null);
    } catch {
      setFailed(n);
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <BackBar />
      <AppText variant="h1">Sua segurança vem primeiro</AppText>
      <AppText variant="body" color="textBody">
        Este aplicativo não é um serviço de emergência. Se houver risco de se machucar ou de não conseguir se manter segura, procure
        ajuda humana imediatamente. No Brasil: SAMU 192, UPA, pronto-socorro ou hospital. Para apoio emocional, CVV 188. Se puder, fique
        perto de alguém de confiança.
      </AppText>
      <View style={styles.list}>
        {lines.map((l) => (
          <View key={l.number} style={styles.line}>
            <View style={styles.text}>
              <AppText variant="h2" selectable style={styles.number}>
                {l.number}
              </AppText>
              <AppText variant="label">{l.name}</AppText>
              <AppText variant="caption" color="textBody">
                {l.use}
              </AppText>
            </View>
            <Button label={`Ligar ${l.number}`} onPress={() => call(l.number)} />
          </View>
        ))}
      </View>
      {failed && (
        <AppText variant="label" color="error" accessibilityLiveRegion="assertive">
          Este aparelho não conseguiu iniciar a ligação. Disque {failed} pelo telefone.
        </AppText>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: space[3] },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
    backgroundColor: color.surface,
    borderRadius: radius.card,
    padding: space[4],
  },
  text: { flex: 1, gap: 2 },
  number: { fontFamily: family.uiStrong }, // Inter: unmistakable digits for emergency numbers
});
