import { useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { VALIDATION_MESSAGES } from '@/constants/auth.constants';
import { useAuthStore } from '@/stores/useAuthStore';
import type { LoginFormValues } from '@/types/auth.types';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL_INVALID),
  password: z.string().min(1, VALIDATION_MESSAGES.PASSWORD_REQUIRED),
});

type UseLoginFormReturn = {
  form: UseFormReturn<LoginFormValues>;
  isSubmitting: boolean;
  serverError: string | null;
  onSubmit: () => void;
  isPasswordVisible: boolean;
  togglePasswordVisibility: () => void;
};

export function useLoginForm(): UseLoginFormReturn {
  const login = useAuthStore((state) => state.login);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (values: LoginFormValues): Promise<void> => {
      setServerError(null);
      setIsSubmitting(true);

      try {
        await login({ email: values.email, password: values.password });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Login failed. Please try again.';
        setServerError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [login],
  );

  const onSubmit = useCallback((): void => {
    form.handleSubmit(handleSubmit)();
  }, [form, handleSubmit]);

  const togglePasswordVisibility = useCallback((): void => {
    setIsPasswordVisible((prev) => !prev);
  }, []);

  return {
    form,
    isSubmitting,
    serverError,
    onSubmit,
    isPasswordVisible,
    togglePasswordVisibility,
  };
}
