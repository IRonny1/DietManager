import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

type MacroBarProps = {
  protein: number;
  fat: number;
  carbs: number;
};

type MacroItemProps = {
  label: string;
  value: number;
  color: string;
};

function MacroItem({ label, value, color }: MacroItemProps): React.JSX.Element {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value}g</Text>
    </View>
  );
}

export function MacroBar({ protein, fat, carbs }: MacroBarProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <MacroItem label="Protein" value={protein} color={palette.protein} />
      <MacroItem label="Fat" value={fat} color={palette.fat} />
      <MacroItem label="Carbs" value={carbs} color={palette.carbs} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.SM,
  },
  item: {
    flex: 1,
    backgroundColor: palette.bgCard,
    borderRadius: BORDER_RADIUS.MD,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.SM,
    alignItems: 'center',
    gap: SPACING.XS,
  },
  label: {
    fontSize: FONT_SIZE.XS,
    color: palette.textSecondary,
  },
  value: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.BOLD,
  },
});
