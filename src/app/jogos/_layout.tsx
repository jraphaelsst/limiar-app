import { Stack } from 'expo-router';

import { color } from '@/theme';

/** The games list and the two games (spec §4.5, screens 11–12). */
export default function JogosLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.background } }} />;
}
