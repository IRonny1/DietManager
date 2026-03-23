import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { SPACING } from '../../../constants/spacing.constants';

interface OnboardingProgressDotsProps {
  total: number;
  current: number; // 0-based
}

export default function OnboardingProgressDots({ total, current }: OnboardingProgressDotsProps): React.JSX.Element {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.XS },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.bgCard },
  dotActive: { width: 24, backgroundColor: Colors.primary },
});
