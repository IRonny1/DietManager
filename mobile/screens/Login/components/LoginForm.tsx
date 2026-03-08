import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Controller, type UseFormReturn } from 'react-hook-form';
import {
  Button,
  HelperText,
  IconButton,
  TextInput,
} from 'react-native-paper';

import { palette } from '@/constants/Colors';
import type { LoginFormValues } from '@/types/auth.types';

type LoginFormProps = {
  form: UseFormReturn<LoginFormValues>;
  isSubmitting: boolean;
  serverError: string | null;
  onSubmit: () => void;
  isPasswordVisible: boolean;
  togglePasswordVisibility: () => void;
};

export default function LoginForm({
  form,
  isSubmitting,
  serverError,
  onSubmit,
  isPasswordVisible,
  togglePasswordVisibility,
}: LoginFormProps): React.JSX.Element {
  const { control, formState } = form;

  return (
    <View style={styles.container}>
      {serverError && (
        <HelperText type="error" style={styles.serverError}>
          {serverError}
        </HelperText>
      )}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.fieldContainer}>
            <TextInput
              label="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={!!formState.errors.email}
              disabled={isSubmitting}
              left={<TextInput.Icon icon="email-outline" />}
              style={styles.input}
              outlineColor={palette.divider}
              activeOutlineColor={palette.primary}
            />
            {formState.errors.email && (
              <HelperText type="error">
                {formState.errors.email.message}
              </HelperText>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.fieldContainer}>
            <TextInput
              label="Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              secureTextEntry={!isPasswordVisible}
              autoCapitalize="none"
              autoComplete="password"
              error={!!formState.errors.password}
              disabled={isSubmitting}
              left={<TextInput.Icon icon="lock-outline" />}
              right={
                <TextInput.Icon
                  icon={isPasswordVisible ? 'eye-off' : 'eye'}
                  onPress={togglePasswordVisibility}
                />
              }
              style={styles.input}
              outlineColor={palette.divider}
              activeOutlineColor={palette.primary}
            />
            {formState.errors.password && (
              <HelperText type="error">
                {formState.errors.password.message}
              </HelperText>
            )}
          </View>
        )}
      />

      <Button
        mode="contained"
        onPress={onSubmit}
        loading={isSubmitting}
        disabled={isSubmitting}
        style={styles.submitButton}
        contentStyle={styles.submitButtonContent}
        buttonColor={palette.primary}
        labelStyle={styles.submitButtonLabel}
      >
        Sign In
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  fieldContainer: {
    marginBottom: 4,
  },
  input: {
    backgroundColor: palette.white,
  },
  serverError: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  submitButton: {
    borderRadius: 12,
    marginTop: 16,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
