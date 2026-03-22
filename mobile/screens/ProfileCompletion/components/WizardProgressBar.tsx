import React from 'react';
import { StyleSheet, View } from 'react-native';

import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Text } from 'react-native-paper';

import { palette } from '@/constants/Colors';
import { TOTAL_STEPS } from '@/constants/profile.constants';

type WizardProgressBarProps = {
  currentStep: number;
};

export default function WizardProgressBar({
  currentStep,
}: WizardProgressBarProps): React.JSX.Element {
  const progress = (currentStep + 1) / TOTAL_STEPS;

  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(`${progress * 100}%` as unknown as number, {
      duration: 400,
    }),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text variant="bodySmall" style={styles.stepLabel}>
          Step {currentStep + 1} of {TOTAL_STEPS}
        </Text>
        <Text variant="bodySmall" style={styles.percentLabel}>
          {Math.round(progress * 100)}%
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, animatedStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingTop: 8,
    paddingBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepLabel: {
    color: palette.textSecondary,
    fontWeight: '500',
  },
  percentLabel: {
    color: palette.primary,
    fontWeight: '600',
  },
  track: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: palette.primary,
    borderRadius: 3,
  },
});
