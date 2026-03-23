import { useState, useEffect, useCallback } from 'react';

import { useRouter } from 'expo-router';

import { getTodayMeals } from '@/services/diary.service';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';
import type { MealEntry, DailyLog } from '@/types/diary.types';

type UseHomeReturn = {
  dailyLog: DailyLog | null;
  isLoading: boolean;
  greeting: string;
  userName: string;
  formattedDate: string;
  hasMeals: boolean;
  handleSeeAllPress: () => void;
  handleScanPress: () => void;
};

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 22) return 'Good Evening';
  return 'Good Night';
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function buildDailyLog(meals: MealEntry[], calorieGoal: number): DailyLog {
  const today = new Date().toISOString().split('T')[0];
  return {
    date: today,
    meals,
    totalCalories: meals.reduce((sum, m) => sum + m.calories, 0),
    totalProtein: meals.reduce((sum, m) => sum + m.protein, 0),
    totalFat: meals.reduce((sum, m) => sum + m.fat, 0),
    totalCarbs: meals.reduce((sum, m) => sum + m.carbs, 0),
    calorieGoal,
  };
}

const DEFAULT_CALORIE_GOAL = 2000;

export function useHome(): UseHomeReturn {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const onboardingData = useProfileStore((state) => state.onboardingData);
  const calorieGoal = onboardingData?.calorieGoal ?? DEFAULT_CALORIE_GOAL;

  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const now = new Date();
  const greeting = getGreeting(now.getHours());
  const formattedDate = formatDate(now);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    getTodayMeals()
      .then((meals) => {
        if (!cancelled) {
          setDailyLog(buildDailyLog(meals, calorieGoal));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [calorieGoal]);

  const handleSeeAllPress = useCallback((): void => {
    router.push('/(tabs)/history');
  }, [router]);

  const handleScanPress = useCallback((): void => {
    router.push('/(tabs)/scan');
  }, [router]);

  const userName = user?.email?.split('@')[0] ?? 'Alex';

  return {
    dailyLog,
    isLoading,
    greeting,
    userName,
    formattedDate,
    hasMeals: (dailyLog?.meals.length ?? 0) > 0,
    handleSeeAllPress,
    handleScanPress,
  };
}
