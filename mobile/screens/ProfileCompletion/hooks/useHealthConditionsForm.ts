import { useCallback, useState } from 'react';

import { useProfileStore } from '@/stores/useProfileStore';
import type { HealthConditions, ProfileStepData } from '@/types/profile.types';

import type { HealthConditionsFormValues } from '../types/profileCompletion.types';

type UseHealthConditionsFormReturn = {
  values: HealthConditionsFormValues;
  isSubmitting: boolean;
  serverError: string | null;
  toggleAllergy: (allergy: string) => void;
  toggleIntolerance: (intolerance: string) => void;
  toggleCondition: (condition: string) => void;
  setCustomAllergyText: (text: string) => void;
  setCustomIntoleranceText: (text: string) => void;
  setCustomConditionText: (text: string) => void;
  addCustomAllergy: () => void;
  addCustomIntolerance: () => void;
  addCustomCondition: () => void;
  onSubmit: () => Promise<void>;
};

export function useHealthConditionsForm(
  onNext: (data: ProfileStepData) => Promise<void>,
): UseHealthConditionsFormReturn {
  const profile = useProfileStore((state) => state.profile);
  const existingData = profile?.healthConditions;

  const [values, setValues] = useState<HealthConditionsFormValues>({
    allergies: existingData?.allergies ?? [],
    intolerances: existingData?.intolerances ?? [],
    medicalConditions: existingData?.medicalConditions ?? [],
    customAllergyText: '',
    customIntoleranceText: '',
    customConditionText: '',
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleAllergy = useCallback((allergy: string): void => {
    setValues((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter((a) => a !== allergy)
        : [...prev.allergies, allergy],
    }));
  }, []);

  const toggleIntolerance = useCallback((intolerance: string): void => {
    setValues((prev) => ({
      ...prev,
      intolerances: prev.intolerances.includes(intolerance)
        ? prev.intolerances.filter((i) => i !== intolerance)
        : [...prev.intolerances, intolerance],
    }));
  }, []);

  const toggleCondition = useCallback((condition: string): void => {
    setValues((prev) => {
      // If "None" is selected, clear all other conditions
      if (condition === 'None') {
        return {
          ...prev,
          medicalConditions: prev.medicalConditions.includes('None') ? [] : ['None'],
        };
      }
      // If selecting a condition while "None" is selected, remove "None"
      const withoutNone = prev.medicalConditions.filter((c) => c !== 'None');
      return {
        ...prev,
        medicalConditions: withoutNone.includes(condition)
          ? withoutNone.filter((c) => c !== condition)
          : [...withoutNone, condition],
      };
    });
  }, []);

  const setCustomAllergyText = useCallback((text: string): void => {
    setValues((prev) => ({ ...prev, customAllergyText: text }));
  }, []);

  const setCustomIntoleranceText = useCallback((text: string): void => {
    setValues((prev) => ({ ...prev, customIntoleranceText: text }));
  }, []);

  const setCustomConditionText = useCallback((text: string): void => {
    setValues((prev) => ({ ...prev, customConditionText: text }));
  }, []);

  const addCustomAllergy = useCallback((): void => {
    const text = values.customAllergyText.trim();
    if (text && !values.allergies.includes(text)) {
      setValues((prev) => ({
        ...prev,
        allergies: [...prev.allergies, text],
        customAllergyText: '',
      }));
    }
  }, [values.customAllergyText, values.allergies]);

  const addCustomIntolerance = useCallback((): void => {
    const text = values.customIntoleranceText.trim();
    if (text && !values.intolerances.includes(text)) {
      setValues((prev) => ({
        ...prev,
        intolerances: [...prev.intolerances, text],
        customIntoleranceText: '',
      }));
    }
  }, [values.customIntoleranceText, values.intolerances]);

  const addCustomCondition = useCallback((): void => {
    const text = values.customConditionText.trim();
    if (text && !values.medicalConditions.includes(text)) {
      setValues((prev) => ({
        ...prev,
        medicalConditions: [...prev.medicalConditions.filter((c) => c !== 'None'), text],
        customConditionText: '',
      }));
    }
  }, [values.customConditionText, values.medicalConditions]);

  const onSubmit = useCallback(async (): Promise<void> => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      // Separate predefined from custom entries
      const data: HealthConditions = {
        allergies: values.allergies,
        intolerances: values.intolerances,
        medicalConditions: values.medicalConditions,
        customAllergies: [],
        customIntolerances: [],
        customMedicalConditions: [],
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
    toggleAllergy,
    toggleIntolerance,
    toggleCondition,
    setCustomAllergyText,
    setCustomIntoleranceText,
    setCustomConditionText,
    addCustomAllergy,
    addCustomIntolerance,
    addCustomCondition,
    onSubmit,
  };
}
