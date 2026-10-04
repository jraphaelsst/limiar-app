import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AppStateProvider, useAppState } from '@/state/app-state';
import { color, useBrandFonts } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useBrandFonts();

  useEffect(() => {
    if (fontError) throw fontError; // surfaced by the router error boundary — never render with silent fallback fonts
  }, [fontError]);

  if (!fontsLoaded) return null; // splash stays visible until the brand fonts are ready

  return (
    <AppStateProvider>
      <StatusBar style="dark" />
      <Routes />
    </AppStateProvider>
  );
}

/**
 * Until onboarding is done only the welcome flow is reachable; afterwards it is
 * gone. Help/safety and "Sobre" are outside both guards: always reachable.
 */
function Routes() {
  const { ready, prefs } = useAppState();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  const onboarded = prefs !== undefined;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.background } }}>
      <Stack.Protected guard={onboarded}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="sofa" />
        <Stack.Screen name="atividade/[id]" />
        <Stack.Screen name="atividades" />
        <Stack.Screen name="preferencias" />
        <Stack.Screen name="jogos" />
        <Stack.Screen name="tipografia" />
      </Stack.Protected>
      <Stack.Protected guard={!onboarded}>
        <Stack.Screen name="boas-vindas" />
      </Stack.Protected>
      <Stack.Screen name="ajuda" />
      <Stack.Screen name="sobre" />
      <Stack.Screen name="privacidade" />
    </Stack>
  );
}
