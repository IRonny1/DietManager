import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export type ForgotPasswordFormValues = z.infer<typeof schema>;

export type UseForgotPasswordFormReturn = {
  form: ReturnType<typeof useForm<ForgotPasswordFormValues>>;
  isSubmitting: boolean;
  onSubmit: () => void;
};

export function useForgotPasswordForm(): UseForgotPasswordFormReturn {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { email: '' },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      router.push({ pathname: '/(auth)/forgot-password-sent', params: { email: data.email } });
    } finally {
      setIsSubmitting(false);
    }
  });

  return { form, isSubmitting, onSubmit };
}
