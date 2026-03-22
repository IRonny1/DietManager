import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SegmentedButtons } from 'react-native-paper';

import type { MeasurementSystem } from '@/types/profile.types';

type UnitToggleProps = {
  value: MeasurementSystem;
  onValueChange: (value: MeasurementSystem) => void;
  disabled?: boolean;
};

export default function UnitToggle({
  value,
  onValueChange,
  disabled = false,
}: UnitToggleProps): React.JSX.Element {
  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <SegmentedButtons
        value={value}
        onValueChange={(val) => {
          if (!disabled) {
            onValueChange(val as MeasurementSystem);
          }
        }}
        buttons={[
          { value: 'metric', label: 'Metric (kg, cm)', disabled },
          { value: 'imperial', label: 'Imperial (lbs, ft)', disabled },
        ]}
        density="small"
        style={styles.buttons}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  buttons: {
    borderRadius: 12,
  },
});
