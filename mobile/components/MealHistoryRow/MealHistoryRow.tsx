import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '@/constants/Colors';
import { SPACING } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';
import type { MealEntry } from '@/types/diary.types';

type MealHistoryRowProps = {
  meal: MealEntry;
  onPress: () => void;
};

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function MealHistoryRow({ meal, onPress }: MealHistoryRowProps): React.JSX.Element {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.thumbnail} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {meal.name}
        </Text>
        <Text style={styles.macros}>
          P: {meal.protein}g · F: {meal.fat}g · C: {meal.carbs}g
        </Text>
        <Text style={styles.time}>{formatTime(meal.loggedAt)}</Text>
      </View>
      <Text style={styles.calories}>{meal.calories} kcal</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.bgCard,
    marginHorizontal: SPACING.LG,
    marginBottom: SPACING.SM,
    borderRadius: 12,
    padding: SPACING.MD,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: palette.border,
    marginRight: SPACING.MD,
    flexShrink: 0,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textPrimary,
    marginBottom: 2,
  },
  macros: {
    fontSize: FONT_SIZE.XS,
    color: palette.textSecondary,
    marginBottom: 2,
  },
  time: {
    fontSize: FONT_SIZE.XS,
    color: palette.textSecondary,
  },
  calories: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textPrimary,
    marginLeft: SPACING.SM,
  },
});
