import { useNavigation } from 'expo-router';
import { usePreventRemove, type NavigationAction } from 'expo-router/react-navigation';

/** A plain "back": the BackBar arrow / router.back(), Android back, an iOS swipe (native-stack sends POP 1). */
function isOneStepBack(action: NavigationAction): boolean {
  if (action.type === 'GO_BACK') return true;
  if (action.type !== 'POP') return false;
  const count = (action.payload as { count?: number } | undefined)?.count;
  return count === undefined || count === 1;
}

/**
 * Multi-step flows inside ONE screen (Me tira do sofá, the games) — decision 2026-10-03,
 * board nnl-hardware-back: while `enabled`, "back" goes to the previous step instead of
 * leaving the screen and losing the answers. Built on usePreventRemove, so one hook covers
 * the BackBar arrow (router.back), Android hardware back and the iOS swipe (native-stack
 * cancels the native dismiss and routes it here). Web browser back goes through linking's
 * resetRoot and is not verified to be caught.
 *
 * Only a one-step back is turned into a step back. Any other removal — e.g. "Voltar ao
 * início" (`router.dismissTo('/')`) from a screen pushed on top of this one — is let
 * through: swallowing it would make that button need a second tap.
 */
export function usePreviousStepOnBack(enabled: boolean, toPreviousStep: () => void): void {
  const navigation = useNavigation();
  usePreventRemove(enabled, ({ data }) => {
    if (isOneStepBack(data.action)) toPreviousStep();
    else navigation.dispatch(data.action);
  });
}
