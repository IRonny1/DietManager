import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { Chip } from 'react-native-paper';

import { palette } from '@/constants/Colors';

type ChipOption = {
  label: string;
  value: string;
};

type ChipSelectorProps = {
  options: ChipOption[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  multiSelect?: boolean;
  disabled?: boolean;
};

export default function ChipSelector({
  options,
  selected,
  onSelectionChange,
  multiSelect = true,
  disabled = false,
}: ChipSelectorProps): React.JSX.Element {
  const handlePress = useCallback(
    (value: string): void => {
      if (multiSelect) {
        const isSelected = selected.includes(value);
        if (isSelected) {
          onSelectionChange(selected.filter((v) => v !== value));
        } else {
          onSelectionChange([...selected, value]);
        }
      } else {
        onSelectionChange(selected[0] === value ? [] : [value]);
      }
    },
    [selected, onSelectionChange, multiSelect],
  );

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <Chip
            key={option.value}
            selected={isSelected}
            onPress={() => handlePress(option.value)}
            mode={isSelected ? 'flat' : 'outlined'}
            style={[
              styles.chip,
              isSelected && styles.chipSelected,
            ]}
            textStyle={[
              styles.chipText,
              isSelected && styles.chipTextSelected,
            ]}
            showSelectedOverlay={false}
            disabled={disabled}
            selectedColor={isSelected ? palette.white : palette.textPrimary}
          >
            {option.label}
          </Chip>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderColor: palette.divider,
    backgroundColor: palette.white,
  },
  chipSelected: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  chipText: {
    color: palette.textPrimary,
    fontSize: 14,
  },
  chipTextSelected: {
    color: palette.white,
  },
});
