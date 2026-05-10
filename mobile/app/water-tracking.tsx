import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '@/constants/Colors';

export default function WaterTrackingRoute(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.text}>
        Water Tracking
      </Text>
      <Text variant="bodyMedium" style={styles.sub}>
        Coming soon
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: palette.bgPage },
  text: { color: palette.textPrimary, fontWeight: 'bold' },
  sub: { color: palette.textSecondary, marginTop: 8 },
});
