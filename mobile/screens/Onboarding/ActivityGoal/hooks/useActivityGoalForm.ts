import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityLevel, PrimaryGoal } from '../../../../types/onboarding.types';
import { useProfileStore } from '../../../../stores/useProfileStore';
import { calculateBMR, calculateTDEE, calculateCalorieGoal } from '../../../../services/calorieCalculator.service';

export function useActivityGoalForm(): {
  activityLevel: ActivityLevel;
  setActivityLevel: (v: ActivityLevel) => void;
  primaryGoal: PrimaryGoal;
  setPrimaryGoal: (v: PrimaryGoal) => void;
  isCalculating: boolean;
  onCalculate: () => Promise<void>;
} {
  const router = useRouter();
  const setOnboardingData = useProfileStore((s) => s.setOnboardingData);
  const onboardingData = useProfileStore((s) => s.onboardingData);

  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderately_active');
  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal>('maintain_weight');
  const [isCalculating, setIsCalculating] = useState(false);

  async function onCalculate(): Promise<void> {
    setIsCalculating(true);
    try {
      const pd = onboardingData.personalData;
      if (!pd) {
        router.push('/(onboarding)/personal-data');
        return;
      }
      const bmr = calculateBMR(pd.weightKg, pd.heightCm, pd.age, pd.gender);
      const tdee = calculateTDEE(bmr, activityLevel);
      const calorieGoal = calculateCalorieGoal(tdee, primaryGoal);
      setOnboardingData({ activityGoal: { activityLevel, primaryGoal }, calorieGoal });
      router.push('/(onboarding)/result');
    } finally {
      setIsCalculating(false);
    }
  }

  return { activityLevel, setActivityLevel, primaryGoal, setPrimaryGoal, isCalculating, onCalculate };
}
