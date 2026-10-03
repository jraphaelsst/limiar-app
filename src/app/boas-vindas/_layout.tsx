import { Stack } from 'expo-router';

import { OnboardingDraftProvider } from '@/state/onboarding-draft';
import { color } from '@/theme';

export default function OnboardingLayout() {
  return (
    <OnboardingDraftProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.background } }} />
    </OnboardingDraftProvider>
  );
}
