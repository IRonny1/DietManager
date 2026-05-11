import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';

import { useLogWeightForm } from './hooks/useLogWeightForm';
import { palette } from '@/constants/Colors';
import { SPACING } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

export function LogWeight(): React.JSX.Element {
  const {
    date,
    weight,
    note,
    weightError,
    isSaving,
    handleDateChange,
    handleWeightChange,
    handleNoteChange,
    handleSave,
    handleCancel,
  } = useLogWeightForm();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Log Weight</Text>

        <Text style={styles.label}>Date</Text>
        <TextInput
          mode="outlined"
          value={date}
          onChangeText={handleDateChange}
          placeholder="YYYY-MM-DD"
          style={styles.input}
        />

        <Text style={styles.label}>Weight</Text>
        <View style={styles.weightRow}>
          <TextInput
            mode="outlined"
            keyboardType="decimal-pad"
            value={weight}
            onChangeText={handleWeightChange}
            placeholder="72.4"
            style={styles.weightInput}
            autoFocus
          />
          <Text style={styles.unitLabel}>kg</Text>
        </View>
        {weightError !== '' && <Text style={styles.error}>{weightError}</Text>}

        <Text style={styles.label}>Note (optional)</Text>
        <TextInput
          mode="outlined"
          value={note}
          onChangeText={handleNoteChange}
          placeholder="Add a note..."
          style={styles.input}
          multiline
        />

        <View style={styles.actions}>
          <Button mode="outlined" onPress={handleCancel} style={styles.button}>
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={isSaving}
            disabled={isSaving}
            style={styles.button}
          >
            Save
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    backgroundColor: palette.bgPage,
    padding: SPACING.XL,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.BOLD,
    color: palette.textPrimary,
    marginBottom: SPACING.XL,
  },
  label: {
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
    marginBottom: SPACING.XS,
    marginTop: SPACING.MD,
  },
  input: {
    backgroundColor: palette.bgPage,
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  weightInput: {
    flex: 1,
    backgroundColor: palette.bgPage,
  },
  unitLabel: {
    fontSize: FONT_SIZE.MD,
    color: palette.textSecondary,
    minWidth: 24,
  },
  error: {
    fontSize: FONT_SIZE.SM,
    color: palette.error,
    marginTop: SPACING.XS,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.MD,
    marginTop: SPACING.XL,
  },
  button: {
    flex: 1,
  },
});
