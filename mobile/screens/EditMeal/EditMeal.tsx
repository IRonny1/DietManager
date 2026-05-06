import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons } from 'react-native-paper';

import { useEditMeal } from './hooks/useEditMeal';
import { palette } from '@/constants/Colors';
import { SPACING } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';
import type { MealEntry } from '@/types/diary.types';

const MEAL_TYPES: { value: MealEntry['category']; label: string }[] = [
  { value: 'Breakfast', label: 'Breakfast' },
  { value: 'Lunch', label: 'Lunch' },
  { value: 'Dinner', label: 'Dinner' },
  { value: 'Snack', label: 'Snack' },
];

export function EditMeal(): React.JSX.Element {
  const {
    name, setName,
    mealType, setMealType,
    calories, setCalories,
    protein, setProtein,
    fat, setFat,
    carbs, setCarbs,
    portionGrams, setPortionGrams,
    ingredients, setIngredients,
    note, setNote,
    isSaving,
    handleSave,
  } = useEditMeal();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Food Name</Text>
      <TextInput
        mode="outlined"
        value={name}
        onChangeText={setName}
        placeholder="e.g. Grilled Chicken"
        style={styles.input}
      />

      <Text style={styles.label}>Meal Type</Text>
      <SegmentedButtons
        value={mealType}
        onValueChange={(v) => setMealType(v as MealEntry['category'])}
        buttons={MEAL_TYPES}
        style={styles.segmented}
      />

      <Text style={styles.label}>Nutritional Info</Text>
      <View style={styles.row}>
        <TextInput
          mode="outlined"
          label="Calories"
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
          style={styles.halfInput}
        />
        <TextInput
          mode="outlined"
          label="Portion (g)"
          value={portionGrams}
          onChangeText={setPortionGrams}
          keyboardType="numeric"
          style={styles.halfInput}
        />
      </View>
      <View style={styles.row}>
        <TextInput
          mode="outlined"
          label="Protein (g)"
          value={protein}
          onChangeText={setProtein}
          keyboardType="numeric"
          style={styles.thirdInput}
        />
        <TextInput
          mode="outlined"
          label="Fat (g)"
          value={fat}
          onChangeText={setFat}
          keyboardType="numeric"
          style={styles.thirdInput}
        />
        <TextInput
          mode="outlined"
          label="Carbs (g)"
          value={carbs}
          onChangeText={setCarbs}
          keyboardType="numeric"
          style={styles.thirdInput}
        />
      </View>

      <Text style={styles.label}>Ingredients</Text>
      <TextInput
        mode="outlined"
        value={ingredients}
        onChangeText={setIngredients}
        placeholder="e.g. chicken, olive oil, garlic"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <Text style={styles.label}>Note</Text>
      <TextInput
        mode="outlined"
        value={note}
        onChangeText={setNote}
        placeholder="Optional note..."
        multiline
        numberOfLines={2}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSave}
        loading={isSaving}
        disabled={isSaving}
        style={styles.saveBtn}
        contentStyle={styles.saveBtnContent}
      >
        Save Changes
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: palette.bgPage },
  content: { padding: SPACING.LG, paddingBottom: SPACING.XXL },
  label: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textSecondary,
    marginTop: SPACING.LG,
    marginBottom: SPACING.XS,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: { backgroundColor: palette.bgPage },
  segmented: { marginBottom: SPACING.SM },
  row: { flexDirection: 'row', gap: SPACING.SM, marginBottom: SPACING.SM },
  halfInput: { flex: 1, backgroundColor: palette.bgPage },
  thirdInput: { flex: 1, backgroundColor: palette.bgPage },
  saveBtn: { marginTop: SPACING.XL, borderRadius: 24 },
  saveBtnContent: { paddingVertical: SPACING.XS },
});
