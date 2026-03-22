import { useCallback, useState } from 'react';

import { PROFILE_VALIDATION_MESSAGES } from '@/constants/profile.constants';
import { useProfileStore } from '@/stores/useProfileStore';
import type { ActivityLevel, Goals, PrimaryGoal, ProfileStepData } from '@/types/profile.types';

import type { GoalsFormValues } from '../types/profileCompletion.types';

type UseGoalsFormReturn = {
  values: GoalsFormValues;
  isSubmitting: boolean;
  serverError: string | null;
  validationErrors: Record<string, string>;
  setPrimaryGoal: (goal: string) => void;
  setActivityLevel: (level: string) => void;
  onSubmit: () => Promise<void>;
};

export function useGoalsForm(
  onNext: (data: ProfileStepData) => Promise<void>,
): UseGoalsFormReturn {
  const profile = useProfileStore((state) => state.profile);
  const existingData = profile?.goals;

  const [values, setValues] = useState<GoalsFormValues>({
    primaryGoal: existingData?.primaryGoal ?? '',
    activityLevel: existingData?.activityLevel ?? '',
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setPrimaryGoal = useCallback((goal: string): void => {
    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next.primaryGoal;
      return next;
    });
    setValues((prev) => ({ ...prev, primaryGoal: goal }));
  }, []);

  const setActivityLevel = useCallback((level: string): void => {
    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next.activityLevel;
      return next;
    });
    setValues((prev) => ({ ...prev, activityLevel: level }));
  }, []);

  const onSubmit = useCallback(async (): Promise<void> => {
    const errors: Record<string, string> = {};

    if (!values.primaryGoal) {
      errors.primaryGoal = PROFILE_VALIDATION_MESSAGES.PRIMARY_GOAL_REQUIRED;
    }
    if (!values.activityLevel) {
      errors.activityLevel =
        PROFILE_VALIDATION_MESSAGES.ACTIVITY_LEVEL_REQUIRED;
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setServerError(null);
    setValidationErrors({});
    setIsSubmitting(true);

    try {
      const data: Goals = {
        primaryGoal: values.primaryGoal as PrimaryGoal,
        activityLevel: values.activityLevel as ActivityLevel,
      };
      await onNext(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to save. Please try again.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onNext]);

  return {
    values,
    isSubmitting,
    serverError,
    validationErrors,
    setPrimaryGoal,
    setActivityLevel,
    onSubmit,
  };
}
