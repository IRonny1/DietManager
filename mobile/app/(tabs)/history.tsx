import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function HistoryScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">History</Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Meal history will appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  subtitle: { opacity: 0.6, marginTop: 8 },
});
