import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { palette } from '@/constants/Colors';
import { SPACING } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

type Props = {
  onRequestPermission: () => Promise<void>;
  onManualEntry: () => void;
};

export function NoCameraPermission({ onRequestPermission, onManualEntry }: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📷</Text>
      <Text style={styles.title}>Camera Access Required</Text>
      <Text style={styles.subtitle}>
        Allow camera access to scan food and get instant nutrition info.
      </Text>
      <Button mode="contained" onPress={onRequestPermission} style={styles.button}>
        Allow Camera Access
      </Button>
      <Button mode="text" onPress={onManualEntry} textColor={palette.textSecondary}>
        Enter Manually
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.XL,
    backgroundColor: palette.bgPage,
  },
  icon: { fontSize: 64, marginBottom: SPACING.XL },
  title: {
    fontSize: FONT_SIZE.XL,
    fontWeight: FONT_WEIGHT.BOLD,
    color: palette.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.SM,
  },
  subtitle: {
    fontSize: FONT_SIZE.MD,
    color: palette.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.XL,
  },
  button: { marginBottom: SPACING.SM, borderRadius: 24 },
});
