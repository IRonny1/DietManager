// mobile/screens/History/History.tsx
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Searchbar, Chip, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useHistory } from './hooks/useHistory';
import { DateSectionHeader } from '@/components/DateSectionHeader/DateSectionHeader';
import { MealHistoryRow } from '@/components/MealHistoryRow/MealHistoryRow';
import { palette } from '@/constants/Colors';
import { SPACING } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';
import type { MealEntry } from '@/types/diary.types';
import type { DateFilter, GroupedMeals } from './hooks/useHistory';

const FILTERS: Array<{ key: DateFilter; label: string }> = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'custom', label: 'Custom' },
];

export function History(): React.JSX.Element {
  const {
    groupedMeals,
    searchQuery,
    activeFilter,
    isLoading,
    handleSearchChange,
    handleFilterChange,
    handleMealPress,
    handleOpenDatePicker,
  } = useHistory();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.title}>Meal History</Text>

        <Searchbar
          placeholder="Search meals..."
          value={searchQuery}
          onChangeText={handleSearchChange}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
        />

        <View style={styles.filterRow}>
          {FILTERS.map(({ key, label }) => (
            <Chip
              key={key}
              selected={activeFilter === key}
              onPress={() => (key === 'custom' ? handleOpenDatePicker() : handleFilterChange(key))}
              style={styles.chip}
              textStyle={styles.chipText}
            >
              {label}
            </Chip>
          ))}
        </View>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={palette.primary} />
          </View>
        ) : (
          <FlatList<GroupedMeals>
            data={groupedMeals}
            keyExtractor={(item) => item.dateLabel}
            renderItem={({ item }) => (
              <>
                <DateSectionHeader label={item.dateLabel} />
                {item.meals.map((meal: MealEntry) => (
                  <MealHistoryRow key={meal.id} meal={meal} onPress={() => handleMealPress(meal)} />
                ))}
              </>
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bgPage },
  container: { flex: 1 },
  title: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: FONT_WEIGHT.BOLD,
    color: palette.textPrimary,
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.SM,
  },
  searchBar: {
    marginHorizontal: SPACING.LG,
    marginBottom: SPACING.SM,
    backgroundColor: palette.bgCard,
    borderRadius: 12,
    elevation: 0,
  },
  searchInput: { fontSize: FONT_SIZE.MD },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.LG,
    gap: SPACING.SM,
    marginBottom: SPACING.MD,
    flexWrap: 'wrap',
  },
  chip: { borderRadius: 20 },
  chipText: { fontSize: FONT_SIZE.SM },
  list: { paddingBottom: SPACING.XXL },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
