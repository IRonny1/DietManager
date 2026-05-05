import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '@/constants/Colors';
import { SPACING } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

type Props = {
  ingredients: string[];
  expanded: boolean;
  onToggle: () => void;
};

export function IngredientsAccordion({ ingredients, expanded, onToggle }: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={onToggle} activeOpacity={0.7}>
        <Text style={styles.title}>Ingredients ({ingredients.length})</Text>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.body}>
          {ingredients.map((item, i) => (
            <Text key={i} style={styles.item}>• {item}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderTopWidth: 1, borderTopColor: palette.border, marginTop: SPACING.MD },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.MD,
  },
  title: { fontSize: FONT_SIZE.MD, fontWeight: FONT_WEIGHT.MEDIUM, color: palette.textPrimary },
  chevron: { color: palette.textSecondary, fontSize: FONT_SIZE.SM },
  body: { paddingBottom: SPACING.MD },
  item: { fontSize: FONT_SIZE.SM, color: palette.textSecondary, paddingVertical: 2 },
});
