// mobile/components/BMIScale/BMIScale.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Rect, Circle } from 'react-native-svg';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';
import type { BodyStats } from '@/types/statistics.types';

type BMIScaleProps = {
  bmi: number;
  category: BodyStats['bmiCategory'];
};

const SCALE_MIN = 10;
const SCALE_MAX = 40;
const BAR_HEIGHT = 8;
const SVG_WIDTH = 300;

const SEGMENTS = [
  { label: 'Underweight', color: '#2196F3', min: 10, max: 18.5 },
  { label: 'Normal', color: palette.primary, min: 18.5, max: 25 },
  { label: 'Overweight', color: palette.secondary, min: 25, max: 30 },
  { label: 'Obese', color: palette.error, min: 30, max: 40 },
] as const;

const CATEGORY_LABELS: Record<BodyStats['bmiCategory'], string> = {
  underweight: 'Underweight',
  normal: 'Normal weight',
  overweight: 'Overweight',
  obese: 'Obese',
};

const CATEGORY_COLORS: Record<BodyStats['bmiCategory'], string> = {
  underweight: '#2196F3',
  normal: palette.primary,
  overweight: palette.secondary,
  obese: palette.error,
};

function bmiToX(bmi: number): number {
  return Math.max(0, Math.min(SVG_WIDTH, ((bmi - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * SVG_WIDTH));
}

export function BMIScale({ bmi, category }: BMIScaleProps): React.JSX.Element {
  const markerX = bmiToX(bmi);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.bmiValue}>{bmi}</Text>
        <Text style={[styles.categoryLabel, { color: CATEGORY_COLORS[category] }]}>
          {CATEGORY_LABELS[category]}
        </Text>
      </View>
      <Svg width="100%" height={BAR_HEIGHT + 16} viewBox={`0 0 ${SVG_WIDTH} ${BAR_HEIGHT + 16}`}>
        {SEGMENTS.map((seg, i) => {
          const x = ((seg.min - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * SVG_WIDTH;
          const w = ((seg.max - seg.min) / (SCALE_MAX - SCALE_MIN)) * SVG_WIDTH - 1;
          return (
            <Rect
              key={seg.label}
              x={x}
              y={4}
              width={w}
              height={BAR_HEIGHT}
              fill={seg.color}
              rx={i === 0 || i === SEGMENTS.length - 1 ? 4 : 0}
            />
          );
        })}
        <Circle
          cx={markerX}
          cy={4 + BAR_HEIGHT / 2}
          r={6}
          fill={palette.white}
          stroke={CATEGORY_COLORS[category]}
          strokeWidth={2}
        />
      </Svg>
      <View style={styles.legendRow}>
        {SEGMENTS.map((seg) => (
          <Text key={seg.label} style={[styles.legendLabel, { color: seg.color }]}>
            {seg.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.bgCard,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginHorizontal: SPACING.LG,
    marginBottom: SPACING.MD,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  bmiValue: {
    fontSize: FONT_SIZE.XL,
    fontWeight: FONT_WEIGHT.BOLD,
    color: palette.textPrimary,
  },
  categoryLabel: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.XS,
  },
  legendLabel: {
    fontSize: FONT_SIZE.XS,
  },
});
