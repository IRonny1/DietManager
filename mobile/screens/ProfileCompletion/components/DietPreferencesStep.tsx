import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { HelperText, Text } from 'react-native-paper';

import ChipSelector from '@/components/ChipSelector';
import IllustratedCard from '@/components/IllustratedCard';
import { palette } from '@/constants/Colors';
import {
  CUISINE_OPTIONS,
  DIET_TYPE_OPTIONS,
} from '@/constants/profile.constants';
import type { ProfileStepData } from '@/types/profile.types';

import { useDietPreferencesForm } from '../hooks/useDietPreferencesForm';

type DietPreferencesStepProps = {
  onNext: (data: ProfileStepData) => Promise<void>;
  onRegisterSubmit: (fn: () => Promise<void>) => void;
};

export default function DietPreferencesStep({
  onNext,
  onRegisterSubmit,
}: DietPreferencesStepProps): React.JSX.Element {
  const {
    values,
    isSubmitting,
    serverError,
    validationError,
    setDietType,
    toggleCuisine,
    onSubmit,
  } = useDietPreferencesForm(onNext);

  useEffect(() => {
    onRegisterSubmit(onSubmit);
  }, [onRegisterSubmit, onSubmit]);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {serverError && (
        <HelperText type="error" style={styles.serverError}>
          {serverError}
        </HelperText>
      )}

      {/* Diet Type */}
      <View style={styles.section}>
        <Text variant="titleSmall" style={styles.sectionLabel}>
          Choose Your Diet Type
        </Text>
        <IllustratedCard
          options={DIET_TYPE_OPTIONS}
          selected={values.dietType || null}
          onSelect={setDietType}
          disabled={isSubmitting}
        />
        {validationError && (
          <HelperText type="error" style={styles.validationError}>
            {validationError}
          </HelperText>
        )}
      </View>

      {/* Cuisine Preferences */}
      <View style={styles.section}>
        <Text variant="titleSmall" style={styles.sectionLabel}>
          Favorite Cuisines{' '}
          <Text variant="bodySmall" style={styles.optionalLabel}>
            (optional)
          </Text>
        </Text>
        <ChipSelector
          options={CUISINE_OPTIONS.map((c) => ({ label: c, value: c }))}
          selected={values.cuisinePreferences}
          onSelectionChange={(selected) => {
            const added = selected.find(
              (s) => !values.cuisinePreferences.includes(s),
            );
            const removed = values.cuisinePreferences.find(
              (c) => !selected.includes(c),
            );
            if (added) toggleCuisine(added);
            if (removed) toggleCuisine(removed);
          }}
          disabled={isSubmitting}
        />
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
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    color: palette.textPrimary,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionalLabel: {
    color: palette.textSecondary,
    fontWeight: '400',
  },
  validationError: {
    marginTop: 4,
  },
  serverError: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
});
