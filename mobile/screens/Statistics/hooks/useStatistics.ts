// mobile/screens/Statistics/hooks/useStatistics.ts
import { useState, useCallback, useRef } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { getNutritionStats, getBodyStats } from '@/services/statistics.service';
import { getWeightEntries } from '@/services/weightLog.service';
import type { WeightEntry } from '@/services/weightLog.service';
import type {
  NutritionStats,
  BodyStats,
  StatTab,
  DatePeriod,
  MacroFilter,
} from '@/types/statistics.types';

export type UseStatisticsReturn = {
  activeTab: StatTab;
  activePeriod: DatePeriod;
  activeMacroFilter: MacroFilter;
  nutritionStats: NutritionStats | null;
  bodyStats: BodyStats | null;
  recentEntries: WeightEntry[];
  isLoading: boolean;
  error: string | null;
  periodLabel: string;
  handleTabChange: (tab: StatTab) => void;
  handlePeriodChange: (period: DatePeriod) => void;
  handleMacroFilterChange: (macro: MacroFilter) => void;
  handlePeriodPrevious: () => void;
  handlePeriodNext: () => void;
  handleAddWeightEntry: () => void;
  handleViewAllWeightEntries: () => void;
};

function getDateRange(period: DatePeriod, offset: number): { from: string; to: string } {
  const now = new Date();
  if (period === 'week') {
    const start = new Date(now);
    const dayOfWeek = now.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    start.setDate(now.getDate() - daysToMonday + offset * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return {
      from: start.toISOString().split('T')[0],
      to: end.toISOString().split('T')[0],
    };
  }
  const rawMonth = now.getMonth() + offset;
  const year = now.getFullYear() + Math.floor(rawMonth / 12);
  const month = ((rawMonth % 12) + 12) % 12;
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return {
    from: start.toISOString().split('T')[0],
    to: end.toISOString().split('T')[0],
  };
}

function formatPeriodLabel(period: DatePeriod, offset: number): string {
  const { from, to } = getDateRange(period, offset);
  const fromDate = new Date(from + 'T00:00:00');
  if (period === 'week') {
    const toDate = new Date(to + 'T00:00:00');
    const fromStr = fromDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const toStr = toDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${fromStr} – ${toStr}`;
  }
  return fromDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function useStatistics(): UseStatisticsReturn {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<StatTab>('nutrition');
  const [activePeriod, setActivePeriod] = useState<DatePeriod>('month');
  const [periodOffset, setPeriodOffset] = useState(0);
  const [activeMacroFilter, setActiveMacroFilter] = useState<MacroFilter>('protein');
  const [nutritionStats, setNutritionStats] = useState<NutritionStats | null>(null);
  const [bodyStats, setBodyStats] = useState<BodyStats | null>(null);
  const [recentEntries, setRecentEntries] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchIdRef = useRef(0);

  const fetchStats = useCallback(async (period: DatePeriod, offset: number): Promise<void> => {
    const id = ++fetchIdRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const dateRange = getDateRange(period, offset);
      const [nutrition, body, entries] = await Promise.all([
        getNutritionStats(dateRange),
        getBodyStats(dateRange),
        getWeightEntries(),
      ]);
      if (id === fetchIdRef.current) {
        setNutritionStats(nutrition);
        setBodyStats(body);
        setRecentEntries(entries);
      }
    } catch {
      if (id === fetchIdRef.current) {
        setError('Failed to load statistics. Tap to retry.');
      }
    } finally {
      if (id === fetchIdRef.current) setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchStats(activePeriod, periodOffset);
    }, [fetchStats, activePeriod, periodOffset]),
  );

  const handlePeriodChange = useCallback(
    (period: DatePeriod): void => {
      setActivePeriod(period);
      setPeriodOffset(0);
      fetchStats(period, 0);
    },
    [fetchStats],
  );

  const handlePeriodPrevious = useCallback((): void => {
    const next = periodOffset - 1;
    setPeriodOffset(next);
    fetchStats(activePeriod, next);
  }, [periodOffset, activePeriod, fetchStats]);

  const handlePeriodNext = useCallback((): void => {
    if (periodOffset >= 0) return;
    const next = periodOffset + 1;
    setPeriodOffset(next);
    fetchStats(activePeriod, next);
  }, [periodOffset, activePeriod, fetchStats]);

  return {
    activeTab,
    activePeriod,
    activeMacroFilter,
    nutritionStats,
    bodyStats,
    recentEntries,
    isLoading,
    error,
    periodLabel: formatPeriodLabel(activePeriod, periodOffset),
    handleTabChange: setActiveTab,
    handlePeriodChange,
    handleMacroFilterChange: setActiveMacroFilter,
    handlePeriodPrevious,
    handlePeriodNext,
    handleAddWeightEntry: () => router.push('/modal'),
    handleViewAllWeightEntries: () => router.push('/modal'),
  };
}
