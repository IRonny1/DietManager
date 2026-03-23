import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import OnboardingLayout from '../components/OnboardingLayout';
import { useManualEntryForm } from './hooks/useManualEntryForm';
import { Colors } from '../../../constants/Colors';
import { SPACING } from '../../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../../constants/typography.constants';

export default function ManualEntry(): React.JSX.Element {
  const router = useRouter();
  const { calories, increment, decrement, onSetGoal, onCalculateInstead } = useManualEntryForm();

  return (
    <OnboardingLayout
      showBack
      onBack={() => router.back()}
      primaryLabel="Set Goal"
      onPrimary={onSetGoal}
      onSkip={() => router.push('/(onboarding)/result')}
    >
      <Text style={styles.title}>Set Your Daily Goal</Text>
      <Text style={styles.subtitle}>Enter your target daily calories</Text>

      <View style={styles.stepper}>
        <TouchableOpacity style={styles.stepBtn} onPress={decrement}>
          <Text style={styles.stepBtnText}>−</Text>
        </TouchableOpacity>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{calories.toLocaleString()}</Text>
          <Text style={styles.unit}>kcal / day</Text>
        </View>
        <TouchableOpacity style={styles.stepBtn} onPress={increment}>
          <Text style={styles.stepBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.range}>Typical range: 1,500 – 2,500 kcal/day</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          {"Not sure? Most adults need 1,600–2,500 calories per day"}
        </Text>
      </View>

      <View style={styles.spacer} />

      <Button
        mode="outlined"
        textColor={Colors.textPrimary}
        style={styles.calcBtn}
        contentStyle={styles.calcContent}
        onPress={onCalculateInstead}
      >
        Calculate for me instead
      </Button>
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
  subtitle: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary, marginBottom: SPACING.XXL },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.MD },
  stepBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  stepBtnText: { fontSize: 32, color: Colors.textSecondary },
  valueContainer: { alignItems: 'center', minWidth: 160 },
  value: { fontSize: 48, fontWeight: FONT_WEIGHT.BOLD, color: Colors.textPrimary },
  unit: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary },
  range: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary, textAlign: 'center', marginBottom: SPACING.MD },
  infoBox: { flexDirection: 'row', backgroundColor: '#EFF6FF', borderRadius: 8, padding: SPACING.MD, alignItems: 'flex-start' },
  infoIcon: { fontSize: 16, marginRight: SPACING.SM },
  infoText: { fontSize: FONT_SIZE.SM, color: '#1D4ED8', flex: 1, lineHeight: 18 },
  spacer: { flex: 1 },
  calcBtn: { borderRadius: 8, borderColor: Colors.border, marginBottom: SPACING.SM },
  calcContent: { paddingVertical: SPACING.XS },
});
