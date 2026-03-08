import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Controller, type UseFormReturn } from 'react-hook-form';
import { Button, HelperText, TextInput } from 'react-native-paper';

import { palette } from '@/constants/Colors';
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

      <View style={styles.nameRow}>
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.nameField}>
              <TextInput
                label="First Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                mode="outlined"
                autoCapitalize="words"
                autoComplete="given-name"
                error={!!formState.errors.firstName}
                disabled={isSubmitting}
                left={<TextInput.Icon icon="account-outline" />}
                style={styles.input}
                outlineColor={palette.divider}
                activeOutlineColor={palette.primary}
              />
              {formState.errors.firstName && (
                <HelperText type="error">
                  {formState.errors.firstName.message}
                </HelperText>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.nameField}>
              <TextInput
                label="Last Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                mode="outlined"
                autoCapitalize="words"
                autoComplete="family-name"
                error={!!formState.errors.lastName}
                disabled={isSubmitting}
                style={styles.input}
                outlineColor={palette.divider}
                activeOutlineColor={palette.primary}
              />
              {formState.errors.lastName && (
                <HelperText type="error">
                  {formState.errors.lastName.message}
                </HelperText>
              )}
            </View>
          )}
        />
      </View>

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
              outlineColor={palette.divider}
              activeOutlineColor={palette.primary}
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
        buttonColor={palette.primary}
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
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameField: {
    flex: 1,
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
