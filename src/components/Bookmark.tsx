import { useCallback, useState } from 'react';

import { AppText, IconButton, Icons } from '@/components/ui';
import { announce } from '@/lib/a11y';
import { saveFailedText, useSaved } from '@/state/app-state';

/**
 * "Guardar" (spec §4.4) — the bookmark every activity surface shows (card, step view,
 * closing screen, "Me tira do sofá" result): same words, same failure message where she acted.
 * `button` goes in the BackBar; `error` right under it.
 */
export function useBookmark(activityId: string) {
  const { isSaved, toggle } = useSaved();
  const [failed, setFailed] = useState(false);
  const saved = isSaved(activityId);

  const onPress = useCallback(() => {
    setFailed(false);
    toggle(activityId).catch((e) => {
      console.error('[storage] could not update saved items', e);
      setFailed(true);
      announce(saveFailedText);
    });
  }, [activityId, toggle]);

  return {
    saved,
    /** Clears a shown failure (e.g. when the screen moves to another activity). */
    reset: () => setFailed(false),
    button: <IconButton icon={Icons.Bookmark} label={saved ? 'Remover dos salvos' : 'Guardar'} selected={saved} onPress={onPress} />,
    error: failed ? (
      <AppText variant="label" color="error" accessibilityLiveRegion="assertive">
        {saveFailedText}
      </AppText>
    ) : null,
  };
}
