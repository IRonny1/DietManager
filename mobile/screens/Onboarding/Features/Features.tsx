import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import OnboardingLayout from '../components/OnboardingLayout';
import OnboardingProgressDots from '../components/OnboardingProgressDots';
import { Colors } from '../../../constants/Colors';
import { SPACING } from '../../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../../constants/typography.constants';

const FEATURES = [
  { icon: '↑', label: 'Daily calorie tracking' },
  { icon: '🕐', label: 'Macro breakdown (Protein, Fat, Carbs)' },
  { icon: '📅', label: 'Weekly & monthly statistics' },
];

export default function Features(): React.JSX.Element {
  const router = useRouter();

  return (
    <OnboardingLayout
      showBack
      onBack={() => router.back()}
      primaryLabel="Continue"
      onPrimary={() => router.push('/(onboarding)/method')}
      onSkip={() => router.push('/(onboarding)/method')}
    >
      <View style={styles.illustration}>
        <View style={styles.ring}>
          <Text style={styles.ringNumber}>1,840</Text>
          <Text style={styles.ringLabel}>kcal</Text>
        </View>
        <View style={styles.macroBar}>
          <Text style={styles.macroLabel}>Protein</Text>
          <View style={[styles.bar, { width: 120, backgroundColor: Colors.protein }]} />
        </View>
        <View style={styles.macroBar}>
          <Text style={styles.macroLabel}>Fat</Text>
          <View style={[styles.bar, { width: 80, backgroundColor: Colors.fat }]} />
        </View>
        <View style={styles.macroBar}>
          <Text style={styles.macroLabel}>Carbs</Text>
          <View style={[styles.bar, { width: 140, backgroundColor: Colors.carbs }]} />
        </View>
      </View>

      <Text style={styles.title}>Track Your Progress</Text>
      <Text style={styles.subtitle}>
        Monitor daily intake, macros, and achieve your fitness goals
      </Text>

      {FEATURES.map((f) => (
        <View key={f.label} style={styles.featureRow}>
          <Text style={styles.featureIcon}>{f.icon}</Text>
          <Text style={styles.featureLabel}>{f.label}</Text>
        </View>
      ))}

      <View style={styles.dotsContainer}>
        <OnboardingProgressDots total={4} current={1} />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  illustration: {
    backgroundColor: Colors.primary + '15',
    borderRadius: 16,
    padding: SPACING.LG,
    alignItems: 'center',
    marginBottom: SPACING.XL,
    marginTop: SPACING.MD,
  },
  ring: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.MD,
  },
  ringNumber: { fontSize: FONT_SIZE.LG, fontWeight: FONT_WEIGHT.BOLD, color: Colors.textPrimary },
  ringLabel: { fontSize: FONT_SIZE.XS, color: Colors.textSecondary },
  macroBar: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.XS, width: '100%' },
  macroLabel: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary, width: 50 },
  bar: { height: 8, borderRadius: 4 },
  title: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: FONT_WEIGHT.BOLD,
    color: Colors.textPrimary,
    marginBottom: SPACING.SM,
  },
  subtitle: {
    fontSize: FONT_SIZE.MD,
    color: Colors.textSecondary,
    marginBottom: SPACING.LG,
    lineHeight: 22,
  },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.SM },
  featureIcon: { fontSize: 18, marginRight: SPACING.SM, color: Colors.primary },
  featureLabel: { fontSize: FONT_SIZE.MD, color: Colors.textPrimary },
  dotsContainer: { marginTop: SPACING.XL },
});
