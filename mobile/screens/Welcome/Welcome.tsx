import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useRouter } from 'expo-router';
import { Button, Text } from 'react-native-paper';

import { palette } from '@/constants/Colors';

export default function WelcomeScreen(): React.JSX.Element {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.heroSection}>
        <Text style={styles.emoji}>🍽️</Text>
        <Text variant="headlineLarge" style={styles.title}>
          AI Calorie Tracker
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Scan your meals, track nutrition, and achieve your fitness goals with
          AI-powered food recognition.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => router.push('/(auth)/register')}
          style={styles.primaryButton}
          contentStyle={styles.buttonContent}
          buttonColor={palette.primary}
          labelStyle={styles.primaryButtonLabel}
        >
          Get Started
        </Button>

        <Button
          mode="text"
          onPress={() => router.push('/(auth)/login')}
          textColor={palette.accent}
          style={styles.signInButton}
        >
          Already have an account? Sign In
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.white,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 64,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    color: palette.textPrimary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: palette.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  primaryButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  signInButton: {
    marginTop: 4,
  },
});
