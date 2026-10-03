/**
 * Font loading. Three families, chosen 2026-10-03 (docs/design/decisions.md):
 *   Cormorant Garamond — display: headlines, section + card titles, buttons
 *   Lora               — body: paragraphs, descriptions, activity steps
 *   Inter              — UI: labels, chips, tabs, captions, inputs
 *
 * React Native has no font-weight synthesis for custom fonts: every weight is
 * its own family name, so `typography.ts` references these keys directly.
 */
import {
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
} from '@expo-google-fonts/cormorant-garamond';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Lora_400Regular, Lora_500Medium } from '@expo-google-fonts/lora';
import { useFonts } from 'expo-font';

export const fontFiles = {
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
  Lora_400Regular,
  Lora_500Medium,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} as const;

export type FontFamily = keyof typeof fontFiles;

export const family = {
  display: 'CormorantGaramond_500Medium',
  displayStrong: 'CormorantGaramond_600SemiBold',
  body: 'Lora_400Regular',
  bodyStrong: 'Lora_500Medium',
  ui: 'Inter_400Regular',
  uiMedium: 'Inter_500Medium',
  uiStrong: 'Inter_600SemiBold',
} as const satisfies Record<string, FontFamily>;

/** Returns [loaded, error]. The root layout keeps the splash screen up until loaded. */
export function useBrandFonts() {
  return useFonts(fontFiles);
}
