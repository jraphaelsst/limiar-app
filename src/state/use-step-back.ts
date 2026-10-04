import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { BackHandler } from 'react-native';

/**
 * Multi-step flows inside ONE screen (the games): the Android hardware back
 * button goes to the previous step instead of leaving the screen and losing the
 * answers. Inactive (`enabled` false) on the first step and on result screens,
 * where back leaves normally. iOS has no hardware back; web ignores this.
 *
 * Bound to FOCUS, not mount: a stack screen stays mounted under the screens
 * pushed on top of it (Ajuda, Me tira do sofá), and a mount-bound listener
 * would swallow their back press.
 */
export function useStepBack(enabled: boolean, goBack: () => void) {
  useFocusEffect(
    useCallback(() => {
      if (!enabled) return;
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        goBack();
        return true;
      });
      return () => sub.remove();
    }, [enabled, goBack]),
  );
}
