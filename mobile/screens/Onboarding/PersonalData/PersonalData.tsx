import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import OnboardingLayout from '../components/OnboardingLayout';
import { usePersonalDataForm } from './hooks/usePersonalDataForm';
import { Gender } from '../../../types/onboarding.types';
import { Colors } from '../../../constants/Colors';
import { SPACING } from '../../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../../constants/typography.constants';

// ─── Sub-components (defined above main component) ────────────────────────────

function Chip({
  selected,
  onPress,
  children,
}: {
  selected: boolean;
  onPress: () => void;
  children: string;
}): React.JSX.Element {
  return (
    <TouchableOpacity
      style={[chipStyles.chip, selected && chipStyles.selected]}
      onPress={onPress}
    >
      <Text style={[chipStyles.text, selected && chipStyles.selectedText]}>{children}</Text>
    </TouchableOpacity>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: SPACING.SM,
  },
  selected: { backgroundColor: Colors.textPrimary, borderColor: Colors.textPrimary },
  text: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary },
  selectedText: { color: '#fff' },
});

function UnitToggle({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: number;
  onSelect: (i: number) => void;
}): React.JSX.Element {
  return (
    <View style={toggleStyles.container}>
      {options.map((opt, i) => (
        <TouchableOpacity
          key={opt}
          style={[toggleStyles.option, i === selected && toggleStyles.selectedOption]}
          onPress={() => onSelect(i)}
        >
          <Text style={[toggleStyles.text, i === selected && toggleStyles.selectedText]}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const toggleStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    marginLeft: SPACING.SM,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  option: { paddingHorizontal: SPACING.MD, paddingVertical: SPACING.SM, backgroundColor: Colors.bgCard },
  selectedOption: { backgroundColor: Colors.textPrimary },
  text: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary },
  selectedText: { color: '#fff' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export default function PersonalData(): React.JSX.Element {
  const router = useRouter();
  const { values, errors, setField, onContinue } = usePersonalDataForm();

  return (
    <OnboardingLayout
      showBack
      onBack={() => router.back()}
      primaryLabel="Continue"
      onPrimary={onContinue}
      onSkip={() => router.push('/(onboarding)/result')}
    >
      <View style={styles.stepHeader}>
        <Text style={styles.stepLabel}>Step 1 of 2</Text>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
      </View>

      <Text style={styles.title}>Tell us about yourself</Text>
      <Text style={styles.subtitle}>{"We'll use this to calculate your ideal calorie goal"}</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.fieldLabel}>Age</Text>
        <TextInput
          mode="outlined"
          value={values.age}
          onChangeText={(v) => setField('age', v)}
          keyboardType="numeric"
          placeholder="25"
          activeOutlineColor={Colors.primary}
          error={!!errors.age}
          style={styles.input}
        />
        {errors.age && <Text style={styles.error}>{errors.age}</Text>}

        <Text style={styles.fieldLabel}>Gender</Text>
        <View style={styles.chipRow}>
          {GENDER_OPTIONS.map((g) => (
            <Chip
              key={g.value}
              selected={values.gender === g.value}
              onPress={() => setField('gender', g.value)}
            >
              {g.label}
            </Chip>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Weight</Text>
        <View style={styles.inputWithToggle}>
          <TextInput
            mode="outlined"
            value={values.weightValue}
            onChangeText={(v) => setField('weightValue', v)}
            keyboardType="numeric"
            activeOutlineColor={Colors.primary}
            error={!!errors.weightValue}
            style={[styles.input, styles.inputFlex]}
          />
          <UnitToggle
            options={['kg', 'lbs']}
            selected={values.isMetric ? 0 : 1}
            onSelect={(i) => setField('isMetric', i === 0)}
          />
        </View>
        {errors.weightValue && <Text style={styles.error}>{errors.weightValue}</Text>}

        <Text style={styles.fieldLabel}>Height</Text>
        <View style={styles.inputWithToggle}>
          <TextInput
            mode="outlined"
            value={values.heightValue}
            onChangeText={(v) => setField('heightValue', v)}
            keyboardType="numeric"
            activeOutlineColor={Colors.primary}
            error={!!errors.heightValue}
            style={[styles.input, styles.inputFlex]}
          />
          <UnitToggle
            options={['cm', 'in']}
            selected={values.isMetric ? 0 : 1}
            onSelect={(i) => setField('isMetric', i === 0)}
          />
        </View>
        {errors.heightValue && <Text style={styles.error}>{errors.heightValue}</Text>}
      </ScrollView>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  stepHeader: { marginTop: SPACING.MD, marginBottom: SPACING.LG },
  stepLabel: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary, marginBottom: SPACING.XS },
  progressBar: { height: 4, backgroundColor: Colors.bgCard, borderRadius: 2 },
  progressFill: { height: 4, width: '50%', backgroundColor: Colors.primary, borderRadius: 2 },
  title: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: FONT_WEIGHT.BOLD,
    color: Colors.textPrimary,
    marginBottom: SPACING.XS,
  },
  subtitle: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary, marginBottom: SPACING.XL, lineHeight: 22 },
  fieldLabel: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary, marginBottom: SPACING.XS, marginTop: SPACING.MD },
  input: { backgroundColor: Colors.bgPage, marginBottom: 2 },
  inputFlex: { flex: 1 },
  inputWithToggle: { flexDirection: 'row', alignItems: 'center' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: SPACING.XS },
  error: { fontSize: FONT_SIZE.XS, color: Colors.error, marginBottom: SPACING.SM },
});
