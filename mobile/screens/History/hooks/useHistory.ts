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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/date-range-picker' as any);
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
