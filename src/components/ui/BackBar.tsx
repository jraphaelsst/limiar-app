import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { space } from '@/theme';

import { IconButton } from './IconButton';
import { ArrowLeft } from './icons';

/** Header for pushed screens: back on the left, up to two actions on the right. */
export function BackBar({ right }: { right?: ReactNode }) {
  return (
    <View style={styles.row}>
      <IconButton
        icon={ArrowLeft}
        label="Voltar"
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
