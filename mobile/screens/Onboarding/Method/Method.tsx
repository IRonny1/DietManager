import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import OnboardingLayout from '../components/OnboardingLayout';
import OnboardingProgressDots from '../components/OnboardingProgressDots';
import { useMethodForm } from './hooks/useMethodForm';
import { GoalMethod } from '../../../types/onboarding.types';
import { Colors } from '../../../constants/Colors';
import { SPACING } from '../../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../../constants/typography.constants';

const OPTIONS: { value: GoalMethod; title: string; subtitle: string; icon: string }[] = [
  {
    value: 'calculate',
    title: 'Calculate for me',
    subtitle: "We'll calculate your ideal goal based on your personal data",
    icon: '📊',
  },
  {
    value: 'manual',
    title: 'Enter manually',
    subtitle: 'Set your own daily calorie target',
    icon: '✏️',
  },
];

export default function Method(): React.JSX.Element {
  const router = useRouter();
  const { selected, setSelected, onNext } = useMethodForm();

  return (
    <OnboardingLayout
      showBack
      onBack={() => router.back()}
      primaryLabel="Next"
      onPrimary={onNext}
      onSkip={() => router.push('/(onboarding)/result')}
    >
      <Text style={styles.title}>Set Your Daily Goal</Text>
      <Text style={styles.subtitle}>
        {"Choose how you'd like to set your calorie target"}
      </Text>

      {OPTIONS.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={() => setSelected(opt.value)}
          >
            <View style={styles.cardLeft}>
              <Text style={styles.cardIcon}>{opt.icon}</Text>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{opt.title}</Text>
                <Text style={styles.cardSubtitle}>{opt.subtitle}</Text>
              </View>
            </View>
            <View style={[styles.radio, isSelected && styles.radioSelected]}>
              {isSelected && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        );
      })}

      <View style={styles.dotsContainer}>
        <OnboardingProgressDots total={4} current={2} />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: FONT_WEIGHT.BOLD,
    color: Colors.textPrimary,
    marginBottom: SPACING.XS,
    marginTop: SPACING.LG,
  },
  subtitle: {
    fontSize: FONT_SIZE.MD,
    color: Colors.textSecondary,
    marginBottom: SPACING.XL,
    lineHeight: 22,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  cardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '08' },
  cardLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1 },
  cardIcon: { fontSize: 22, marginRight: SPACING.MD },
  cardText: { flex: 1 },
  cardTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  cardSubtitle: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary, lineHeight: 18 },
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
  dotsContainer: { marginTop: SPACING.XL },
});
