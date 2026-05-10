// mobile/screens/Statistics/components/NutritionView.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { BarChart } from 'react-native-gifted-charts';
import { StatCard } from '@/components/StatCard/StatCard';
import { CalorieTrendChart } from './CalorieTrendChart';
import { MacroSplitChart } from './MacroSplitChart';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';
import type { NutritionStats, MacroFilter } from '@/types/statistics.types';

type NutritionViewProps = {
  stats: NutritionStats;
  activeMacroFilter: MacroFilter;
  onMacroFilterChange: (filter: MacroFilter) => void;
};

const MACRO_FILTERS: Array<{ value: MacroFilter; label: string }> = [
  { value: 'protein', label: 'Protein' },
  { value: 'fat', label: 'Fat' },
  { value: 'carbs', label: 'Carbs' },
];

const MACRO_COLORS: Record<MacroFilter, string> = {
  protein: palette.accent,
  fat: palette.secondary,
  carbs: palette.primary,
};

const CHART_WIDTH = Dimensions.get('window').width - SPACING.LG * 2 - SPACING.MD * 2;

export function NutritionView({
  stats,
  activeMacroFilter,
  onMacroFilterChange,
}: NutritionViewProps): React.JSX.Element {
  const macroBarData = stats.macroTrend.map((item) => ({
    value: item[activeMacroFilter],
    label: item.date.slice(5).replace('-', '/'),
    frontColor: MACRO_COLORS[activeMacroFilter],
  }));

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'] as const;
  const totalMealCalories = mealTypes.reduce(
    (sum, t) => sum + stats.caloriesByMealType[t],
    0,
  );

  return (
    <>
      <View style={styles.statRow}>
        <StatCard label="Avg daily" value={stats.avgDailyCalories} unit="kcal" />
        <StatCard
          label="On target"
          value={`${stats.onTargetDays}/${stats.totalDays}`}
          unit="days"
        />
        <StatCard label="Streak" value={stats.currentStreak} unit="days" />
      </View>

      <CalorieTrendChart
        calorieTrend={stats.calorieTrend}
        avgDailyCalories={stats.avgDailyCalories}
      />

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Macronutrient Trend</Text>
        <View style={styles.filterRow}>
          {MACRO_FILTERS.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[
                styles.filterChip,
                activeMacroFilter === f.value && {
                  backgroundColor: MACRO_COLORS[f.value] + '22',
                  borderColor: MACRO_COLORS[f.value],
                },
              ]}
              onPress={() => onMacroFilterChange(f.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeMacroFilter === f.value && {
                    color: MACRO_COLORS[f.value],
                    fontWeight: FONT_WEIGHT.SEMIBOLD,
                  },
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {macroBarData.length > 0 ? (
          <BarChart
            data={macroBarData}
            width={CHART_WIDTH}
            height={120}
            barWidth={Math.max(10, Math.floor(CHART_WIDTH / Math.max(macroBarData.length * 2, 1)))}
            barBorderRadius={4}
            noOfSections={3}
            yAxisTextStyle={styles.axisText}
            xAxisLabelTextStyle={styles.axisText}
            hideRules
            isAnimated
          />
        ) : (
          <Text style={styles.emptyText}>No data for this period</Text>
        )}
      </View>

      <MacroSplitChart macroSplit={stats.macroSplit} />

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Calories by Meal Type</Text>
        {mealTypes.map((type) => {
          const kcal = stats.caloriesByMealType[type];
          const pct = totalMealCalories > 0 ? Math.round((kcal / totalMealCalories) * 100) : 0;
          return (
            <View key={type} style={styles.mealRow}>
              <Text style={styles.mealLabel}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${pct}%`, backgroundColor: palette.primary },
                  ]}
                />
              </View>
              <Text style={styles.mealValue}>
                {kcal} kcal ({pct}%)
              </Text>
            </View>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    marginHorizontal: SPACING.LG - SPACING.XS,
    marginBottom: SPACING.MD,
  },
  card: {
    backgroundColor: palette.bgCard,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginHorizontal: SPACING.LG,
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textPrimary,
    marginBottom: SPACING.SM,
  },
  filterRow: {
    flexDirection: 'row',
    gap: SPACING.SM,
    marginBottom: SPACING.SM,
  },
  filterChip: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.FULL,
    borderWidth: 1,
    borderColor: palette.border,
  },
  filterChipText: {
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
  },
  axisText: {
    fontSize: 10,
    color: palette.textTertiary,
  },
  emptyText: {
    fontSize: FONT_SIZE.SM,
    color: palette.textTertiary,
    textAlign: 'center',
    paddingVertical: SPACING.MD,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  mealLabel: {
    width: 80,
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: palette.border,
    borderRadius: BORDER_RADIUS.FULL,
    marginHorizontal: SPACING.SM,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.FULL,
  },
  mealValue: {
    width: 110,
    fontSize: FONT_SIZE.XS,
    color: palette.textTertiary,
    textAlign: 'right',
  },
});
