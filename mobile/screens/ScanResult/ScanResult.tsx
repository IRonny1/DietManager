import React from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Chip, ActivityIndicator } from 'react-native-paper';

import { useScanResult } from './hooks/useScanResult';
import { PortionStepper } from './components/PortionStepper';
import { IngredientsAccordion } from './components/IngredientsAccordion';
import { palette } from '@/constants/Colors';
import { SPACING } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

const CONFIDENCE_COLOR: Record<string, string> = {
  high: palette.primary,
  medium: palette.secondary,
  low: palette.error,
};

export function ScanResult(): React.JSX.Element {
  const {
    scan,
    portionGrams,
    adjustedCalories,
    adjustedProtein,
    adjustedFat,
    adjustedCarbs,
    ingredientsExpanded,
    handlePortionIncrease,
    handlePortionDecrease,
    handleIngredientsToggle,
    handleAddToDiary,
    handleEditDetails,
    handleScanAgain,
  } = useScanResult();

  if (!scan) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Image source={{ uri: scan.imageUri }} style={styles.image} resizeMode="cover" />

      <View style={styles.badgeRow}>
        <View style={[styles.badge, { backgroundColor: CONFIDENCE_COLOR[scan.confidence] }]}>
          <Text style={styles.badgeText}>{scan.confidence.toUpperCase()} CONFIDENCE</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.foodName}>{scan.name}</Text>

        <Chip style={styles.categoryChip} textStyle={styles.categoryChipText}>
          {scan.category}
        </Chip>

        <Text style={styles.calories}>{adjustedCalories}</Text>
        <Text style={styles.caloriesLabel}>kcal</Text>

        <View style={styles.macrosRow}>
          <View style={styles.macro}>
            <Text style={[styles.macroValue, { color: palette.protein }]}>{adjustedProtein}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macro}>
            <Text style={[styles.macroValue, { color: palette.fat }]}>{adjustedFat}g</Text>
            <Text style={styles.macroLabel}>Fat</Text>
          </View>
          <View style={styles.macro}>
            <Text style={[styles.macroValue, { color: palette.carbs }]}>{adjustedCarbs}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
        </View>

        <PortionStepper
          value={portionGrams}
          onIncrease={handlePortionIncrease}
          onDecrease={handlePortionDecrease}
        />

        <IngredientsAccordion
          ingredients={scan.ingredients}
          expanded={ingredientsExpanded}
          onToggle={handleIngredientsToggle}
        />

        <Button
          mode="contained"
          onPress={handleAddToDiary}
          style={styles.primaryBtn}
          contentStyle={styles.btnContent}
        >
          Add to Diary
        </Button>
        <Button
          mode="outlined"
          onPress={handleEditDetails}
          style={styles.secondaryBtn}
          contentStyle={styles.btnContent}
        >
          Edit Details
        </Button>
        <Button mode="text" onPress={handleScanAgain} textColor={palette.textSecondary}>
          Scan Again
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1, backgroundColor: palette.bgPage },
  content: { paddingBottom: SPACING.XXL },
  image: { width: '100%', height: 240 },
  badgeRow: { position: 'absolute', top: SPACING.MD, left: SPACING.MD },
  badge: { paddingHorizontal: SPACING.SM, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: FONT_SIZE.XS, fontWeight: FONT_WEIGHT.BOLD, color: palette.white },
  card: { padding: SPACING.LG },
  foodName: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: FONT_WEIGHT.BOLD,
    color: palette.textPrimary,
    marginBottom: SPACING.SM,
  },
  categoryChip: { alignSelf: 'flex-start', backgroundColor: palette.bgCard, marginBottom: SPACING.LG },
  categoryChipText: { fontSize: FONT_SIZE.SM },
  calories: {
    fontSize: 56,
    fontWeight: FONT_WEIGHT.BOLD,
    color: palette.primary,
    textAlign: 'center',
  },
  caloriesLabel: {
    fontSize: FONT_SIZE.MD,
    color: palette.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.LG,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.MD,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: palette.border,
    marginBottom: SPACING.MD,
  },
  macro: { alignItems: 'center' },
  macroValue: { fontSize: FONT_SIZE.LG, fontWeight: FONT_WEIGHT.BOLD },
  macroLabel: { fontSize: FONT_SIZE.XS, color: palette.textSecondary, marginTop: 2 },
  primaryBtn: { borderRadius: 24, marginTop: SPACING.XL, marginBottom: SPACING.SM },
  secondaryBtn: { borderRadius: 24, marginBottom: SPACING.SM },
  btnContent: { paddingVertical: SPACING.XS },
});
