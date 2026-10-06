import { StyleSheet, View } from 'react-native';

import { AppText, BackBar, Button, Chip, Screen } from '@/components/ui';
import { color, space, typography, type TypographyVariant } from '@/theme';

/** Dev-only type specimen for checking the scale on a real phone (visual-identity §4). */
const samples: Record<TypographyVariant, string> = {
  display: 'Uma nova fase.',
  h1: 'Mais tempo para você',
  h2: 'Olá, que bom ter você aqui.',
  h3: 'O que combina com hoje?',
  cardTitle: 'Mapa da casa da infância',
  button: 'Começar agora',
  body: 'Desenhar a planta e marcar três lugares que guardam lembranças boas ou curiosas.',
  bodySmall: 'Escolher uma rua ou praça pouco conhecida e caminhar ou observar.',
  bodyLarge: 'Marque três lugares que guardam lembranças boas ou curiosas.',
  label: 'Já tenho uma conta',
  input: 'Buscar atividades',
  caption: '10–15 min · papel e caneta',
  link: 'Ver todas',
  chip: 'Bem-estar',
  tabLabel: 'Início',
};

export default function Tipografia() {
  return (
    <Screen edges={['top', 'bottom']}>
      <BackBar />
      {(Object.keys(samples) as TypographyVariant[]).map((v) => (
        <View key={v} style={styles.row}>
          <AppText variant="caption" color="textSubtle">
            {v} · {typography[v].fontFamily} · {typography[v].fontSize}/{typography[v].lineHeight}
          </AppText>
          <AppText variant={v}>{samples[v]}</AppText>
        </View>
      ))}
      <View style={styles.row}>
        <Chip label="Rotina" tone="wine" />
        <Chip label="Bem-estar" tone="charcoal" />
        <Chip label="Explorar" tone="sand" />
      </View>
      <Button label="Começar agora" arrow fullWidth />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { gap: space[1], paddingBottom: space[3], borderBottomWidth: 1, borderBottomColor: color.divider },
});
