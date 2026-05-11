import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { addWaterEntry } from '@/services/waterTracking.service';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

export function LogCustomAmount(): React.JSX.Element {
  const router = useRouter();
  const [amount, setAmount] = useState('300');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleLog = async (): Promise<void> => {
    const parsed = parseInt(amount, 10);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Enter a valid amount greater than 0');
      return;
    }
    setError('');
    setIsSaving(true);
    try {
      await addWaterEntry(parsed);
      router.back();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Log Custom Amount</Text>

        <Text style={styles.label}>Amount (ml)</Text>
        <TextInput
          mode="outlined"
          keyboardType="number-pad"
          value={amount}
          onChangeText={(v) => {
            setAmount(v);
            setError('');
          }}
          style={styles.input}
          autoFocus
        />
        {error !== '' && <Text style={styles.error}>{error}</Text>}

        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.button}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleLog}
            loading={isSaving}
            disabled={isSaving}
            style={styles.button}
          >
            Log
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: palette.bgPage,
    padding: SPACING.XL,
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
  },
  input: {
    backgroundColor: palette.bgPage,
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
