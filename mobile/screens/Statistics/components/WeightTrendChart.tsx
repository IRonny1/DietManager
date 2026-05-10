// mobile/screens/Statistics/components/WeightTrendChart.tsx
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { LineChart } from 'react-native-gifted-charts';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';
import type { BodyStats } from '@/types/statistics.types';

type WeightTrendChartProps = {
  weightTrend: BodyStats['weightTrend'];
  goalWeight: number;
};

const CHART_WIDTH = Dimensions.get('window').width - SPACING.LG * 2 - SPACING.MD * 2;

export function WeightTrendChart({
  weightTrend,
  goalWeight,
}: WeightTrendChartProps): React.JSX.Element {
  const lineData = weightTrend.map((item) => ({
    value: item.weight,
    label: item.date.slice(5).replace('-', '/'),
  }));

  const goalLineData = weightTrend.map(() => ({ value: goalWeight }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weight Trend</Text>
      <View style={styles.legendRow}>
        <View style={[styles.legendDot, { backgroundColor: palette.primary }]} />
        <Text style={styles.legendText}>Actual</Text>
        <View style={[styles.legendDot, { backgroundColor: palette.error, marginLeft: SPACING.MD }]} />
        <Text style={styles.legendText}>Goal: {goalWeight} kg</Text>
      </View>
      {lineData.length >= 2 ? (
        <LineChart
          data={lineData}
          data2={goalLineData}
          width={CHART_WIDTH}
          height={140}
          color={palette.primary}
          color2={palette.error}
          dataPointsColor={palette.primary}
          dataPointsColor2="transparent"
          thickness={2}
          thickness2={1}
          curved
          noOfSections={4}
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisText}
          hideRules
          isAnimated
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            {lineData.length === 0
              ? 'No weight entries for this period'
              : 'Add more entries to see the trend'}
          </Text>
        </View>
      )}
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
  title: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textPrimary,
    marginBottom: SPACING.XS,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.XS,
  },
  legendText: {
    fontSize: FONT_SIZE.XS,
    color: palette.textSecondary,
  },
  axisText: {
    fontSize: 10,
    color: palette.textTertiary,
  },
  empty: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZE.SM,
    color: palette.textTertiary,
    textAlign: 'center',
  },
});
