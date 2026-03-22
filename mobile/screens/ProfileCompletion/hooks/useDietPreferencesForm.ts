import { useCallback, useState } from 'react';

import { useProfileStore } from '@/stores/useProfileStore';
import { PROFILE_VALIDATION_MESSAGES } from '@/constants/profile.constants';
import type { DietPreferences, DietType, ProfileStepData } from '@/types/profile.types';

import type { DietPreferencesFormValues } from '../types/profileCompletion.types';

type UseDietPreferencesFormReturn = {
  values: DietPreferencesFormValues;
  isSubmitting: boolean;
  serverError: string | null;
  validationError: string | null;
  setDietType: (type: string) => void;
  toggleCuisine: (cuisine: string) => void;
  onSubmit: () => Promise<void>;
};

export function useDietPreferencesForm(
  onNext: (data: ProfileStepData) => Promise<void>,
): UseDietPreferencesFormReturn {
  const profile = useProfileStore((state) => state.profile);
  const existingData = profile?.dietPreferences;

  const [values, setValues] = useState<DietPreferencesFormValues>({
    dietType: existingData?.dietType ?? '',
    cuisinePreferences: existingData?.cuisinePreferences ?? [],
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setDietType = useCallback((type: string): void => {
    setValidationError(null);
    setValues((prev) => ({ ...prev, dietType: type }));
  }, []);

  const toggleCuisine = useCallback((cuisine: string): void => {
    setValues((prev) => ({
      ...prev,
      cuisinePreferences: prev.cuisinePreferences.includes(cuisine)
        ? prev.cuisinePreferences.filter((c) => c !== cuisine)
        : [...prev.cuisinePreferences, cuisine],
    }));
  }, []);

  const onSubmit = useCallback(async (): Promise<void> => {
    if (!values.dietType) {
      setValidationError(PROFILE_VALIDATION_MESSAGES.DIET_TYPE_REQUIRED);
      return;
    }

    setServerError(null);
    setValidationError(null);
    setIsSubmitting(true);

    try {
      const data: DietPreferences = {
        dietType: values.dietType as DietType,
        cuisinePreferences: values.cuisinePreferences,
      };
      await onNext(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save. Please try again.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onNext]);

  return {
    values,
    isSubmitting,
    serverError,
    validationError,
    setDietType,
    toggleCuisine,
    onSubmit,
  };
}
