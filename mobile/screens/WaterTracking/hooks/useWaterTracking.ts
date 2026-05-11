import { useState, useCallback, useRef } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';

import {
  getTodayWaterLog,
  addWaterEntry,
  deleteWaterEntry,
  clearTodayLog,
  updateDailyGoal,
} from '@/services/waterTracking.service';
import type { WaterEntry } from '@/types/waterTracking.types';

type UseWaterTrackingReturn = {
  todayTotal: number;
  dailyGoalMl: number;
  progressPercent: number;
  entries: WaterEntry[];
  isLoading: boolean;
  isEditGoalVisible: boolean;
  editGoalValue: string;
  handleQuickAdd: (amountMl: number) => Promise<void>;
  handleLogCustomAmount: () => void;
  handleDeleteEntry: (id: string) => Promise<void>;
  handleClearAll: () => Promise<void>;
  handleEditGoal: () => void;
  handleEditGoalChange: (value: string) => void;
  handleEditGoalSave: () => Promise<void>;
  handleEditGoalCancel: () => void;
};

export function useWaterTracking(): UseWaterTrackingReturn {
  const router = useRouter();
  const [todayTotal, setTodayTotal] = useState(0);
  const [dailyGoalMl, setDailyGoalMl] = useState(2000);
  const [entries, setEntries] = useState<WaterEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditGoalVisible, setIsEditGoalVisible] = useState(false);
  const [editGoalValue, setEditGoalValue] = useState('');
  const loadIdRef = useRef(0);

  const loadData = useCallback(async (): Promise<void> => {
    const id = ++loadIdRef.current;
    setIsLoading(true);
    try {
      const data = await getTodayWaterLog();
      if (id === loadIdRef.current) {
        setTodayTotal(data.total);
        setDailyGoalMl(data.goal);
        setEntries(data.entries);
      }
    } finally {
      if (id === loadIdRef.current) setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleQuickAdd = useCallback(async (amountMl: number): Promise<void> => {
    await addWaterEntry(amountMl);
    await loadData();
  }, [loadData]);

  const handleLogCustomAmount = useCallback((): void => {
    router.push('/log-custom-amount');
  }, [router]);

  const handleDeleteEntry = useCallback(async (id: string): Promise<void> => {
    await deleteWaterEntry(id);
    await loadData();
  }, [loadData]);

  const handleClearAll = useCallback(async (): Promise<void> => {
    await clearTodayLog();
    await loadData();
  }, [loadData]);

  const handleEditGoal = useCallback((): void => {
    setEditGoalValue(String(dailyGoalMl));
    setIsEditGoalVisible(true);
  }, [dailyGoalMl]);

  const handleEditGoalChange = useCallback((value: string): void => {
    setEditGoalValue(value);
  }, []);

  const handleEditGoalSave = useCallback(async (): Promise<void> => {
    const parsed = parseInt(editGoalValue, 10);
    if (!isNaN(parsed) && parsed > 0) {
      await updateDailyGoal(parsed);
      setDailyGoalMl(parsed);
    }
    setIsEditGoalVisible(false);
  }, [editGoalValue]);

  const handleEditGoalCancel = useCallback((): void => {
    setIsEditGoalVisible(false);
  }, []);

  const progressPercent = dailyGoalMl > 0 ? Math.min((todayTotal / dailyGoalMl) * 100, 100) : 0;

  return {
    todayTotal,
    dailyGoalMl,
    progressPercent,
    entries,
    isLoading,
    isEditGoalVisible,
    editGoalValue,
    handleQuickAdd,
    handleLogCustomAmount,
    handleDeleteEntry,
    handleClearAll,
    handleEditGoal,
    handleEditGoalChange,
    handleEditGoalSave,
    handleEditGoalCancel,
  };
}
