import { router } from 'expo-router';

import { Button } from '@/components/ui';

/**
 * The discreet way to /ajuda on the guided reflection (screens 13–14): always on screen, said once,
 * in plain words — never an alarm and never repeated line by line (spec §8: safety invisible in
 * common use, very clear when needed).
 */
export function HelpLink() {
  return <Button variant="quiet" label="Se estiver difícil agora, veja onde buscar ajuda" onPress={() => router.push('/ajuda')} />;
}
