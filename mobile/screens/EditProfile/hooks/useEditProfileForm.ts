import { useCallback, useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { z } from 'zod';

import {
  HEIGHT_LIMITS,
  WEIGHT_LIMITS,
  PROFILE_VALIDATION_MESSAGES,
} from '@/constants/profile.constants';
import { useProfileStore } from '@/stores/useProfileStore';

const editProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().min(1, PROFILE_VALIDATION_MESSAGES.DATE_OF_BIRTH_REQUIRED),
  gender: z.string().min(1, PROFILE_VALIDATION_MESSAGES.GENDER_REQUIRED),
  heightCm: z
    .string()
    .min(1, PROFILE_VALIDATION_MESSAGES.HEIGHT_REQUIRED)
    .refine(
      (val) => {
        const n = parseFloat(val);
        return !isNaN(n) && n >= HEIGHT_LIMITS.metric.min && n <= HEIGHT_LIMITS.metric.max;
      },
      { message: PROFILE_VALIDATION_MESSAGES.HEIGHT_INVALID },
    ),
  weightKg: z
    .string()
    .min(1, PROFILE_VALIDATION_MESSAGES.WEIGHT_REQUIRED)
    .refine(
      (val) => {
        const n = parseFloat(val);
        return !isNaN(n) && n >= WEIGHT_LIMITS.metric.min && n <= WEIGHT_LIMITS.metric.max;
      },
      { message: PROFILE_VALIDATION_MESSAGES.WEIGHT_INVALID },
    ),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;

type UseEditProfileFormReturn = {
  form: UseFormReturn<EditProfileFormValues>;
  isSubmitting: boolean;
  serverError: string | null;
  onSubmit: () => Promise<void>;
};

export function useEditProfileForm(): UseEditProfileFormReturn {
  const router = useRouter();
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
      dateOfBirth: profile?.basicBodyInfo?.dateOfBirth ?? '',
      gender: profile?.basicBodyInfo?.gender ?? '',
      heightCm: profile?.basicBodyInfo?.heightCm ? String(profile.basicBodyInfo.heightCm) : '',
      weightKg: profile?.basicBodyInfo?.weightKg ? String(profile.basicBodyInfo.weightKg) : '',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (profile === null) return;
    form.reset({
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      dateOfBirth: profile.basicBodyInfo?.dateOfBirth ?? '',
      gender: profile.basicBodyInfo?.gender ?? '',
      heightCm: profile.basicBodyInfo?.heightCm ? String(profile.basicBodyInfo.heightCm) : '',
      weightKg: profile.basicBodyInfo?.weightKg ? String(profile.basicBodyInfo.weightKg) : '',
    });
  }, [profile]); // eslint-disable-line react-hooks/exhaustive-deps

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (values: EditProfileFormValues): Promise<void> => {
      setServerError(null);
      setIsSubmitting(true);

      try {
        updateProfile({
          firstName: values.firstName,
          lastName: values.lastName,
          basicBodyInfo: {
            dateOfBirth: values.dateOfBirth,
            gender: values.gender as 'male' | 'female' | 'other' | 'prefer_not_to_say',
            heightCm: parseFloat(values.heightCm),
            weightKg: parseFloat(values.weightKg),
            targetWeightKg: profile?.basicBodyInfo?.targetWeightKg ?? 0,
          },
        });
        router.back();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to save. Please try again.';
        setServerError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [updateProfile, profile, router],
  );

  const onSubmit = useCallback(async (): Promise<void> => {
    await form.handleSubmit(handleSubmit)();
  }, [form, handleSubmit]);

  return {
    form,
    isSubmitting,
    serverError,
    onSubmit,
  };
}
