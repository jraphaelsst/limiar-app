import { useCallback, useRef, useState } from 'react';

import { AppText, IconButton, Icons } from '@/components/ui';
import { announce } from '@/lib/a11y';
import { saveFailedText, useAppState, useSaved } from '@/state/app-state';

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
    error: failed ? <SaveFailed /> : null,
  };
}

/**
 * The same bookmark for a guided-reflection card (screen 14): same words, same failure message.
 * Stores the card id only. Written first, then shown; a tap while a write is in flight is ignored,
 * so a quick double tap cannot be read as "save" twice.
 */
export function useReflectionBookmark(reflectionId: string) {
  const { savedReflectionIds, setReflectionSaved } = useAppState();
  const [failed, setFailed] = useState(false);
  const busy = useRef(false);
  const saved = savedReflectionIds.includes(reflectionId);

  const onPress = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    setFailed(false);
    setReflectionSaved(reflectionId, !saved)
      .catch((e) => {
        console.error('[storage] could not update saved reflections', e);
        setFailed(true);
        announce(saveFailedText);
      })
      .finally(() => {
        busy.current = false;
      });
  }, [reflectionId, saved, setReflectionSaved]);

  return {
    saved,
    reset: () => setFailed(false),
    button: <IconButton icon={Icons.Bookmark} label={saved ? 'Remover dos salvos' : 'Guardar'} selected={saved} onPress={onPress} />,
    error: failed ? <SaveFailed /> : null,
  };
}

function SaveFailed() {
  return (
    <AppText variant="label" color="error" accessibilityLiveRegion="assertive">
      {saveFailedText}
    </AppText>
  );
}
