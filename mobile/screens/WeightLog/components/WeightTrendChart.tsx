import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { LineChart } from 'react-native-gifted-charts';

import { palette } from '@/constants/Colors';
import { SPACING } from '@/constants/spacing.constants';
import { FONT_SIZE } from '@/constants/typography.constants';

type ChartPoint = { date: string; weight: number };

type WeightTrendChartProps = {
  chartData: ChartPoint[];
  goalWeight: number;
};

const CHART_WIDTH = Dimensions.get('window').width - SPACING.LG * 4;

export function WeightTrendChart({
  chartData,
  goalWeight,
}: WeightTrendChartProps): React.JSX.Element {
  const lineData = chartData.map((item) => ({
    value: item.weight,
    label: item.date.slice(5).replace('-', '/'),
  }));

  const goalLineData = chartData.map(() => ({ value: goalWeight }));

  if (lineData.length < 2) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          {lineData.length === 0
            ? 'No weight entries for this period'
            : 'Add more entries to see the trend'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.legendRow}>
        <View style={[styles.dot, { backgroundColor: palette.primary }]} />
        <Text style={styles.legendText}>Actual</Text>
        {goalWeight > 0 && (
          <>
            <View
              style={[styles.dot, { backgroundColor: palette.error, marginLeft: SPACING.MD }]}
            />
            <Text style={styles.legendText}>Goal: {goalWeight} kg</Text>
          </>
        )}
      </View>
      <LineChart
        data={lineData}
        data2={goalWeight > 0 ? goalLineData : undefined}
        width={CHART_WIDTH}
        height={160}
        color={palette.primary}
        color2={palette.error}
        dataPointsColor={palette.primary}
        dataPointsColor2="transparent"
        thickness={2}
        thickness2={1}
        areaChart
        curved
        noOfSections={4}
        yAxisTextStyle={styles.axisText}
        xAxisLabelTextStyle={styles.axisText}
        hideRules
        isAnimated
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: SPACING.SM,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  dot: {
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
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZE.SM,
    color: palette.textTertiary,
    textAlign: 'center',
  },
});
