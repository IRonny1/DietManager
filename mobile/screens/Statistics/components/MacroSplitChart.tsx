// mobile/screens/Statistics/components/MacroSplitChart.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { PieChart } from 'react-native-gifted-charts';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';
import type { NutritionStats } from '@/types/statistics.types';

type MacroSplitChartProps = {
  macroSplit: NutritionStats['macroSplit'];
};

const MACRO_COLORS = {
  protein: palette.accent,
  fat: palette.secondary,
  carbs: palette.primary,
} as const;

export function MacroSplitChart({ macroSplit }: MacroSplitChartProps): React.JSX.Element {
  const hasData = macroSplit.protein + macroSplit.fat + macroSplit.carbs > 0;

  const pieData = [
    { value: macroSplit.protein, color: MACRO_COLORS.protein },
    { value: macroSplit.fat, color: MACRO_COLORS.fat },
    { value: macroSplit.carbs, color: MACRO_COLORS.carbs },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Macronutrient Split</Text>
      {hasData ? (
        <View style={styles.content}>
          <PieChart
            data={pieData}
            donut
            radius={60}
            innerRadius={40}
          />
          <View style={styles.legend}>
            {(['protein', 'fat', 'carbs'] as const).map((key) => (
              <View key={key} style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: MACRO_COLORS[key] }]} />
                <Text style={styles.legendLabel}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}{' '}
                  <Text style={styles.legendValue}>{macroSplit[key]}%</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>
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
    marginBottom: SPACING.MD,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legend: {
    flex: 1,
    marginLeft: SPACING.LG,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.SM,
  },
  legendLabel: {
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
  },
  legendValue: {
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textPrimary,
  },
  empty: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZE.SM,
    color: palette.textTertiary,
  },
});
