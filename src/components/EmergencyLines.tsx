import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { AppText, Button } from '@/components/ui';
import { announce } from '@/lib/a11y';
import { LINHAS, type NumeroLinha } from '@/safety/recursos';
import { color, family, radius, space } from '@/theme';

/**
 * Emergency lines with a call button each (used by /ajuda and /seguranca). The number is
 * always visible as selectable text, so it stays useful where a device cannot place calls;
 * when `tel:` fails the screen says so right under the lines she was using.
 */
export function EmergencyLines({ numeros }: { numeros: readonly NumeroLinha[] }) {
  const [failed, setFailed] = useState<string | null>(null);
  const call = async (n: string) => {
    try {
      await Linking.openURL(`tel:${n}`);
      setFailed(null);
    } catch {
      setFailed(n);
      announce(failMessage(n));
    }
  };

  return (
    <View style={styles.list}>
      {numeros.map((key) => {
        const l = LINHAS[key];
        return (
          <View key={l.numero} style={styles.line}>
            <View style={styles.text}>
              <AppText variant="h2" selectable style={styles.number}>
                {l.numero}
              </AppText>
              <AppText variant="label">{l.nome}</AppText>
              <AppText variant="caption" color="textBody">
                {l.uso}
              </AppText>
            </View>
            <Button label={`Ligar ${l.numero}`} onPress={() => call(l.numero)} />
          </View>
        );
      })}
      {failed && (
        <AppText variant="label" color="error" accessibilityLiveRegion="assertive">
          {failMessage(failed)}
        </AppText>
      )}
    </View>
  );
}

function failMessage(n: string): string {
  return `Este aparelho não conseguiu iniciar a ligação. Disque ${n} pelo telefone.`;
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
