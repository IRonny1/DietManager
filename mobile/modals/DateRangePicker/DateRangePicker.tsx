import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDateRangePicker } from './hooks/useDateRangePicker';
import { palette } from '@/constants/Colors';
import { SPACING } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

const WEEK_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function buildDaysGrid(year: number, month: number): Array<string | null> {
  const days: Array<string | null> = [];
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  for (let i = 0; i < offset; i++) days.push(null);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(
      `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    );
  }
  return days;
}

function chunkIntoWeeks(days: Array<string | null>): Array<Array<string | null>> {
  const weeks: Array<Array<string | null>> = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

export function DateRangePicker(): React.JSX.Element {
  const {
    displayMonth,
    startDate,
    endDate,
    handleDayPress,
    handlePrevMonth,
    handleNextMonth,
    handleConfirm,
    handleCancel,
    canConfirm,
  } = useDateRangePicker();

  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth();
  const monthLabel = displayMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weeks = chunkIntoWeeks(buildDaysGrid(year, month));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navBtn} activeOpacity={0.7}>
            <Text style={styles.navText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthLabel}>{monthLabel}</Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.navBtn} activeOpacity={0.7}>
            <Text style={styles.navText}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weekRow}>
          {WEEK_DAYS.map((day) => (
            <Text key={day} style={styles.weekDayLabel}>
              {day}
            </Text>
          ))}
        </View>

        {weeks.map((week, wi) => (
          <View key={wi} style={styles.weekRow}>
            {week.map((dateStr, di) => {
              if (!dateStr) return <View key={di} style={styles.dayCell} />;

              const selected = dateStr === startDate || dateStr === endDate;
              const inRange =
                !!startDate &&
                !!endDate &&
                dateStr > startDate &&
                dateStr < endDate;

              return (
                <TouchableOpacity
                  key={di}
                  style={[
                    styles.dayCell,
                    inRange && styles.inRange,
                    selected && styles.selectedDay,
                  ]}
                  onPress={() => handleDayPress(dateStr)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dayText, selected && styles.selectedDayText]}>
                    {parseInt(dateStr.split('-')[2], 10)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        <View style={styles.rangeDisplay}>
          <Text style={styles.rangeLabel}>{startDate ?? '—'}</Text>
          <Text style={styles.rangeSeparator}> — </Text>
          <Text style={styles.rangeLabel}>{endDate ?? '—'}</Text>
        </View>

        <View style={styles.actions}>
          <Button mode="outlined" onPress={handleCancel} style={styles.actionBtn}>
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleConfirm}
            disabled={!canConfirm}
            style={styles.actionBtn}
          >
            Confirm
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bgPage },
  container: { flex: 1, padding: SPACING.LG },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.LG,
  },
  navBtn: { padding: SPACING.SM },
  navText: { fontSize: 28, color: palette.textPrimary, lineHeight: 32 },
  monthLabel: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.BOLD,
    color: palette.textPrimary,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.XS,
  },
  weekDayLabel: {
    width: 36,
    textAlign: 'center',
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
  },
  dayCell: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  dayText: { fontSize: FONT_SIZE.SM, color: palette.textPrimary },
  inRange: {
    backgroundColor: palette.primary + '33',
    borderRadius: 0,
  },
  selectedDay: { backgroundColor: palette.primary, borderRadius: 18 },
  selectedDayText: { color: palette.white, fontWeight: FONT_WEIGHT.BOLD },
  rangeDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.LG,
  },
  rangeLabel: {
    fontSize: FONT_SIZE.MD,
    color: palette.textPrimary,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  rangeSeparator: { color: palette.textSecondary, paddingHorizontal: SPACING.SM },
  actions: { flexDirection: 'row', gap: SPACING.MD, marginTop: SPACING.SM },
  actionBtn: { flex: 1 },
});
