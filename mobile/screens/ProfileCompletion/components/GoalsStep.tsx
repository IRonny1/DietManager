import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { HelperText, Text } from 'react-native-paper';

import IllustratedCard from '@/components/IllustratedCard';
import { palette } from '@/constants/Colors';
import {
  ACTIVITY_LEVEL_OPTIONS,
  PRIMARY_GOAL_OPTIONS,
} from '@/constants/profile.constants';
import type { ProfileStepData } from '@/types/profile.types';

import { useGoalsForm } from '../hooks/useGoalsForm';

type GoalsStepProps = {
  onNext: (data: ProfileStepData) => Promise<void>;
  onRegisterSubmit: (fn: () => Promise<void>) => void;
};

export default function GoalsStep({
  onNext,
  onRegisterSubmit,
}: GoalsStepProps): React.JSX.Element {
  const {
    values,
    isSubmitting,
    serverError,
    validationErrors,
    setPrimaryGoal,
    setActivityLevel,
    onSubmit,
  } = useGoalsForm(onNext);

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

      {/* Primary Goal */}
      <View style={styles.section}>
        <Text variant="titleSmall" style={styles.sectionLabel}>
          What's Your Primary Goal?
        </Text>
        <IllustratedCard
          options={PRIMARY_GOAL_OPTIONS}
          selected={values.primaryGoal || null}
          onSelect={setPrimaryGoal}
          disabled={isSubmitting}
        />
        {validationErrors.primaryGoal && (
          <HelperText type="error" style={styles.validationError}>
            {validationErrors.primaryGoal}
          </HelperText>
        )}
      </View>

      {/* Activity Level */}
      <View style={styles.section}>
        <Text variant="titleSmall" style={styles.sectionLabel}>
          How Active Are You?
        </Text>
        <IllustratedCard
          options={ACTIVITY_LEVEL_OPTIONS}
          selected={values.activityLevel || null}
          onSelect={setActivityLevel}
          disabled={isSubmitting}
        />
        {validationErrors.activityLevel && (
          <HelperText type="error" style={styles.validationError}>
            {validationErrors.activityLevel}
          </HelperText>
        )}
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
  validationError: {
    marginTop: 4,
  },
  serverError: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
});
