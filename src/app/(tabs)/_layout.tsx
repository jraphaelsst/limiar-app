import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icons } from '@/components/ui';
import type { Icon } from '@/components/ui/icons';
import { color, size, space, typography } from '@/theme';

/** Spec §3: four items — Início, Explorar, Salvos, Perfil. Saved uses a bookmark (spec §18; conflicts C1/C2). */
const tabs: readonly { name: string; title: string; icon: Icon }[] = [
  { name: 'index', title: 'Início', icon: Icons.House },
  { name: 'explorar', title: 'Explorar', icon: Icons.Compass },
  { name: 'salvos', title: 'Salvos', icon: Icons.Bookmark },
  { name: 'perfil', title: 'Perfil', icon: Icons.User },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.primary,
        tabBarInactiveTintColor: color.textSubtle,
        tabBarLabelStyle: { fontFamily: typography.tabLabel.fontFamily, fontSize: typography.tabLabel.fontSize }, // no fixed lineHeight: it clipped labels
        tabBarStyle: {
          backgroundColor: color.surface,
          borderTopColor: color.divider,
          height: size.tabBarContent + insets.bottom, // default 49 pt clips 12-pt labels
          paddingTop: space[2],
        },
        sceneStyle: { backgroundColor: color.background },
      }}>
      {tabs.map(({ name, title, icon: Glyph }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ focused }) => <Glyph size={24} color={focused ? color.primary : color.textSubtle} weight={focused ? 'fill' : 'light'} />,
          }}
        />
      ))}
    </Tabs>
  );
}
