import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { HelpButton } from '@/components/HelpButton';
import { WelcomeCollage } from '@/components/WelcomeCollage';
import { AppText, Button, Logo, Screen } from '@/components/ui';
import { space } from '@/theme';

/**
 * Spec screen 01 — brand. Copy avoids presuming loss (spec §2.1; conflict C4).
 * No "Já tenho uma conta": there are no accounts in Phase 0 (conflict C10).
 */
export default function Welcome() {
  return (
    <Screen edges={['top', 'bottom']} footer={<Button label="Começar" arrow fullWidth onPress={() => router.push('/boas-vindas/proposito')} />}>
      <View style={styles.top}>
        <HelpButton />
      </View>
      <View style={styles.logo}>
        <Logo width={240} />
      </View>
      <WelcomeCollage />
      <View style={styles.text}>
        <AppText variant="display">
          Uma nova fase.{'\n'}Muitas possibilidades.
        </AppText>
        <AppText variant="body" color="textBody">
          Pequenas experiências, jogos e ideias para descobrir o que combina com a vida de hoje.
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { alignItems: 'flex-end', marginRight: -space[3], marginBottom: -space[6] },
  logo: { alignItems: 'center', paddingTop: space[2] },
  text: { gap: space[3] },
});
