import { useCallback, useState } from 'react';

import { useRouter } from 'expo-router';

import { PROFILE_VALIDATION_MESSAGES } from '@/constants/profile.constants';
import { useProfileStore } from '@/stores/useProfileStore';
import {
  calculateBMR,
  calculateTDEE,
} from '@/services/calorieCalculator.service';
import type { ActivityLevel, PrimaryGoal } from '@/types/profile.types';

const PROFILE_GOAL_CALORIE_ADJUSTMENTS: Record<PrimaryGoal, number> = {
  lose_weight: -500,
  maintain_weight: 0,
  gain_muscle: 300,
  eat_healthier: 0,
};

type EditMyGoalsFormValues = {
  calorieGoal: string;
  primaryGoal: string;
  activityLevel: string;
};

type UseEditMyGoalsFormReturn = {
  values: EditMyGoalsFormValues;
  isSubmitting: boolean;
  serverError: string | null;
  validationErrors: Record<string, string>;
  setCalorieGoal: (val: string) => void;
  setPrimaryGoal: (val: string) => void;
  setActivityLevel: (val: string) => void;
  onSubmit: () => Promise<void>;
};

export function useEditMyGoalsForm(): UseEditMyGoalsFormReturn {
  const router = useRouter();
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);

  const [values, setValues] = useState<EditMyGoalsFormValues>({
    calorieGoal: profile?.calorieGoal ? String(profile.calorieGoal) : '',
    primaryGoal: profile?.goals?.primaryGoal ?? '',
    activityLevel: profile?.goals?.activityLevel ?? '',
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearFieldError = useCallback((field: string): void => {
    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const setCalorieGoal = useCallback(
    (val: string): void => {
      clearFieldError('calorieGoal');
      setValues((prev) => ({ ...prev, calorieGoal: val }));
    },
    [clearFieldError],
  );

  const setPrimaryGoal = useCallback(
    (val: string): void => {
      clearFieldError('primaryGoal');
      setValues((prev) => ({ ...prev, primaryGoal: val }));
    },
    [clearFieldError],
  );

  const setActivityLevel = useCallback(
    (val: string): void => {
      clearFieldError('activityLevel');
      setValues((prev) => ({ ...prev, activityLevel: val }));
    },
    [clearFieldError],
  );

  const onSubmit = useCallback(async (): Promise<void> => {
    const errors: Record<string, string> = {};

    if (!values.primaryGoal) {
      errors.primaryGoal = PROFILE_VALIDATION_MESSAGES.PRIMARY_GOAL_REQUIRED;
    }
    if (!values.activityLevel) {
      errors.activityLevel = PROFILE_VALIDATION_MESSAGES.ACTIVITY_LEVEL_REQUIRED;
    }

    const parsedCalorie = parseInt(values.calorieGoal, 10);
    if (values.calorieGoal && (isNaN(parsedCalorie) || parsedCalorie < 1200 || parsedCalorie > 10000)) {
      errors.calorieGoal = 'Please enter a calorie goal between 1,200 and 10,000';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setServerError(null);
    setValidationErrors({});
    setIsSubmitting(true);

    try {
      let finalCalorieGoal = parsedCalorie;

      // Recalculate if no manual calorie goal entered but body info is available
      const bodyInfo = profile?.basicBodyInfo;
      if (bodyInfo && values.primaryGoal && values.activityLevel && isNaN(parsedCalorie)) {
        const dob = new Date(bodyInfo.dateOfBirth);
        const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 3600 * 1000));
        const bmr = calculateBMR(bodyInfo.weightKg, bodyInfo.heightCm, age, bodyInfo.gender as 'male' | 'female' | 'other');
        const tdee = calculateTDEE(bmr, values.activityLevel as ActivityLevel);
        const adjustment = PROFILE_GOAL_CALORIE_ADJUSTMENTS[values.primaryGoal as PrimaryGoal] ?? 0;
        finalCalorieGoal = Math.max(1200, tdee + adjustment);
      }

      updateProfile({
        goals: {
          primaryGoal: values.primaryGoal as PrimaryGoal,
          activityLevel: values.activityLevel as ActivityLevel,
        },
        calorieGoal: isNaN(finalCalorieGoal) ? profile?.calorieGoal ?? null : finalCalorieGoal,
      });
      router.back();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save. Please try again.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, updateProfile, profile, router]);

  return {
    values,
    isSubmitting,
    serverError,
    validationErrors,
    setCalorieGoal,
    setPrimaryGoal,
    setActivityLevel,
    onSubmit,
  };
}
