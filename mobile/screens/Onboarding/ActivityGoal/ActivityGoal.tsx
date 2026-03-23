import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import OnboardingLayout from '../components/OnboardingLayout';
import { useActivityGoalForm } from './hooks/useActivityGoalForm';
import { ActivityLevel, PrimaryGoal } from '../../../types/onboarding.types';
import { Colors } from '../../../constants/Colors';
import { SPACING } from '../../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../../constants/typography.constants';

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string; subtitle: string }[] = [
  { value: 'sedentary', label: 'Sedentary', subtitle: 'Little or no exercise' },
  { value: 'lightly_active', label: 'Lightly Active', subtitle: 'Light exercise 1-3 days/week' },
  { value: 'moderately_active', label: 'Moderately Active', subtitle: 'Moderate exercise 3-5 days/week' },
  { value: 'very_active', label: 'Very Active', subtitle: 'Heavy exercise 6-7 days/week' },
  { value: 'extremely_active', label: 'Extremely Active', subtitle: 'Very heavy exercise & physical job' },
];

const GOAL_OPTIONS: { value: PrimaryGoal; label: string; subtitle: string }[] = [
  { value: 'lose_weight', label: 'Lose Weight', subtitle: 'Create calorie deficit' },
  { value: 'maintain_weight', label: 'Maintain Weight', subtitle: 'Keep current weight' },
  { value: 'gain_weight', label: 'Gain Weight', subtitle: 'Create calorie surplus' },
];

function RadioRow({
  label,
  subtitle,
  selected,
  onPress,
}: {
  label: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
}): React.JSX.Element {
  return (
    <TouchableOpacity
      style={[styles.radioRow, selected && styles.radioRowSelected]}
      onPress={onPress}
    >
      <View style={styles.radioRowText}>
        <Text style={styles.radioLabel}>{label}</Text>
        <Text style={styles.radioSubtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );
}

export default function ActivityGoal(): React.JSX.Element {
  const router = useRouter();
  const {
    activityLevel,
    setActivityLevel,
    primaryGoal,
    setPrimaryGoal,
    isCalculating,
    onCalculate,
  } = useActivityGoalForm();

  return (
    <OnboardingLayout
      showBack
      onBack={() => router.back()}
      primaryLabel="Calculate My Goal"
      onPrimary={onCalculate}
      isPrimaryLoading={isCalculating}
      onSkip={() => router.push('/(onboarding)/result')}
    >
      <View style={styles.stepHeader}>
        <Text style={styles.stepLabel}>Step 2 of 2</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
      </View>

      <Text style={styles.title}>Activity & Goals</Text>
      <Text style={styles.subtitle}>Almost there! Just a bit more info</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>How active are you?</Text>
        {ACTIVITY_OPTIONS.map((opt) => (
          <RadioRow
            key={opt.value}
            label={opt.label}
            subtitle={opt.subtitle}
            selected={activityLevel === opt.value}
            onPress={() => setActivityLevel(opt.value)}
          />
        ))}

        <Text style={styles.sectionTitle}>{"What's your goal?"}</Text>
        {GOAL_OPTIONS.map((opt) => (
          <RadioRow
            key={opt.value}
            label={opt.label}
            subtitle={opt.subtitle}
            selected={primaryGoal === opt.value}
            onPress={() => setPrimaryGoal(opt.value)}
          />
        ))}
      </ScrollView>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  stepHeader: { marginTop: SPACING.MD, marginBottom: SPACING.LG },
  stepLabel: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary, marginBottom: SPACING.XS },
  progressBar: { height: 4, backgroundColor: Colors.bgCard, borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: Colors.primary, borderRadius: 2 },
  title: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: FONT_WEIGHT.BOLD,
    color: Colors.textPrimary,
    marginBottom: SPACING.XS,
  },
  subtitle: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary, marginBottom: SPACING.LG },
  sectionTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: Colors.textPrimary,
    marginBottom: SPACING.MD,
    marginTop: SPACING.MD,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
  },
  radioRowSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '08' },
  radioRowText: { flex: 1 },
  radioLabel: { fontSize: FONT_SIZE.MD, fontWeight: FONT_WEIGHT.MEDIUM, color: Colors.textPrimary },
  radioSubtitle: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary, marginTop: 2 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.SM,
  },
  radioSelected: { borderColor: Colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
});
