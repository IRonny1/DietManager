import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-paper';

import type { MealEntry } from '@/types/diary.types';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

type MealCardProps = {
  meal: MealEntry;
  onPress: () => void;
};

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function MealCard({ meal, onPress }: MealCardProps): React.JSX.Element {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageWrapper}>
        {meal.imageUri ? (
          <Image source={{ uri: meal.imageUri }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.category}>{meal.category}</Text>
        <Text style={styles.name}>{meal.name}</Text>
        <Text style={styles.meta}>
          {meal.calories} kcal · {formatTime(meal.loggedAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const IMAGE_SIZE = 64;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.MD,
    gap: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  imageWrapper: {
    flexShrink: 0,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: BORDER_RADIUS.SM,
  },
  imagePlaceholder: {
    backgroundColor: palette.bgCard,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  category: {
    fontSize: FONT_SIZE.XS,
    color: palette.textSecondary,
  },
  name: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textPrimary,
  },
  meta: {
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
  },
});
