// mobile/components/StatCard/StatCard.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

export type StatCardProps = {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
};

export function StatCard({ label, value, unit, delta }: StatCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit ? <Text style={styles.unit}> {unit}</Text> : null}
      </View>
      {delta ? <Text style={styles.delta}>{delta}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: palette.bgCard,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginHorizontal: SPACING.XS,
    alignItems: 'center',
  },
  label: {
    fontSize: FONT_SIZE.XS,
    color: palette.textSecondary,
    marginBottom: SPACING.XS,
    textAlign: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.BOLD,
    color: palette.textPrimary,
  },
  unit: {
    fontSize: FONT_SIZE.XS,
    color: palette.textSecondary,
  },
  delta: {
    fontSize: FONT_SIZE.XS,
    color: palette.primary,
    marginTop: SPACING.XS,
  },
});
