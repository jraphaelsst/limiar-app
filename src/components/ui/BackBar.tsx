import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { space } from '@/theme';

import { IconButton } from './IconButton';
import { ArrowLeft } from './icons';

/**
 * Header for pushed screens: back on the left, up to two actions on the right. The back arrow is the
 * same as the system back (a screen with steps turns it into "previous step" via usePreviousStepOnBack),
 * so `backLabel` only renames it for the screen reader when that is what it does.
 */
export function BackBar({ right, backLabel = 'Voltar' }: { right?: ReactNode; backLabel?: string }) {
  return (
    <View style={styles.row}>
      <IconButton
        icon={ArrowLeft}
        label={backLabel}
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      />
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: -space[3], marginRight: -space[3] },
  right: { flexDirection: 'row', gap: space[1] },
});
