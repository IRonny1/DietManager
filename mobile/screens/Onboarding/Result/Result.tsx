import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfileStore } from '../../../stores/useProfileStore';
import { calculateMacros } from '../../../services/calorieCalculator.service';
import { Colors } from '../../../constants/Colors';
import { SPACING } from '../../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../../constants/typography.constants';

export default function Result(): React.JSX.Element {
  const router = useRouter();
  const onboardingData = useProfileStore((s) => s.onboardingData);
  const completeOnboarding = useProfileStore((s) => s.completeOnboarding);

  const calorieGoal = onboardingData.calorieGoal ?? 2000;
  const macros = calculateMacros(calorieGoal);

  function onLooksGood(): void {
    completeOnboarding();
    router.replace('/(tabs)');
  }

  function onAdjust(): void {
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backdrop} />
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.checkCircle}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>

        <Text style={styles.label}>Your Daily Goal</Text>
        <Text style={styles.kcal}>{calorieGoal.toLocaleString()} kcal/day</Text>
        <Text style={styles.description}>
          Based on your age, weight, height, and activity level
        </Text>

        <View style={styles.macroRow}>
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: Colors.protein }]}>{macros.protein}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroDivider} />
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: Colors.carbs }]}>{macros.carbs}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
          <View style={styles.macroDivider} />
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: Colors.fat }]}>{macros.fat}g</Text>
            <Text style={styles.macroLabel}>Fat</Text>
          </View>
        </View>

        <Button
          mode="contained"
          buttonColor={Colors.primary}
          style={styles.btn}
          contentStyle={styles.btnContent}
          onPress={onLooksGood}
        >
          Looks good!
        </Button>

        <TouchableOpacity onPress={onAdjust} style={styles.adjustBtn}>
          <Text style={styles.adjustText}>Adjust</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.bgPage,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.XL,
    alignItems: 'center',
    paddingBottom: SPACING.XXL,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.bgCard,
    borderRadius: 2,
    marginBottom: SPACING.XL,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.LG,
  },
  checkIcon: { fontSize: 28, color: Colors.primary },
  label: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary, marginBottom: SPACING.XS },
  kcal: {
    fontSize: 36,
    fontWeight: FONT_WEIGHT.BOLD,
    color: Colors.primary,
    marginBottom: SPACING.SM,
  },
  description: {
    fontSize: FONT_SIZE.SM,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.XL,
    lineHeight: 20,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    width: '100%',
    marginBottom: SPACING.XL,
  },
  macroItem: { flex: 1, alignItems: 'center' },
  macroValue: { fontSize: FONT_SIZE.LG, fontWeight: FONT_WEIGHT.BOLD },
  macroLabel: { fontSize: FONT_SIZE.XS, color: Colors.textSecondary, marginTop: 2 },
  macroDivider: { width: 1, height: 32, backgroundColor: Colors.border },
  btn: { width: '100%', borderRadius: 8, marginBottom: SPACING.MD },
  btnContent: { paddingVertical: SPACING.XS },
  adjustBtn: { paddingVertical: SPACING.SM },
  adjustText: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary },
});
