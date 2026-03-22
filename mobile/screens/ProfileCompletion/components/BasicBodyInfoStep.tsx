import React, { useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Controller } from 'react-hook-form';
import { HelperText, Text, TextInput } from 'react-native-paper';

import ChipSelector from '@/components/ChipSelector';
import NumericInput from '@/components/NumericInput';
import UnitToggle from '@/components/UnitToggle';
import { palette } from '@/constants/Colors';
import { GENDER_OPTIONS } from '@/constants/profile.constants';
import type { ProfileStepData } from '@/types/profile.types';

import { useBasicBodyInfoForm } from '../hooks/useBasicBodyInfoForm';

type BasicBodyInfoStepProps = {
  onNext: (data: ProfileStepData) => Promise<void>;
  onRegisterSubmit: (fn: () => Promise<void>) => void;
};

export default function BasicBodyInfoStep({
  onNext,
  onRegisterSubmit,
}: BasicBodyInfoStepProps): React.JSX.Element {
  const {
    form,
    measurementSystem,
    setMeasurementSystem,
    isSubmitting,
    serverError,
    onSubmit,
  } = useBasicBodyInfoForm(onNext);

  useEffect(() => {
    onRegisterSubmit(onSubmit);
  }, [onRegisterSubmit, onSubmit]);

  const { control, formState, setValue, watch } = form;
  const genderValue = watch('gender');

  const heightUnit = measurementSystem === 'metric' ? 'cm' : 'in';
  const weightUnit = measurementSystem === 'metric' ? 'kg' : 'lbs';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {serverError && (
          <HelperText type="error" style={styles.serverError}>
            {serverError}
          </HelperText>
        )}

        {/* Date of Birth */}
        <View style={styles.section}>
          <Text variant="titleSmall" style={styles.sectionLabel}>
            Date of Birth
          </Text>
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  label="YYYY-MM-DD"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  placeholder="1990-01-15"
                  error={!!formState.errors.dateOfBirth}
                  disabled={isSubmitting}
                  left={<TextInput.Icon icon="calendar" />}
                  style={styles.input}
                  outlineColor={palette.divider}
                  activeOutlineColor={palette.primary}
                />
                {formState.errors.dateOfBirth && (
                  <HelperText type="error">
                    {formState.errors.dateOfBirth.message}
                  </HelperText>
                )}
              </View>
            )}
          />
        </View>

        {/* Gender */}
        <View style={styles.section}>
          <Text variant="titleSmall" style={styles.sectionLabel}>
            Gender
          </Text>
          <ChipSelector
            options={GENDER_OPTIONS.map((g) => ({
              label: `${g.emoji} ${g.label}`,
              value: g.value,
            }))}
            selected={genderValue ? [genderValue] : []}
            onSelectionChange={(selected) => {
              setValue('gender', selected[0] ?? '', { shouldValidate: true });
            }}
            multiSelect={false}
            disabled={isSubmitting}
          />
          {formState.errors.gender && (
            <HelperText type="error">
              {formState.errors.gender.message}
            </HelperText>
          )}
        </View>

        {/* Unit Toggle */}
        <View style={styles.section}>
          <Text variant="titleSmall" style={styles.sectionLabel}>
            Measurement System
          </Text>
          <UnitToggle
            value={measurementSystem}
            onValueChange={setMeasurementSystem}
            disabled={isSubmitting}
          />
        </View>

        {/* Height */}
        <View style={styles.section}>
          <Controller
            control={control}
            name="height"
            render={({ field: { onChange, onBlur, value } }) => (
              <NumericInput
                label="Height"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                unit={heightUnit}
                error={formState.errors.height?.message}
                disabled={isSubmitting}
                icon="human-male-height"
              />
            )}
          />
        </View>

        {/* Current Weight */}
        <View style={styles.section}>
          <Controller
            control={control}
            name="weight"
            render={({ field: { onChange, onBlur, value } }) => (
              <NumericInput
                label="Current Weight"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                unit={weightUnit}
                error={formState.errors.weight?.message}
                disabled={isSubmitting}
                icon="scale-bathroom"
              />
            )}
          />
        </View>

        {/* Target Weight */}
        <View style={styles.section}>
          <Controller
            control={control}
            name="targetWeight"
            render={({ field: { onChange, onBlur, value } }) => (
              <NumericInput
                label="Target Weight"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                unit={weightUnit}
                error={formState.errors.targetWeight?.message}
                disabled={isSubmitting}
                icon="target"
              />
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
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingBottom: 24,
    gap: 8,
  },
  section: {
    marginBottom: 8,
  },
  sectionLabel: {
    color: palette.textPrimary,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: palette.white,
  },
  serverError: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
});
