# Meal History Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the History tab with a searchable, date-filtered list of meals grouped by date, plus a custom date range picker modal.

**Architecture:** The History screen reads from the existing `diary.service.ts#getMeals()`, groups and filters meals client-side in `useHistory`, and communicates the user-selected date range back from the DateRangePicker modal via a minimal `useDateRangeStore` Zustand store (the same cross-screen state pattern used for scan results). No new API endpoints are needed.

**Tech Stack:** React Native, Expo Router, React Native Paper, Zustand, TypeScript

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `mobile/stores/useDateRangeStore.ts` | Create | Shuttle confirmed date range from picker back to History |
| `mobile/components/DateSectionHeader/DateSectionHeader.tsx` | Create | Horizontal rule with date label |
| `mobile/components/MealHistoryRow/MealHistoryRow.tsx` | Create | Single meal row: thumbnail, name, macros, time, calories |
| `mobile/screens/History/hooks/useHistory.ts` | Create | All History screen state, filtering, grouping, navigation |
| `mobile/screens/History/History.tsx` | Create | History screen UI |
| `mobile/modals/DateRangePicker/hooks/useDateRangePicker.ts` | Create | Calendar state: month navigation, day selection, confirmation |
| `mobile/modals/DateRangePicker/DateRangePicker.tsx` | Create | Calendar grid modal UI |
| `mobile/app/(tabs)/history.tsx` | Modify | Replace placeholder stub with real History screen |
| `mobile/app/date-range-picker.tsx` | Create | Modal route entry point for DateRangePicker |

---

## Task 1: useDateRangeStore

**Files:**
- Create: `mobile/stores/useDateRangeStore.ts`

- [ ] **Step 1: Create the store**

```typescript
// mobile/stores/useDateRangeStore.ts
import { create } from 'zustand';

interface DateRangeStoreState {
  confirmedRange: { from: string; to: string } | null;
  setConfirmedRange: (range: { from: string; to: string } | null) => void;
}

export const useDateRangeStore = create<DateRangeStoreState>((set) => ({
  confirmedRange: null,
  setConfirmedRange: (range) => set({ confirmedRange: range }),
}));
```

- [ ] **Step 2: Type-check**

```bash
cd mobile && npx tsc --noEmit 2>&1 | grep useDateRangeStore
```
Expected: no output (no errors for this file).

- [ ] **Step 3: Commit**

```bash
git add mobile/stores/useDateRangeStore.ts
git commit -m "feat(history): add useDateRangeStore for date range picker communication"
```

---

## Task 2: DateSectionHeader Component

**Files:**
- Create: `mobile/components/DateSectionHeader/DateSectionHeader.tsx`

- [ ] **Step 1: Create the component**

```tsx
// mobile/components/DateSectionHeader/DateSectionHeader.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '@/constants/Colors';
import { SPACING } from '@/constants/spacing.constants';
import { FONT_SIZE } from '@/constants/typography.constants';

type DateSectionHeaderProps = {
  label: string;
};

export function DateSectionHeader({ label }: DateSectionHeaderProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.SM,
    marginTop: SPACING.MD,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: palette.border,
  },
  label: {
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
    paddingHorizontal: SPACING.SM,
  },
});
```

**Suggested test:** `mobile/components/DateSectionHeader/DateSectionHeader.ui.test.tsx` — verify the label text is rendered and the two line dividers are present.

- [ ] **Step 2: Type-check**

```bash
cd mobile && npx tsc --noEmit 2>&1 | grep DateSectionHeader
```
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add mobile/components/DateSectionHeader/DateSectionHeader.tsx
git commit -m "feat(history): add DateSectionHeader component"
```

---

## Task 3: MealHistoryRow Component

**Files:**
- Create: `mobile/components/MealHistoryRow/MealHistoryRow.tsx`

- [ ] **Step 1: Create the component**

```tsx
// mobile/components/MealHistoryRow/MealHistoryRow.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '@/constants/Colors';
import { SPACING } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';
import type { MealEntry } from '@/types/diary.types';

type MealHistoryRowProps = {
  meal: MealEntry;
  onPress: () => void;
};

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function MealHistoryRow({ meal, onPress }: MealHistoryRowProps): React.JSX.Element {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.thumbnail} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {meal.name}
        </Text>
        <Text style={styles.macros}>
          P: {meal.protein}g · F: {meal.fat}g · C: {meal.carbs}g
        </Text>
        <Text style={styles.time}>{formatTime(meal.loggedAt)}</Text>
      </View>
      <Text style={styles.calories}>{meal.calories} kcal</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.bgCard,
    marginHorizontal: SPACING.LG,
    marginBottom: SPACING.SM,
    borderRadius: 12,
    padding: SPACING.MD,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: palette.border,
    marginRight: SPACING.MD,
    flexShrink: 0,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textPrimary,
    marginBottom: 2,
  },
  macros: {
    fontSize: FONT_SIZE.XS,
    color: palette.textSecondary,
    marginBottom: 2,
  },
  time: {
    fontSize: FONT_SIZE.XS,
    color: palette.textSecondary,
  },
  calories: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textPrimary,
    marginLeft: SPACING.SM,
  },
});
```

**Suggested test:** `mobile/components/MealHistoryRow/MealHistoryRow.ui.test.tsx` — verify meal name, calorie count, and formatted macros are rendered; verify `onPress` is called when tapped.

- [ ] **Step 2: Type-check**

```bash
cd mobile && npx tsc --noEmit 2>&1 | grep MealHistoryRow
```
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add mobile/components/MealHistoryRow/MealHistoryRow.tsx
git commit -m "feat(history): add MealHistoryRow component"
```

---

## Task 4: useHistory Hook

**Files:**
- Create: `mobile/screens/History/hooks/useHistory.ts`

- [ ] **Step 1: Create the hook**

```typescript
// mobile/screens/History/hooks/useHistory.ts
import { useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { getMeals } from '@/services/diary.service';
import { useDateRangeStore } from '@/stores/useDateRangeStore';
import type { MealEntry } from '@/types/diary.types';

export type DateFilter = 'today' | 'week' | 'month' | 'custom';

export interface GroupedMeals {
  dateLabel: string;
  meals: MealEntry[];
}

type UseHistoryReturn = {
  groupedMeals: GroupedMeals[];
  searchQuery: string;
  activeFilter: DateFilter;
  isLoading: boolean;
  handleSearchChange: (query: string) => void;
  handleFilterChange: (filter: DateFilter) => void;
  handleMealPress: (meal: MealEntry) => void;
  handleOpenDatePicker: () => void;
};

function getDateRange(
  filter: DateFilter,
  customRange: { from: string; to: string } | null,
): { from: string; to: string } {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  if (filter === 'today') return { from: todayStr, to: todayStr };

  if (filter === 'week') {
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay());
    return { from: start.toISOString().split('T')[0], to: todayStr };
  }

  if (filter === 'month') {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from: start.toISOString().split('T')[0], to: todayStr };
  }

  return customRange ?? { from: todayStr, to: todayStr };
}

function formatDateLabel(dateStr: string): string {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const date = new Date(dateStr + 'T00:00:00');
  const shortDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (dateStr === today) return `Today, ${shortDate}`;
  if (dateStr === yesterday) return `Yesterday, ${shortDate}`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function groupMealsByDate(meals: MealEntry[]): GroupedMeals[] {
  const groups = new Map<string, MealEntry[]>();
  const sorted = [...meals].sort(
    (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime(),
  );
  for (const meal of sorted) {
    if (!groups.has(meal.date)) groups.set(meal.date, []);
    groups.get(meal.date)!.push(meal);
  }
  return Array.from(groups.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dateKey, groupedMeals]) => ({ dateLabel: formatDateLabel(dateKey), meals: groupedMeals }));
}

export function useHistory(): UseHistoryReturn {
  const router = useRouter();
  const confirmedRange = useDateRangeStore((s) => s.confirmedRange);
  const setConfirmedRange = useDateRangeStore((s) => s.setConfirmedRange);

  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<DateFilter>('today');
  const [customDateRange, setCustomDateRange] = useState<{ from: string; to: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMeals = useCallback(
    async (filter: DateFilter, customRange: { from: string; to: string } | null): Promise<void> => {
      setIsLoading(true);
      try {
        const range = getDateRange(filter, customRange);
        const data = await getMeals(range);
        setMeals(data);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      if (confirmedRange) {
        setCustomDateRange(confirmedRange);
        setActiveFilter('custom');
        setConfirmedRange(null);
        void fetchMeals('custom', confirmedRange);
      } else {
        void fetchMeals(activeFilter, customDateRange);
      }
    }, [confirmedRange, setConfirmedRange, fetchMeals, activeFilter, customDateRange]),
  );

  const filtered = searchQuery.trim()
    ? meals.filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : meals;

  const groupedMeals = groupMealsByDate(filtered);

  const handleSearchChange = useCallback((query: string): void => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback(
    (filter: DateFilter): void => {
      setActiveFilter(filter);
      void fetchMeals(filter, customDateRange);
    },
    [fetchMeals, customDateRange],
  );

  const handleMealPress = useCallback(
    (meal: MealEntry): void => {
      router.push({ pathname: '/edit-meal', params: { mealId: meal.id } });
    },
    [router],
  );

  const handleOpenDatePicker = useCallback((): void => {
    router.push('/date-range-picker');
  }, [router]);

  return {
    groupedMeals,
    searchQuery,
    activeFilter,
    isLoading,
    handleSearchChange,
    handleFilterChange,
    handleMealPress,
    handleOpenDatePicker,
  };
}
```

**Suggested test:** `mobile/screens/History/hooks/useHistory.test.ts` — test `groupMealsByDate` in isolation: correct grouping by `date` field, descending sort by date, "Today"/"Yesterday" labels, and search filtering logic via `useHistory` with mocked `getMeals`.

- [ ] **Step 2: Type-check**

```bash
cd mobile && npx tsc --noEmit 2>&1 | grep useHistory
```
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add mobile/screens/History/hooks/useHistory.ts
git commit -m "feat(history): add useHistory hook with groupMealsByDate and date filter logic"
```

---

## Task 5: History Screen

**Files:**
- Create: `mobile/screens/History/History.tsx`

- [ ] **Step 1: Create the screen**

```tsx
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
```

- [ ] **Step 2: Type-check**

```bash
cd mobile && npx tsc --noEmit 2>&1 | grep -E "History\.tsx"
```
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add mobile/screens/History/History.tsx
git commit -m "feat(history): add History screen component"
```

---

## Task 6: DateRangePicker Modal

**Files:**
- Create: `mobile/modals/DateRangePicker/hooks/useDateRangePicker.ts`
- Create: `mobile/modals/DateRangePicker/DateRangePicker.tsx`

- [ ] **Step 1: Create useDateRangePicker hook**

```typescript
// mobile/modals/DateRangePicker/hooks/useDateRangePicker.ts
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useDateRangeStore } from '@/stores/useDateRangeStore';

type UseDateRangePickerReturn = {
  displayMonth: Date;
  startDate: string | null;
  endDate: string | null;
  handleDayPress: (dateStr: string) => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleConfirm: () => void;
  handleCancel: () => void;
  canConfirm: boolean;
};

export function useDateRangePicker(): UseDateRangePickerReturn {
  const router = useRouter();
  const setConfirmedRange = useDateRangeStore((s) => s.setConfirmedRange);

  const [displayMonth, setDisplayMonth] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleDayPress = useCallback(
    (dateStr: string): void => {
      if (!startDate || (startDate && endDate)) {
        setStartDate(dateStr);
        setEndDate(null);
      } else if (dateStr < startDate) {
        setEndDate(startDate);
        setStartDate(dateStr);
      } else {
        setEndDate(dateStr);
      }
    },
    [startDate, endDate],
  );

  const handlePrevMonth = useCallback((): void => {
    setDisplayMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback((): void => {
    setDisplayMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }, []);

  const handleConfirm = useCallback((): void => {
    if (!startDate || !endDate) return;
    setConfirmedRange({ from: startDate, to: endDate });
    router.back();
  }, [startDate, endDate, setConfirmedRange, router]);

  const handleCancel = useCallback((): void => {
    router.back();
  }, [router]);

  return {
    displayMonth,
    startDate,
    endDate,
    handleDayPress,
    handlePrevMonth,
    handleNextMonth,
    handleConfirm,
    handleCancel,
    canConfirm: !!startDate && !!endDate,
  };
}
```

**Suggested test:** `mobile/modals/DateRangePicker/hooks/useDateRangePicker.test.ts` — test `handleDayPress` sequence: first tap sets startDate, second tap sets endDate; tap earlier date swaps start/end; tapping when both selected resets to new startDate.

- [ ] **Step 2: Create DateRangePicker component**

```tsx
// mobile/modals/DateRangePicker/DateRangePicker.tsx
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
    <SafeAreaView style={styles.safe}>
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

              const isStart = dateStr === startDate;
              const isEnd = dateStr === endDate;
              const selected = isStart || isEnd;
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
```

- [ ] **Step 3: Type-check**

```bash
cd mobile && npx tsc --noEmit 2>&1 | grep -E "DateRangePicker|useDateRangePicker"
```
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add mobile/modals/DateRangePicker/hooks/useDateRangePicker.ts mobile/modals/DateRangePicker/DateRangePicker.tsx
git commit -m "feat(history): add DateRangePicker modal with calendar grid"
```

---

## Task 7: Wire Up Routes

**Files:**
- Modify: `mobile/app/(tabs)/history.tsx`
- Create: `mobile/app/date-range-picker.tsx`

- [ ] **Step 1: Replace history tab stub**

Replace the entire content of `mobile/app/(tabs)/history.tsx` with:

```tsx
// mobile/app/(tabs)/history.tsx
import { History } from '../../screens/History/History';
export default History;
```

- [ ] **Step 2: Create date-range-picker modal route**

```tsx
// mobile/app/date-range-picker.tsx
import { DateRangePicker } from '../modals/DateRangePicker/DateRangePicker';
export default DateRangePicker;
```

- [ ] **Step 3: Type-check the full project**

```bash
cd mobile && npx tsc --noEmit 2>&1
```
Expected: same pre-existing errors as before (in `_layout.tsx`, `Themed.tsx`, `useColorScheme.ts`) — no new errors.

- [ ] **Step 4: Commit**

```bash
git add mobile/app/(tabs)/history.tsx mobile/app/date-range-picker.tsx
git commit -m "feat(history): wire History screen and DateRangePicker modal routes"
```

---

## Verification Checklist

Run through these manually after implementation:

1. History tab shows today's meals on first load
2. "This Week" / "This Month" chips fetch the correct date range
3. "Custom" chip opens the DateRangePicker modal
4. Selecting a date range in the picker and tapping Confirm returns to History and filters the list
5. Search bar filters meals by name in real time (client-side, no re-fetch)
6. Meals are grouped under date section headers, newest group first
7. Tapping a meal row navigates to the Edit Meal screen
8. `npx tsc --noEmit` introduces no new TypeScript errors
