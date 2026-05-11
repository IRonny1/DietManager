import React, { useLayoutEffect } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

import { useWeightLog } from './hooks/useWeightLog';
import { WeightTrendChart } from './components/WeightTrendChart';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';
import type { WeightEntry } from '@/types/weightTracking.types';
import type { TimeRange } from './hooks/useWeightLog';

const TIME_RANGES: TimeRange[] = ['1W', '1M', '3M', 'All'];

function getDelta(
  entries: WeightEntry[],
  index: number,
): { label: string; up: boolean } | null {
  if (index >= entries.length - 1) return null;
  const delta = parseFloat(
    (entries[index].weightKg - entries[index + 1].weightKg).toFixed(1),
  );
  if (delta === 0) return null;
  return { label: `${Math.abs(delta)} kg`, up: delta > 0 };
}

export function WeightLog(): React.JSX.Element {
  const navigation = useNavigation();
  const {
    currentWeight,
    weightChange,
    goalWeight,
    recentEntries,
    chartData,
    activeTimeRange,
    isLoading,
    handleTimeRangeChange,
    handleAddEntry,
    handleDeleteEntry,
  } = useWeightLog();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleAddEntry} style={{ marginRight: SPACING.MD }}>
          <MaterialCommunityIcons name="plus" size={24} color={palette.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleAddEntry]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Stats Row */}
      <View style={styles.statsCard}>
        <View style={styles.statCell}>
          <Text style={styles.statValue}>
            {currentWeight !== null ? currentWeight.toFixed(1) : '—'}
          </Text>
          <Text style={styles.statLabel}>Current (kg)</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCell}>
          <Text
            style={[
              styles.statValue,
              weightChange < 0 && styles.deltaDown,
              weightChange > 0 && styles.deltaUp,
            ]}
          >
            {weightChange === 0
              ? '—'
              : `${weightChange > 0 ? '+' : ''}${weightChange}`}
          </Text>
          <Text style={styles.statLabel}>Change (kg)</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCell}>
          <Text style={styles.statValue}>
            {goalWeight > 0 ? goalWeight.toFixed(1) : '—'}
          </Text>
          <Text style={styles.statLabel}>Goal (kg)</Text>
        </View>
      </View>

      {/* Trend Chart */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Weight Trend</Text>
        <WeightTrendChart chartData={chartData} goalWeight={goalWeight} />

        {/* Time Range Toggle */}
        <View style={styles.timeRangeRow}>
          {TIME_RANGES.map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                activeTimeRange === range && styles.timeRangeActive,
              ]}
              onPress={() => handleTimeRangeChange(range)}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  activeTimeRange === range && styles.timeRangeTextActive,
                ]}
              >
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Log History */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Log History</Text>
        {recentEntries.length === 0 ? (
          <Text style={styles.emptyText}>No weight entries yet. Tap + to add one.</Text>
        ) : (
          recentEntries.map((entry, index) => {
            const delta = getDelta(recentEntries, index);
            return (
              <View key={entry.id} style={styles.historyRow}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyDate}>{entry.date}</Text>
                  <Text style={styles.historyWeight}>{entry.weightKg.toFixed(1)} kg</Text>
                </View>
                {delta !== null && (
                  <Text
                    style={[
                      styles.historyDelta,
                      delta.up ? styles.deltaUp : styles.deltaDown,
                    ]}
                  >
                    {delta.up ? '↑' : '↓'} {delta.label}
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => handleDeleteEntry(entry.id)}
                  style={styles.deleteButton}
                >
                  <MaterialCommunityIcons name="delete-outline" size={20} color={palette.error} />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.bgPage,
  },
  scroll: {
    flex: 1,
    backgroundColor: palette.bgPage,
  },
  content: {
    padding: SPACING.LG,
    paddingBottom: SPACING.XXL,
    gap: SPACING.MD,
  },
  statsCard: {
    backgroundColor: palette.bgCard,
    borderRadius: BORDER_RADIUS.LG,
    flexDirection: 'row',
    padding: SPACING.LG,
    alignItems: 'center',
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZE.XL,
    fontWeight: FONT_WEIGHT.BOLD,
    color: palette.textPrimary,
  },
  statLabel: {
    fontSize: FONT_SIZE.XS,
    color: palette.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: palette.border,
  },
  deltaUp: { color: palette.error },
  deltaDown: { color: palette.primary },
  card: {
    backgroundColor: palette.bgCard,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
  },
  cardTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textPrimary,
    marginBottom: SPACING.SM,
  },
  timeRangeRow: {
    flexDirection: 'row',
    gap: SPACING.SM,
    marginTop: SPACING.MD,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.SM,
    alignItems: 'center',
    backgroundColor: palette.bgPage,
  },
  timeRangeActive: { backgroundColor: palette.primary },
  timeRangeText: {
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
  },
  timeRangeTextActive: {
    color: palette.white,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: palette.borderSubtle,
  },
  historyLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.MD,
  },
  historyDate: {
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
    minWidth: 80,
  },
  historyWeight: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textPrimary,
  },
  historyDelta: {
    fontSize: FONT_SIZE.SM,
    marginRight: SPACING.SM,
  },
  deleteButton: { padding: SPACING.XS },
  emptyText: {
    fontSize: FONT_SIZE.SM,
    color: palette.textTertiary,
    textAlign: 'center',
    paddingVertical: SPACING.LG,
  },
});
