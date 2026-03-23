import React from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';

import { useHome } from './hooks/useHome';
import { CalorieRing } from '@/components/CalorieRing/CalorieRing';
import { MacroBar } from '@/components/MacroBar/MacroBar';
import { MealCard } from '@/components/MealCard/MealCard';
import { palette } from '@/constants/Colors';
import { SPACING } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

export function Home(): React.JSX.Element {
  const {
    dailyLog,
    isLoading,
    greeting,
    userName,
    formattedDate,
    hasMeals,
    handleSeeAllPress,
    handleScanPress,
  } = useHome();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  const log = dailyLog!;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}, {userName}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>

      {/* Calorie Ring */}
      <View style={styles.ringContainer}>
        <CalorieRing consumed={log.totalCalories} goal={log.calorieGoal} />
      </View>

      {/* Macro Bar */}
      <MacroBar protein={log.totalProtein} fat={log.totalFat} carbs={log.totalCarbs} />

      {/* Meals Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Meals</Text>
        {hasMeals && (
          <TouchableOpacity onPress={handleSeeAllPress}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        )}
      </View>

      {hasMeals ? (
        log.meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} onPress={() => {}} />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🍽</Text>
          <Text style={styles.emptyTitle}>No meals logged yet</Text>
          <Text style={styles.emptySubtitle}>Tap + to add your first meal of the day</Text>
          <Button
            mode="contained"
            onPress={handleScanPress}
            style={styles.addMealButton}
            contentStyle={styles.addMealButtonContent}
          >
            + Add Meal
          </Button>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
    backgroundColor: palette.bgPage,
  },
  content: {
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.LG,
    paddingBottom: SPACING.XXL,
  },
  header: {
    marginBottom: SPACING.XL,
  },
  greeting: {
    fontSize: FONT_SIZE.XL,
    fontWeight: FONT_WEIGHT.BOLD,
    color: palette.textPrimary,
  },
  date: {
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
    marginTop: 2,
  },
  ringContainer: {
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.XL,
    marginBottom: SPACING.SM,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.BOLD,
    color: palette.textPrimary,
  },
  seeAll: {
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.XXL,
    backgroundColor: palette.bgCard,
    borderRadius: 12,
    marginTop: SPACING.MD,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.MD,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textPrimary,
    marginBottom: SPACING.SM,
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.LG,
  },
  addMealButton: {
    borderRadius: 24,
  },
  addMealButtonContent: {
    paddingHorizontal: SPACING.LG,
  },
});
