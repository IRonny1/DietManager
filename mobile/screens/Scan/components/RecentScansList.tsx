import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import type { RecentScan } from '@/types/scan.types';
import { palette } from '@/constants/Colors';
import { SPACING } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

type Props = { scans: RecentScan[] };

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function RecentScansList({ scans }: Props): React.JSX.Element | null {
  if (scans.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Scans</Text>
      {scans.map((scan) => (
        <View key={scan.id} style={styles.item}>
          <View style={styles.info}>
            <Text style={styles.name}>{scan.name}</Text>
            <Text style={styles.time}>{formatTime(scan.scannedAt)}</Text>
          </View>
          <Text style={styles.calories}>{scan.calories} kcal</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.bgPage,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textPrimary,
    marginBottom: SPACING.SM,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  info: { flex: 1 },
  name: {
    fontSize: FONT_SIZE.SM,
    color: palette.textPrimary,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  time: { fontSize: FONT_SIZE.XS, color: palette.textSecondary, marginTop: 2 },
  calories: {
    fontSize: FONT_SIZE.SM,
    color: palette.primary,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },
});
