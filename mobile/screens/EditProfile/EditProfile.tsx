import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Controller } from 'react-hook-form';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';

import ChipSelector from '@/components/ChipSelector';
import { palette } from '@/constants/Colors';
import { GENDER_OPTIONS } from '@/constants/profile.constants';
import { useAuthStore } from '@/stores/useAuthStore';

import { useEditProfileForm } from './hooks/useEditProfileForm';

type FormFieldProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences';
  left?: React.ReactNode;
  right?: React.ReactNode;
};

function FormField({
  label,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  left,
  right,
}: FormFieldProps): React.JSX.Element {
  return (
    <View style={styles.field}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        mode="outlined"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        error={!!error}
        disabled={disabled}
        left={left}
        right={right}
        style={styles.input}
        outlineColor={palette.border}
        activeOutlineColor={palette.primary}
      />
      {error && <HelperText type="error">{error}</HelperText>}
    </View>
  );
}

export default function EditProfileScreen(): React.JSX.Element {
  const { form, isSubmitting, serverError, onSubmit } = useEditProfileForm();
  const { control, formState, setValue, watch } = form;
  const genderValue = watch('gender');
  const userEmail = useAuthStore((state) => state.user?.email ?? '');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.headerTitle}>
          Edit Profile
        </Text>
        <Button
          mode="contained"
          onPress={onSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.saveButton}
          labelStyle={styles.saveLabel}
        >
          Save
        </Button>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {serverError !== null && (
          <HelperText type="error" style={styles.serverError}>
            {serverError}
          </HelperText>
        )}

        {/* Name */}
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="First Name"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={formState.errors.firstName?.message}
              disabled={isSubmitting}
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Last Name"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={formState.errors.lastName?.message}
              disabled={isSubmitting}
            />
          )}
        />

        {/* Email (read-only) */}
        <View style={styles.field}>
          <TextInput
            label="Email"
            value={userEmail}
            mode="outlined"
            disabled
            style={styles.input}
            outlineColor={palette.border}
            activeOutlineColor={palette.primary}
          />
          <HelperText type="info">Email cannot be changed here</HelperText>
        </View>

        {/* Body Info Section */}
        <Text variant="titleSmall" style={styles.sectionLabel}>
          Body Info
        </Text>

        <Controller
          control={control}
          name="dateOfBirth"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Date of Birth (YYYY-MM-DD)"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={formState.errors.dateOfBirth?.message}
              disabled={isSubmitting}
              left={<TextInput.Icon icon="calendar" />}
            />
          )}
        />

        <View style={styles.field}>
          <Text variant="bodySmall" style={styles.fieldLabel}>
            Gender
          </Text>
          <ChipSelector
            options={GENDER_OPTIONS.map((g) => ({ label: g.label, value: g.value }))}
            selected={genderValue ? [genderValue] : []}
            onSelectionChange={(selected) => {
              setValue('gender', selected[0] ?? '', { shouldValidate: true });
            }}
            multiSelect={false}
            disabled={isSubmitting}
          />
          {formState.errors.gender && (
            <HelperText type="error">{formState.errors.gender.message}</HelperText>
          )}
        </View>

        <Controller
          control={control}
          name="heightCm"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Height (cm)"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={formState.errors.heightCm?.message}
              disabled={isSubmitting}
              keyboardType="numeric"
              right={<TextInput.Affix text="cm" />}
            />
          )}
        />

        <Controller
          control={control}
          name="weightKg"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Weight (kg)"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={formState.errors.weightKg?.message}
              disabled={isSubmitting}
              keyboardType="numeric"
              right={<TextInput.Affix text="kg" />}
            />
          )}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bgPage,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  headerTitle: {
    color: palette.textPrimary,
    fontWeight: '700',
  },
  saveButton: {
    borderRadius: 8,
  },
  saveLabel: {
    fontSize: 14,
  },
  scrollContent: {
    padding: 24,
    gap: 4,
  },
  serverError: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  field: {
    marginBottom: 4,
  },
  sectionLabel: {
    color: palette.textSecondary,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldLabel: {
    color: palette.textPrimary,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: palette.white,
  },
});
