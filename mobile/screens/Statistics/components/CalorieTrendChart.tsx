import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { BarChart } from 'react-native-gifted-charts';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';
import type { NutritionStats } from '@/types/statistics.types';

type CalorieTrendChartProps = {
  calorieTrend: NutritionStats['calorieTrend'];
  avgDailyCalories: number;
};

const CHART_WIDTH = Dimensions.get('window').width - SPACING.LG * 2 - SPACING.MD * 2;

export function CalorieTrendChart({
  calorieTrend,
  avgDailyCalories,
}: CalorieTrendChartProps): React.JSX.Element {
  const barData = calorieTrend.map((item) => ({
    value: item.calories,
    label: item.date.slice(5).replace('-', '/'),
    frontColor: palette.primary,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calorie Trend</Text>
      <Text style={styles.subtitle}>Avg: {avgDailyCalories} kcal</Text>
      {barData.length > 0 ? (
        <BarChart
          data={barData}
          width={CHART_WIDTH}
          height={140}
          barWidth={Math.max(10, Math.floor(CHART_WIDTH / Math.max(barData.length * 2, 1)))}
          noOfSections={4}
          barBorderRadius={4}
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisText}
          hideRules
          isAnimated
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No data for this period</Text>
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
  subtitle: {
    fontSize: FONT_SIZE.XS,
    color: palette.textSecondary,
    marginBottom: SPACING.SM,
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
  },
});
