import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useProfileStore } from '../../../../stores/useProfileStore';

const MIN_CALORIES = 1200;
const MAX_CALORIES = 5000;
const STEP = 50;

export function useManualEntryForm(): {
  calories: number;
  increment: () => void;
  decrement: () => void;
  onSetGoal: () => void;
  onCalculateInstead: () => void;
} {
  const router = useRouter();
  const setOnboardingData = useProfileStore((s) => s.setOnboardingData);
  const [calories, setCalories] = useState(2000);

  function increment(): void {
    setCalories((prev) => Math.min(prev + STEP, MAX_CALORIES));
  }

  function decrement(): void {
    setCalories((prev) => Math.max(prev - STEP, MIN_CALORIES));
  }

  function onSetGoal(): void {
    setOnboardingData({ calorieGoal: calories });
    router.push('/(onboarding)/result');
  }

  function onCalculateInstead(): void {
    router.push('/(onboarding)/personal-data');
  }

  return { calories, increment, decrement, onSetGoal, onCalculateInstead };
}
