import { router } from 'expo-router';

import { AppText, BackBar, Button, Screen } from '@/components/ui';

/** An activity link whose id is not in this version's catalog (retired, or an old link). */
export function ActivityNotFound() {
  return (
    <Screen edges={['top', 'bottom']}>
      <BackBar />
      <AppText variant="h1">Atividade não encontrada</AppText>
      <AppText variant="body" color="textBody">
        Ela pode ter sido retirada do catálogo.
      </AppText>
      <Button label="Ver atividades" onPress={() => router.replace('/atividades')} />
    </Screen>
  );
}
