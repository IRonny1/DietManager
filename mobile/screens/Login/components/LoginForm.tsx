import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Controller, type UseFormReturn } from 'react-hook-form';
import {
  Button,
  HelperText,
  TextInput,
} from 'react-native-paper';

import { Colors } from '../../../constants/Colors';
import { SPACING } from '../../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../../constants/typography.constants';
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
              outlineColor={Colors.border}
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
              outlineColor={Colors.border}
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
        Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.XS,
  },
  fieldContainer: {
    marginBottom: SPACING.XS,
  },
  input: {
    backgroundColor: Colors.bgPage,
  },
  serverError: {
    fontSize: FONT_SIZE.SM,
    textAlign: 'center',
    marginBottom: SPACING.SM,
  },
  submitButton: {
    borderRadius: 12,
    marginTop: SPACING.LG,
    width: '100%',
  },
  submitButtonContent: {
    paddingVertical: SPACING.SM,
  },
  submitButtonLabel: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },
});
