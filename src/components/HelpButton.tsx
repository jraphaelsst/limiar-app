import { router } from 'expo-router';

import { IconButton, Icons } from '@/components/ui';

/** Help is reachable from every onboarding step (spec §8; review 2026-10-03), not only from "Antes de começar". */
export function HelpButton() {
  return <IconButton icon={Icons.Lifebuoy} label="Contatos de ajuda" onPress={() => router.push('/ajuda')} />;
}
