import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '@/constants/Colors';
import { SPACING } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

type Props = {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

export function PortionStepper({ value, onIncrease, onDecrease }: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Portion Size</Text>
      <View style={styles.stepper}>
        <TouchableOpacity style={styles.btn} onPress={onDecrease} activeOpacity={0.7}>
          <Text style={styles.btnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.value}>{value}g</Text>
        <TouchableOpacity style={styles.btn} onPress={onIncrease} activeOpacity={0.7}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.MD,
  },
  label: {
    fontSize: FONT_SIZE.MD,
    color: palette.textPrimary,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: SPACING.MD },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: { fontSize: FONT_SIZE.XL, color: palette.textPrimary, lineHeight: 22 },
  value: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textPrimary,
    minWidth: 60,
    textAlign: 'center',
  },
});
