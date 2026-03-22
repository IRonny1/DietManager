import { useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import {
  HEIGHT_LIMITS,
  MAX_AGE,
  MIN_AGE,
  PROFILE_VALIDATION_MESSAGES,
  WEIGHT_LIMITS,
} from '@/constants/profile.constants';
import { useProfileStore } from '@/stores/useProfileStore';
import type { BasicBodyInfo, MeasurementSystem, ProfileStepData } from '@/types/profile.types';

import type { BasicBodyInfoFormValues } from '../types/profileCompletion.types';

function getBodyInfoSchema(system: MeasurementSystem) {
  const heightLimits =
    system === 'metric' ? HEIGHT_LIMITS.metric : { min: 30, max: 120, unit: 'in' };
  const weightLimits =
    system === 'metric' ? WEIGHT_LIMITS.metric : WEIGHT_LIMITS.imperial;

  return z.object({
    dateOfBirth: z.string().min(1, PROFILE_VALIDATION_MESSAGES.DATE_OF_BIRTH_REQUIRED).refine(
      (val) => {
        const date = new Date(val);
        if (isNaN(date.getTime())) return false;
        const ageDiff = Date.now() - date.getTime();
        const ageDate = new Date(ageDiff);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        return age >= MIN_AGE && age <= MAX_AGE;
      },
      { message: PROFILE_VALIDATION_MESSAGES.DATE_OF_BIRTH_TOO_YOUNG },
    ),
    gender: z.string().min(1, PROFILE_VALIDATION_MESSAGES.GENDER_REQUIRED),
    height: z
      .string()
      .min(1, PROFILE_VALIDATION_MESSAGES.HEIGHT_REQUIRED)
      .refine(
        (val) => {
          const num = parseFloat(val);
          return !isNaN(num) && num >= heightLimits.min && num <= heightLimits.max;
        },
        { message: PROFILE_VALIDATION_MESSAGES.HEIGHT_INVALID },
      ),
    weight: z
      .string()
      .min(1, PROFILE_VALIDATION_MESSAGES.WEIGHT_REQUIRED)
      .refine(
        (val) => {
          const num = parseFloat(val);
          return !isNaN(num) && num >= weightLimits.min && num <= weightLimits.max;
        },
        { message: PROFILE_VALIDATION_MESSAGES.WEIGHT_INVALID },
      ),
    targetWeight: z
      .string()
      .min(1, PROFILE_VALIDATION_MESSAGES.TARGET_WEIGHT_REQUIRED)
      .refine(
        (val) => {
          const num = parseFloat(val);
          return !isNaN(num) && num >= weightLimits.min && num <= weightLimits.max;
        },
        { message: PROFILE_VALIDATION_MESSAGES.TARGET_WEIGHT_INVALID },
      ),
  });
}

function toMetricHeight(value: number, system: MeasurementSystem): number {
  return system === 'imperial' ? Math.round(value * 2.54) : value;
}

function toMetricWeight(value: number, system: MeasurementSystem): number {
  return system === 'imperial'
    ? Math.round(value * 0.453592 * 10) / 10
    : value;
}

type UseBasicBodyInfoFormReturn = {
  form: UseFormReturn<BasicBodyInfoFormValues>;
  measurementSystem: MeasurementSystem;
  setMeasurementSystem: (system: MeasurementSystem) => void;
  isSubmitting: boolean;
  serverError: string | null;
  onSubmit: () => Promise<void>;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
};

export function useBasicBodyInfoForm(
  onNext: (data: ProfileStepData) => Promise<void>,
): UseBasicBodyInfoFormReturn {
  const profile = useProfileStore((state) => state.profile);
  const measurementSystem = useProfileStore((state) => state.measurementSystem);
  const setMeasurementSystemStore = useProfileStore(
    (state) => state.setMeasurementSystem,
  );

  const existingData = profile?.basicBodyInfo;

  const form = useForm<BasicBodyInfoFormValues>({
    resolver: zodResolver(getBodyInfoSchema(measurementSystem)),
    defaultValues: {
      dateOfBirth: existingData?.dateOfBirth ?? '',
      gender: existingData?.gender ?? '',
      height: existingData ? String(existingData.heightCm) : '',
      weight: existingData ? String(existingData.weightKg) : '',
      targetWeight: existingData ? String(existingData.targetWeightKg) : '',
    },
    mode: 'onBlur',
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = useCallback(
    async (values: BasicBodyInfoFormValues): Promise<void> => {
      setServerError(null);
      setIsSubmitting(true);

      try {
        const data: BasicBodyInfo = {
          dateOfBirth: values.dateOfBirth,
          gender: values.gender as BasicBodyInfo['gender'],
          heightCm: toMetricHeight(parseFloat(values.height), measurementSystem),
          weightKg: toMetricWeight(parseFloat(values.weight), measurementSystem),
          targetWeightKg: toMetricWeight(
            parseFloat(values.targetWeight),
            measurementSystem,
          ),
        };
        await onNext(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to save. Please try again.';
        setServerError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [measurementSystem, onNext],
  );

  const onSubmit = useCallback(async (): Promise<void> => {
    await form.handleSubmit(handleSubmit)();
  }, [form, handleSubmit]);

  const setMeasurementSystem = useCallback(
    (system: MeasurementSystem): void => {
      setMeasurementSystemStore(system);
    },
    [setMeasurementSystemStore],
  );

  return {
    form,
    measurementSystem,
    setMeasurementSystem,
    isSubmitting,
    serverError,
    onSubmit,
    showDatePicker,
    setShowDatePicker,
  };
}
