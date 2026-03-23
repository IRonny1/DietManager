import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { Controller } from 'react-hook-form';
import type { UseForgotPasswordFormReturn } from '../hooks/useForgotPasswordForm';
import { Colors } from '../../../constants/Colors';
import { SPACING } from '../../../constants/spacing.constants';
import { FONT_SIZE } from '../../../constants/typography.constants';

type ForgotPasswordFormProps = Pick<UseForgotPasswordFormReturn, 'form' | 'isSubmitting' | 'onSubmit'>;

export default function ForgotPasswordForm({ form, isSubmitting, onSubmit }: ForgotPasswordFormProps): React.JSX.Element {
  return (
    <>
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <>
            <Text style={styles.label}>Email</Text>
            <TextInput
              mode="outlined"
              placeholder="Enter your email address"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!fieldState.error}
              activeOutlineColor={Colors.primary}
              style={styles.input}
            />
            {fieldState.error && <Text style={styles.errorText}>{fieldState.error.message}</Text>}
          </>
        )}
      />
      <Button
        mode="contained"
        onPress={onSubmit}
        loading={isSubmitting}
        disabled={isSubmitting}
        buttonColor={Colors.primary}
        style={styles.submitBtn}
        contentStyle={styles.submitContent}
      >
        Send Reset Link
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary, marginBottom: SPACING.XS },
  input: { marginBottom: SPACING.XS, backgroundColor: Colors.bgPage },
  errorText: { fontSize: FONT_SIZE.XS, color: Colors.error, marginBottom: SPACING.SM },
  submitBtn: { marginTop: SPACING.MD, borderRadius: 8 },
  submitContent: { paddingVertical: SPACING.XS },
});
