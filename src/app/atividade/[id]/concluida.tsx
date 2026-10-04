import { useLocalSearchParams } from 'expo-router';

import { ActivityNotFound } from '@/components/ActivityNotFound';
import { AfterActivity } from '@/components/AfterActivity';
import { findActivity } from '@/data/activities';

/** Screen 09 — reached by "Concluir" from the card or the step view. */
export default function Concluida() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const a = findActivity(id);
  if (!a) return <ActivityNotFound />;
  // Children slot reserved for the optional "guardar uma frase" (spec §4.4 "Depois") — a later slice.
  return <AfterActivity activity={a} />;
}
