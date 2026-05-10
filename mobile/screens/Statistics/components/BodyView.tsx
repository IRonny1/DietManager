// mobile/screens/Statistics/components/BodyView.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { StatCard } from '@/components/StatCard/StatCard';
import { BMIScale } from '@/components/BMIScale/BMIScale';
import { WeightTrendChart } from './WeightTrendChart';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';
import type { BodyStats } from '@/types/statistics.types';
import type { WeightEntry } from '@/services/weightLog.service';

type BodyViewProps = {
  stats: BodyStats;
  recentEntries: WeightEntry[];
  onAddEntry: () => void;
  onViewAll: () => void;
};

function formatWeightChange(change: number): string {
  if (change === 0) return '—';
  return `${change > 0 ? '+' : ''}${change} kg`;
}

function formatEntryDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function BodyView({
  stats,
  recentEntries,
  onAddEntry,
  onViewAll,
}: BodyViewProps): React.JSX.Element {
  return (
    <>
      <View style={styles.statRow}>
        <StatCard label="Current" value={stats.currentWeight} unit="kg" />
        <StatCard label="Change" value={formatWeightChange(stats.weightChange)} />
        <StatCard label="Goal" value={`${stats.progressPercent}%`} />
      </View>

      <WeightTrendChart weightTrend={stats.weightTrend} goalWeight={stats.goalWeight} />

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>Weight Log History</Text>
          <Button mode="text" compact onPress={onAddEntry} textColor={palette.primary}>
            + Add Entry
          </Button>
        </View>

        {recentEntries.slice(0, 3).map((entry, index) => {
          const prev = recentEntries[index + 1];
          const delta =
            prev !== undefined
              ? Math.round((entry.weightKg - prev.weightKg) * 10) / 10
              : null;
          return (
            <View key={entry.id} style={styles.entryRow}>
              <Text style={styles.entryDate}>{formatEntryDate(entry.date)}</Text>
              <Text style={styles.entryWeight}>{entry.weightKg} kg</Text>
              {delta !== null ? (
                <Text
                  style={[
                    styles.entryDelta,
                    { color: delta <= 0 ? palette.primary : palette.error },
                  ]}
                >
                  {delta > 0 ? '↑' : '↓'} {Math.abs(delta)} kg
                </Text>
              ) : (
                <Text style={styles.entryDelta}>—</Text>
              )}
            </View>
          );
        })}

        {recentEntries.length === 0 && (
          <Text style={styles.emptyText}>
            No weight entries yet. Tap "+ Add Entry" to start.
          </Text>
        )}

        {recentEntries.length > 3 && (
          <Button mode="text" compact onPress={onViewAll} textColor={palette.accent}>
            View All Entries
          </Button>
        )}
      </View>

      <BMIScale bmi={stats.bmi} category={stats.bmiCategory} />
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textPrimary,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: palette.borderSubtle,
  },
  entryDate: {
    flex: 1,
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
  },
  entryWeight: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.MEDIUM,
    color: palette.textPrimary,
    marginRight: SPACING.MD,
  },
  entryDelta: {
    fontSize: FONT_SIZE.SM,
    width: 64,
    textAlign: 'right',
  },
  emptyText: {
    fontSize: FONT_SIZE.SM,
    color: palette.textTertiary,
    textAlign: 'center',
    paddingVertical: SPACING.MD,
  },
});
