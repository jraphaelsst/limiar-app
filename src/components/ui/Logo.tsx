import { Image } from 'expo-image';

const sources = {
  lockup: { dark: require('@/assets/brand/logo-lockup.png'), light: require('@/assets/brand/logo-lockup-light.png'), ratio: 1209 / 716 },
  mark: { dark: require('@/assets/brand/logo-mark.png'), light: require('@/assets/brand/logo-mark-light.png'), ratio: 1151 / 403 },
} as const;

type Props = {
  kind?: keyof typeof sources;
  /** Dark ink on light grounds (default); light ink on wine/photography. */
  ink?: 'dark' | 'light';
  /** 240 on welcome, 176 in headers (visual-identity §2). */
  width?: number;
};

export function Logo({ kind = 'lockup', ink = 'dark', width = 176 }: Props) {
  const s = sources[kind];
  return (
    <Image
      source={s[ink]}
      style={{ width, height: width / s.ratio }}
      contentFit="contain"
      accessibilityLabel="Nós no Limiar — vida adulta contemporânea"
      accessibilityRole="image"
    />
  );
}
