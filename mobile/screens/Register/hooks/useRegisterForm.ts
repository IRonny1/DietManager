import { useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_NUMBER_REGEX,
  PASSWORD_SPECIAL_CHAR_REGEX,
  PASSWORD_UPPERCASE_REGEX,
  VALIDATION_MESSAGES,
} from '@/constants/auth.constants';
import { useAuthStore } from '@/stores/useAuthStore';
import type { RegisterFormValues } from '@/types/auth.types';

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, VALIDATION_MESSAGES.FIRST_NAME_REQUIRED),
    lastName: z.string().trim().min(1, VALIDATION_MESSAGES.LAST_NAME_REQUIRED),
    email: z
      .string()
      .min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED)
      .email(VALIDATION_MESSAGES.EMAIL_INVALID),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_UPPERCASE_REGEX, VALIDATION_MESSAGES.PASSWORD_UPPERCASE)
      .regex(PASSWORD_NUMBER_REGEX, VALIDATION_MESSAGES.PASSWORD_NUMBER)
      .regex(
        PASSWORD_SPECIAL_CHAR_REGEX,
        VALIDATION_MESSAGES.PASSWORD_SPECIAL_CHAR,
      ),
    confirmPassword: z
      .string()
      .min(1, VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.CONFIRM_PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  });

type UseRegisterFormReturn = {
  form: UseFormReturn<RegisterFormValues>;
  isSubmitting: boolean;
  serverError: string | null;
  onSubmit: () => void;
  isPasswordVisible: boolean;
  togglePasswordVisibility: () => void;
  isConfirmPasswordVisible: boolean;
  toggleConfirmPasswordVisibility: () => void;
};

export function useRegisterForm(): UseRegisterFormReturn {
  const register = useAuthStore((state) => state.register);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (values: RegisterFormValues): Promise<void> => {
      setServerError(null);
      setIsSubmitting(true);

      try {
        await register({
          email: values.email,
          password: values.password,
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
        });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Registration failed. Please try again.';
        setServerError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [register],
  );

  const onSubmit = useCallback((): void => {
    form.handleSubmit(handleSubmit)();
  }, [form, handleSubmit]);

  const togglePasswordVisibility = useCallback((): void => {
    setIsPasswordVisible((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback((): void => {
    setIsConfirmPasswordVisible((prev) => !prev);
  }, []);

  return {
    form,
    isSubmitting,
    serverError,
    onSubmit,
    isPasswordVisible,
    togglePasswordVisibility,
    isConfirmPasswordVisible,
    toggleConfirmPasswordVisibility,
  };
}
