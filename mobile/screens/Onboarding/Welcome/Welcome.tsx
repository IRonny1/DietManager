import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import OnboardingLayout from '../components/OnboardingLayout';
import OnboardingProgressDots from '../components/OnboardingProgressDots';
import AppLogo from '../../../components/AppLogo/AppLogo';
import { Colors } from '../../../constants/Colors';
import { SPACING } from '../../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../../constants/typography.constants';

const FEATURES = [
  { icon: '🔍', label: 'Instant food recognition' },
  { icon: '📊', label: 'Smart nutrition tracking' },
  { icon: '🎯', label: 'Personalized goals' },
];

export default function Welcome(): React.JSX.Element {
  const router = useRouter();

  return (
    <OnboardingLayout
      primaryLabel="Get Started"
      onPrimary={() => router.push('/(onboarding)/features')}
      onSkip={() => router.push('/(onboarding)/method')}
    >
      <AppLogo horizontal style={styles.logo} />

      <View style={styles.illustration}>
        <View style={styles.illustrationBox}>
          <Text style={styles.illustrationIcon}>📷</Text>
          <Text style={styles.illustrationLabel}>AI Scanning...</Text>
        </View>
        <View style={styles.foodIcons}>
          <Text style={styles.foodIcon}>🍎</Text>
          <Text style={styles.foodIcon}>🍱</Text>
          <Text style={styles.foodIcon}>🥗</Text>
        </View>
        <Text style={styles.sparkle}>✨</Text>
      </View>

      <Text style={styles.title}>Track Calories with AI</Text>
      <Text style={styles.subtitle}>
        Simply snap a photo of your food and let AI do the counting
      </Text>

      {FEATURES.map((f) => (
        <View key={f.label} style={styles.featureRow}>
          <Text style={styles.featureIcon}>{f.icon}</Text>
          <Text style={styles.featureLabel}>{f.label}</Text>
        </View>
      ))}

      <View style={styles.dotsContainer}>
        <OnboardingProgressDots total={4} current={0} />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  logo: { marginTop: SPACING.MD, marginBottom: SPACING.LG },
  illustration: {
    backgroundColor: Colors.primary + '15',
    borderRadius: 16,
    padding: SPACING.LG,
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },
  illustrationBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: SPACING.MD,
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  illustrationIcon: { fontSize: 32 },
  illustrationLabel: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary, marginTop: SPACING.XS },
  foodIcons: { flexDirection: 'row', gap: SPACING.MD },
  foodIcon: { fontSize: 28 },
  sparkle: { fontSize: 24, marginTop: SPACING.SM },
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
