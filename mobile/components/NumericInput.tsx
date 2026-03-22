import React from 'react';
import { StyleSheet, View } from 'react-native';

import { HelperText, TextInput } from 'react-native-paper';

import { palette } from '@/constants/Colors';

type NumericInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  unit: string;
  error?: string;
  disabled?: boolean;
  icon?: string;
  placeholder?: string;
};

export default function NumericInput({
  label,
  value,
  onChangeText,
  onBlur,
  unit,
  error,
  disabled = false,
  icon,
  placeholder,
}: NumericInputProps): React.JSX.Element {
  const handleChangeText = (text: string): void => {
    // Allow only numbers and decimal point
    const filtered = text.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points
    const parts = filtered.split('.');
    if (parts.length > 2) {
      return;
    }
    onChangeText(filtered);
  };

  return (
    <View style={styles.container}>
      <TextInput
        label={label}
        value={value}
        onChangeText={handleChangeText}
        onBlur={onBlur}
        mode="outlined"
        keyboardType="decimal-pad"
        error={!!error}
        disabled={disabled}
        placeholder={placeholder}
        left={icon ? <TextInput.Icon icon={icon} /> : undefined}
        right={<TextInput.Affix text={unit} />}
        style={styles.input}
        outlineColor={palette.divider}
        activeOutlineColor={palette.primary}
      />
      {error && <HelperText type="error">{error}</HelperText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  input: {
    backgroundColor: palette.white,
  },
});
