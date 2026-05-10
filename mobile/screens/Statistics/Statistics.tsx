// mobile/screens/Statistics/Statistics.tsx
import React from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStatistics } from './hooks/useStatistics';
import { SegmentControl } from '@/components/SegmentControl/SegmentControl';
import { NutritionView } from './components/NutritionView';
import { BodyView } from './components/BodyView';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

const SEGMENT_OPTIONS = [
  { label: 'Nutrition', value: 'nutrition' },
  { label: 'Body', value: 'body' },
];

const PERIOD_OPTIONS = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
] as const;

export function Statistics(): React.JSX.Element {
  const {
    activeTab,
    activePeriod,
    activeMacroFilter,
    nutritionStats,
    bodyStats,
    recentEntries,
    isLoading,
    error,
    periodLabel,
    handleTabChange,
    handlePeriodChange,
    handleMacroFilterChange,
    handlePeriodPrevious,
    handlePeriodNext,
    handleAddWeightEntry,
    handleViewAllWeightEntries,
  } = useStatistics();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>

        <View style={styles.periodNav}>
          <TouchableOpacity onPress={handlePeriodPrevious} style={styles.navArrow}>
            <Ionicons name="chevron-back" size={20} color={palette.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.periodLabel}>{periodLabel}</Text>
          <TouchableOpacity onPress={handlePeriodNext} style={styles.navArrow}>
            <Ionicons name="chevron-forward" size={20} color={palette.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.periodToggle}>
          {PERIOD_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.periodBtn,
                activePeriod === opt.value && styles.periodBtnActive,
              ]}
              onPress={() => handlePeriodChange(opt.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.periodBtnText,
                  activePeriod === opt.value && styles.periodBtnTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <SegmentControl
        options={SEGMENT_OPTIONS}
        activeValue={activeTab}
        onChange={(v) => handleTabChange(v as 'nutrition' | 'body')}
      />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'nutrition' && nutritionStats !== null ? (
            <NutritionView
              stats={nutritionStats}
              activeMacroFilter={activeMacroFilter}
              onMacroFilterChange={handleMacroFilterChange}
            />
          ) : activeTab === 'body' && bodyStats !== null ? (
            <BodyView
              stats={bodyStats}
              recentEntries={recentEntries}
              onAddEntry={handleAddWeightEntry}
              onViewAll={handleViewAllWeightEntries}
            />
          ) : null}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.bgPage,
  },
  header: {
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.LG,
  },
  title: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: FONT_WEIGHT.BOLD,
    color: palette.textPrimary,
    marginBottom: SPACING.MD,
  },
  periodNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.SM,
  },
  navArrow: {
    padding: SPACING.SM,
  },
  periodLabel: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.MEDIUM,
    color: palette.textPrimary,
    marginHorizontal: SPACING.MD,
    minWidth: 160,
    textAlign: 'center',
  },
  periodToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.SM,
  },
  periodBtn: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.FULL,
    borderWidth: 1,
    borderColor: palette.border,
  },
  periodBtnActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  periodBtnText: {
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
  },
  periodBtnTextActive: {
    color: palette.white,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: FONT_SIZE.SM,
    color: palette.error,
    textAlign: 'center',
    paddingHorizontal: SPACING.XL,
  },
  scroll: {
    paddingBottom: SPACING.XXL,
  },
});
