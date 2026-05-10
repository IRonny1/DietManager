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

import { useEditProfileForm } from './hooks/useEditProfileForm';

export default function EditProfileScreen(): React.JSX.Element {
  const { form, isSubmitting, serverError, onSubmit } = useEditProfileForm();
  const { control, formState, setValue, watch } = form;
  const genderValue = watch('gender');

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
        <View style={styles.field}>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  label="First Name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  error={!!formState.errors.firstName}
                  disabled={isSubmitting}
                  style={styles.input}
                  outlineColor={palette.border}
                  activeOutlineColor={palette.primary}
                />
                {formState.errors.firstName && (
                  <HelperText type="error">{formState.errors.firstName.message}</HelperText>
                )}
              </>
            )}
          />
        </View>

        <View style={styles.field}>
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  label="Last Name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  error={!!formState.errors.lastName}
                  disabled={isSubmitting}
                  style={styles.input}
                  outlineColor={palette.border}
                  activeOutlineColor={palette.primary}
                />
                {formState.errors.lastName && (
                  <HelperText type="error">{formState.errors.lastName.message}</HelperText>
                )}
              </>
            )}
          />
        </View>

        <View style={styles.field}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={!!formState.errors.email}
                  disabled={isSubmitting}
                  style={styles.input}
                  outlineColor={palette.border}
                  activeOutlineColor={palette.primary}
                />
                {formState.errors.email && (
                  <HelperText type="error">{formState.errors.email.message}</HelperText>
                )}
              </>
            )}
          />
        </View>

        {/* Body Info Section */}
        <Text variant="titleSmall" style={styles.sectionLabel}>
          Body Info
        </Text>

        <View style={styles.field}>
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  label="Date of Birth (YYYY-MM-DD)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  placeholder="1990-01-15"
                  error={!!formState.errors.dateOfBirth}
                  disabled={isSubmitting}
                  left={<TextInput.Icon icon="calendar" />}
                  style={styles.input}
                  outlineColor={palette.border}
                  activeOutlineColor={palette.primary}
                />
                {formState.errors.dateOfBirth && (
                  <HelperText type="error">{formState.errors.dateOfBirth.message}</HelperText>
                )}
              </>
            )}
          />
        </View>

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

        <View style={styles.field}>
          <Controller
            control={control}
            name="heightCm"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  label="Height (cm)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  keyboardType="numeric"
                  error={!!formState.errors.heightCm}
                  disabled={isSubmitting}
                  right={<TextInput.Affix text="cm" />}
                  style={styles.input}
                  outlineColor={palette.border}
                  activeOutlineColor={palette.primary}
                />
                {formState.errors.heightCm && (
                  <HelperText type="error">{formState.errors.heightCm.message}</HelperText>
                )}
              </>
            )}
          />
        </View>

        <View style={styles.field}>
          <Controller
            control={control}
            name="weightKg"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  label="Weight (kg)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  keyboardType="numeric"
                  error={!!formState.errors.weightKg}
                  disabled={isSubmitting}
                  right={<TextInput.Affix text="kg" />}
                  style={styles.input}
                  outlineColor={palette.border}
                  activeOutlineColor={palette.primary}
                />
                {formState.errors.weightKg && (
                  <HelperText type="error">{formState.errors.weightKg.message}</HelperText>
                )}
              </>
            )}
          />
        </View>
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
