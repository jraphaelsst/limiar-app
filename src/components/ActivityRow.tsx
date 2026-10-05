import { router } from 'expo-router';

import { ListRow } from '@/components/ui';
import { categoryLabel, formatDuration, type Activity } from '@/data/activities';

/** One activity in a list (catalog, a world, Salvos): title · category · duration → its card. */
export function ActivityRow({ activity: a }: { activity: Activity }) {
  return (
    <ListRow
      title={a.title}
      subtitle={`${categoryLabel[a.category]} · ${formatDuration(a.durationMin)}`}
      onPress={() => router.push(`/atividade/${a.activityId}`)}
    />
  );
}
