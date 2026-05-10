import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { Button, HelperText, Text, TextInput } from 'react-native-paper';

import ChipSelector from '@/components/ChipSelector';
import { palette } from '@/constants/Colors';
import {
  ACTIVITY_LEVEL_OPTIONS,
  PRIMARY_GOAL_OPTIONS,
} from '@/constants/profile.constants';

import { useEditMyGoalsForm } from './hooks/useEditMyGoalsForm';

export default function EditMyGoalsScreen(): React.JSX.Element {
  const {
    values,
    isSubmitting,
    serverError,
    validationErrors,
    setCalorieGoal,
    setPrimaryGoal,
    setActivityLevel,
    onSubmit,
  } = useEditMyGoalsForm();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.headerTitle}>
          Edit My Goals
        </Text>
        <Button
          mode="contained"
          onPress={onSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.saveButton}
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

        {/* Calorie Goal */}
        <View style={styles.section}>
          <Text variant="titleSmall" style={styles.sectionLabel}>
            Daily Calorie Goal
          </Text>
          <TextInput
            label="Calories"
            value={values.calorieGoal}
            onChangeText={setCalorieGoal}
            mode="outlined"
            keyboardType="numeric"
            placeholder="e.g. 2100"
            error={!!validationErrors.calorieGoal}
            disabled={isSubmitting}
            right={<TextInput.Affix text="kcal/day" />}
            style={styles.input}
            outlineColor={palette.border}
            activeOutlineColor={palette.primary}
          />
          {validationErrors.calorieGoal && (
            <HelperText type="error">{validationErrors.calorieGoal}</HelperText>
          )}
        </View>

        {/* Primary Goal */}
        <View style={styles.section}>
          <Text variant="titleSmall" style={styles.sectionLabel}>
            Primary Goal
          </Text>
          <ChipSelector
            options={PRIMARY_GOAL_OPTIONS.map((o) => ({ label: o.label, value: o.value }))}
            selected={values.primaryGoal ? [values.primaryGoal] : []}
            onSelectionChange={(selected) => setPrimaryGoal(selected[0] ?? '')}
            multiSelect={false}
            disabled={isSubmitting}
          />
          {validationErrors.primaryGoal && (
            <HelperText type="error">{validationErrors.primaryGoal}</HelperText>
          )}
        </View>

        {/* Activity Level */}
        <View style={styles.section}>
          <Text variant="titleSmall" style={styles.sectionLabel}>
            Activity Level
          </Text>
          <ChipSelector
            options={ACTIVITY_LEVEL_OPTIONS.map((o) => ({ label: o.label, value: o.value }))}
            selected={values.activityLevel ? [values.activityLevel] : []}
            onSelectionChange={(selected) => setActivityLevel(selected[0] ?? '')}
            multiSelect={false}
            disabled={isSubmitting}
          />
          {validationErrors.activityLevel && (
            <HelperText type="error">{validationErrors.activityLevel}</HelperText>
          )}
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
  scrollContent: {
    padding: 24,
    gap: 8,
  },
  serverError: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    color: palette.textPrimary,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: palette.white,
  },
});
