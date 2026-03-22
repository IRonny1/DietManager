import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { HelperText, Text, TextInput, IconButton } from 'react-native-paper';

import ChipSelector from '@/components/ChipSelector';
import { palette } from '@/constants/Colors';
import {
  ALLERGY_OPTIONS,
  INTOLERANCE_OPTIONS,
  MEDICAL_CONDITION_OPTIONS,
} from '@/constants/profile.constants';
import type { ProfileStepData } from '@/types/profile.types';

import { useHealthConditionsForm } from '../hooks/useHealthConditionsForm';

type HealthConditionsStepProps = {
  onNext: (data: ProfileStepData) => Promise<void>;
  onRegisterSubmit: (fn: () => Promise<void>) => void;
};

export default function HealthConditionsStep({
  onNext,
  onRegisterSubmit,
}: HealthConditionsStepProps): React.JSX.Element {
  const {
    values,
    isSubmitting,
    serverError,
    toggleAllergy,
    toggleIntolerance,
    toggleCondition,
    setCustomAllergyText,
    setCustomIntoleranceText,
    setCustomConditionText,
    addCustomAllergy,
    addCustomIntolerance,
    addCustomCondition,
    onSubmit,
  } = useHealthConditionsForm(onNext);

  useEffect(() => {
    onRegisterSubmit(onSubmit);
  }, [onRegisterSubmit, onSubmit]);

  return (
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

      <Text variant="bodyMedium" style={styles.optionalNote}>
        All fields are optional. Skip if none apply to you.
      </Text>

      {/* Allergies */}
      <View style={styles.section}>
        <Text variant="titleSmall" style={styles.sectionLabel}>
          🚫 Food Allergies
        </Text>
        <ChipSelector
          options={ALLERGY_OPTIONS.map((a) => ({ label: a, value: a }))}
          selected={values.allergies}
          onSelectionChange={(selected) => {
            const added = selected.find((s) => !values.allergies.includes(s));
            const removed = values.allergies.find(
              (a) => !selected.includes(a),
            );
            if (added) toggleAllergy(added);
            if (removed) toggleAllergy(removed);
          }}
          disabled={isSubmitting}
        />
        <View style={styles.customInputRow}>
          <TextInput
            mode="outlined"
            placeholder="Add custom allergy..."
            value={values.customAllergyText}
            onChangeText={setCustomAllergyText}
            onSubmitEditing={addCustomAllergy}
            style={styles.customInput}
            outlineColor={palette.divider}
            activeOutlineColor={palette.primary}
            dense
            disabled={isSubmitting}
          />
          <IconButton
            icon="plus-circle"
            iconColor={palette.primary}
            onPress={addCustomAllergy}
            disabled={isSubmitting || !values.customAllergyText.trim()}
          />
        </View>
      </View>

      {/* Intolerances */}
      <View style={styles.section}>
        <Text variant="titleSmall" style={styles.sectionLabel}>
          ⚠️ Food Intolerances
        </Text>
        <ChipSelector
          options={INTOLERANCE_OPTIONS.map((i) => ({ label: i, value: i }))}
          selected={values.intolerances}
          onSelectionChange={(selected) => {
            const added = selected.find(
              (s) => !values.intolerances.includes(s),
            );
            const removed = values.intolerances.find(
              (i) => !selected.includes(i),
            );
            if (added) toggleIntolerance(added);
            if (removed) toggleIntolerance(removed);
          }}
          disabled={isSubmitting}
        />
        <View style={styles.customInputRow}>
          <TextInput
            mode="outlined"
            placeholder="Add custom intolerance..."
            value={values.customIntoleranceText}
            onChangeText={setCustomIntoleranceText}
            onSubmitEditing={addCustomIntolerance}
            style={styles.customInput}
            outlineColor={palette.divider}
            activeOutlineColor={palette.primary}
            dense
            disabled={isSubmitting}
          />
          <IconButton
            icon="plus-circle"
            iconColor={palette.primary}
            onPress={addCustomIntolerance}
            disabled={isSubmitting || !values.customIntoleranceText.trim()}
          />
        </View>
      </View>

      {/* Medical Conditions */}
      <View style={styles.section}>
        <Text variant="titleSmall" style={styles.sectionLabel}>
          🩺 Medical Conditions
        </Text>
        <ChipSelector
          options={MEDICAL_CONDITION_OPTIONS.map((m) => ({
            label: m,
            value: m,
          }))}
          selected={values.medicalConditions}
          onSelectionChange={(selected) => {
            const added = selected.find(
              (s) => !values.medicalConditions.includes(s),
            );
            const removed = values.medicalConditions.find(
              (m) => !selected.includes(m),
            );
            if (added) toggleCondition(added);
            if (removed) toggleCondition(removed);
          }}
          disabled={isSubmitting}
        />
        <View style={styles.customInputRow}>
          <TextInput
            mode="outlined"
            placeholder="Add custom condition..."
            value={values.customConditionText}
            onChangeText={setCustomConditionText}
            onSubmitEditing={addCustomCondition}
            style={styles.customInput}
            outlineColor={palette.divider}
            activeOutlineColor={palette.primary}
            dense
            disabled={isSubmitting}
          />
          <IconButton
            icon="plus-circle"
            iconColor={palette.primary}
            onPress={addCustomCondition}
            disabled={isSubmitting || !values.customConditionText.trim()}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 32,
    paddingBottom: 24,
    gap: 8,
  },
  optionalNote: {
    color: palette.textSecondary,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    color: palette.textPrimary,
    fontWeight: '600',
    marginBottom: 10,
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  customInput: {
    flex: 1,
    backgroundColor: palette.white,
  },
  serverError: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
});
