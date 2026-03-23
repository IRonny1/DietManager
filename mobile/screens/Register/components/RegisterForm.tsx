import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Controller, type UseFormReturn } from 'react-hook-form';
import { Button, HelperText, TextInput } from 'react-native-paper';

import { Colors } from '@/constants/Colors';
import type { RegisterFormValues } from '@/types/auth.types';

type RegisterFormProps = {
  form: UseFormReturn<RegisterFormValues>;
  isSubmitting: boolean;
  serverError: string | null;
  onSubmit: () => void;
  isPasswordVisible: boolean;
  togglePasswordVisibility: () => void;
  isConfirmPasswordVisible: boolean;
  toggleConfirmPasswordVisibility: () => void;
};

export default function RegisterForm({
  form,
  isSubmitting,
  serverError,
  onSubmit,
  isPasswordVisible,
  togglePasswordVisibility,
  isConfirmPasswordVisible,
  toggleConfirmPasswordVisibility,
}: RegisterFormProps): React.JSX.Element {
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
        name="fullName"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.fieldContainer}>
            <TextInput
              label="Full Name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              autoCapitalize="words"
              autoComplete="name"
              error={!!formState.errors.fullName}
              disabled={isSubmitting}
              left={<TextInput.Icon icon="account-outline" />}
              style={styles.input}
              outlineColor={Colors.divider}
              activeOutlineColor={Colors.primary}
            />
            {formState.errors.fullName && (
              <HelperText type="error">
                {formState.errors.fullName.message}
              </HelperText>
            )}
          </View>
        )}
      />

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
              outlineColor={Colors.divider}
              activeOutlineColor={Colors.primary}
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
              autoComplete="new-password"
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
              outlineColor={Colors.divider}
              activeOutlineColor={Colors.primary}
            />
            {formState.errors.password && (
              <HelperText type="error">
                {formState.errors.password.message}
              </HelperText>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.fieldContainer}>
            <TextInput
              label="Confirm Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              secureTextEntry={!isConfirmPasswordVisible}
              autoCapitalize="none"
              error={!!formState.errors.confirmPassword}
              disabled={isSubmitting}
              left={<TextInput.Icon icon="lock-check-outline" />}
              right={
                <TextInput.Icon
                  icon={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
                  onPress={toggleConfirmPasswordVisibility}
                />
              }
              style={styles.input}
              outlineColor={Colors.divider}
              activeOutlineColor={Colors.primary}
            />
            {formState.errors.confirmPassword && (
              <HelperText type="error">
                {formState.errors.confirmPassword.message}
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
        buttonColor={Colors.primary}
        labelStyle={styles.submitButtonLabel}
      >
        Create Account
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
    backgroundColor: Colors.white,
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
