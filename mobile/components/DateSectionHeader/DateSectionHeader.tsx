// mobile/components/DateSectionHeader/DateSectionHeader.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '@/constants/Colors';
import { SPACING } from '@/constants/spacing.constants';
import { FONT_SIZE } from '@/constants/typography.constants';

type DateSectionHeaderProps = {
  label: string;
};

export function DateSectionHeader({ label }: DateSectionHeaderProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.SM,
    marginTop: SPACING.MD,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: palette.border,
  },
  label: {
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
    paddingHorizontal: SPACING.SM,
  },
});
