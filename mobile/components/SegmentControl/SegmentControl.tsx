import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

export type SegmentControlProps = {
  options: Array<{ label: string; value: string }>;
  activeValue: string;
  onChange: (value: string) => void;
};

export function SegmentControl({
  options,
  activeValue,
  onChange,
}: SegmentControlProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isActive = option.value === activeValue;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.segment, isActive && styles.segmentActive]}
            onPress={() => onChange(option.value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: palette.bgCard,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.XS,
    marginHorizontal: SPACING.LG,
    marginBottom: SPACING.LG,
  },
  segment: {
    flex: 1,
    paddingVertical: SPACING.SM,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.SM,
  },
  segmentActive: {
    backgroundColor: palette.white,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.MEDIUM,
    color: palette.textSecondary,
  },
  labelActive: {
    color: palette.textPrimary,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },
});
