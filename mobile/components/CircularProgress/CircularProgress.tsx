import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Text } from 'react-native-paper';

import { palette } from '@/constants/Colors';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

type CircularProgressProps = {
  value: number;
  max: number;
  unit: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
};

export function CircularProgress({
  value,
  max,
  unit,
  size = 160,
  strokeWidth = 16,
  color = palette.accent,
}: CircularProgressProps): React.JSX.Element {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = max > 0 ? Math.min(value / max, 1) : 0;
  const strokeDashoffset = circumference - progress * circumference;
  const center = size / 2;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={palette.textDisabled}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
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
        <Text style={styles.valueText}>{value.toLocaleString()}</Text>
        <Text style={styles.unitText}>{unit}</Text>
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
  valueText: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: FONT_WEIGHT.BOLD,
    color: palette.textPrimary,
  },
  unitText: {
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
  },
});
