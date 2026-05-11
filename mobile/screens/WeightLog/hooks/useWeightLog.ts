import { useState, useCallback, useRef } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';

import {
  getWeightEntries,
  getLatestWeight,
  deleteWeightEntry,
  getWeightChange,
  getWeightGoal,
} from '@/services/weightLog.service';
import type { WeightEntry } from '@/types/weightTracking.types';

export type TimeRange = '1W' | '1M' | '3M' | 'All';

type ChartPoint = { date: string; weight: number };

type UseWeightLogReturn = {
  currentWeight: number | null;
  weightChange: number;
  goalWeight: number;
  recentEntries: WeightEntry[];
  chartData: ChartPoint[];
  activeTimeRange: TimeRange;
  isLoading: boolean;
  handleTimeRangeChange: (range: TimeRange) => void;
  handleAddEntry: () => void;
  handleDeleteEntry: (id: string) => Promise<void>;
};

function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getFromDate(range: TimeRange): string | null {
  if (range === 'All') return null;
  const now = new Date();
  const days = range === '1W' ? 7 : range === '1M' ? 30 : 90;
  const from = new Date(now);
  from.setDate(now.getDate() - days);
  return toLocalDateStr(from);
}

export function useWeightLog(): UseWeightLogReturn {
  const router = useRouter();
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [weightChange, setWeightChange] = useState(0);
  const [recentEntries, setRecentEntries] = useState<WeightEntry[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [activeTimeRange, setActiveTimeRange] = useState<TimeRange>('1M');
  const [isLoading, setIsLoading] = useState(true);
  const goalWeight = getWeightGoal();
  const loadIdRef = useRef(0);

  const loadData = useCallback(async (range: TimeRange): Promise<void> => {
    const id = ++loadIdRef.current;
    setIsLoading(true);
    try {
      const fromDate = getFromDate(range);
      const dateRange = fromDate ? { from: fromDate, to: toLocalDateStr(new Date()) } : undefined;
      const [all, filtered, latest] = await Promise.all([
        getWeightEntries(),
        getWeightEntries(dateRange),
        getLatestWeight(),
      ]);
      if (id === loadIdRef.current) {
        setCurrentWeight(latest?.weightKg ?? null);
        setWeightChange(getWeightChange(all));
        setRecentEntries(all);
        setChartData(
          [...filtered]
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((e) => ({ date: e.date, weight: e.weightKg })),
        );
      }
    } finally {
      if (id === loadIdRef.current) setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData(activeTimeRange);
    }, [loadData, activeTimeRange]),
  );

  const handleTimeRangeChange = useCallback((range: TimeRange): void => {
    setActiveTimeRange(range);
  }, []);

  const handleAddEntry = useCallback((): void => {
    router.push('/log-weight');
  }, [router]);

  const handleDeleteEntry = useCallback(async (id: string): Promise<void> => {
    await deleteWeightEntry(id);
    await loadData(activeTimeRange);
  }, [loadData, activeTimeRange]);

  return {
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
  };
}
