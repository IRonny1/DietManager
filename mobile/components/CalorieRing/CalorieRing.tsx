import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Text } from 'react-native-paper';

import { palette } from '@/constants/Colors';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

type CalorieRingProps = {
  consumed: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
};

export function CalorieRing({
  consumed,
  goal,
  size = 160,
  strokeWidth = 16,
}: CalorieRingProps): React.JSX.Element {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = goal > 0 ? Math.min(consumed / goal, 1) : 0;
  const strokeDashoffset = circumference - progress * circumference;
  const center = size / 2;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={palette.textDisabled}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={palette.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      <View style={[styles.centerLabel, { width: size, height: size }]}>
        <Text style={styles.caloriesText}>{consumed.toLocaleString()}</Text>
        <Text style={styles.goalText}>/ {goal.toLocaleString()} kcal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caloriesText: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: FONT_WEIGHT.BOLD,
    color: palette.textPrimary,
  },
  goalText: {
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
  },
});
