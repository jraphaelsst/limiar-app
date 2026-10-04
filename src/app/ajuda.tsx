import { EmergencyLines } from '@/components/EmergencyLines';
import { AppText, BackBar, Screen } from '@/components/ui';
import { TEXTO_RISCO, TEXTO_RISCO_FALADO } from '@/safety/recursos';

/**
 * Ajuda e segurança — spec §8.1 approved copy (Brasil). Fully static: works
 * offline and without any AI (spec §25.8). Numbers are always shown as text,
 * so the screen is useful even where a device cannot place calls. Same
 * paragraph and lines as the high-risk route (/seguranca): src/safety/recursos.ts.
 */
export default function Ajuda() {
  return (
    <Screen edges={['top', 'bottom']}>
      <BackBar />
      <AppText variant="h1">Sua segurança vem primeiro</AppText>
      <AppText variant="body" color="textBody" accessibilityLabel={TEXTO_RISCO_FALADO}>
        {TEXTO_RISCO}
      </AppText>
      <EmergencyLines numeros={['192', '188', '180', '190']} />
    </Screen>
  );
}
