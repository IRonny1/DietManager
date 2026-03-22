import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useRouter } from 'expo-router';
import { Button, Text } from 'react-native-paper';

import { palette } from '@/constants/Colors';
import { useProfileStore } from '@/stores/useProfileStore';

export default function CompletionSuccessView(): React.JSX.Element {
  const router = useRouter();
  const profile = useProfileStore((state) => state.profile);

  const handleGoToDashboard = (): void => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.celebration}>
        <Text style={styles.emoji}>🎉</Text>
        <Text variant="headlineMedium" style={styles.title}>
          You're All Set!
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Your personalized diet plan is ready. We'll use your preferences to
          give you the best recommendations.
        </Text>
      </View>

      {profile && (
        <View style={styles.summary}>
          <Text variant="titleMedium" style={styles.summaryTitle}>
            Your Profile Summary
          </Text>

          {profile.basicBodyInfo && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryEmoji}>📏</Text>
              <Text variant="bodyMedium" style={styles.summaryText}>
                {profile.basicBodyInfo.weightKg}kg →{' '}
                {profile.basicBodyInfo.targetWeightKg}kg
              </Text>
            </View>
          )}

          {profile.dietPreferences && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryEmoji}>🥗</Text>
              <Text variant="bodyMedium" style={styles.summaryText}>
                {profile.dietPreferences.dietType.replace(/_/g, ' ')}
              </Text>
            </View>
          )}

          {profile.goals && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryEmoji}>🎯</Text>
              <Text variant="bodyMedium" style={styles.summaryText}>
                {profile.goals.primaryGoal.replace(/_/g, ' ')}
              </Text>
            </View>
          )}

          {profile.healthConditions &&
            profile.healthConditions.allergies.length > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryEmoji}>⚠️</Text>
                <Text variant="bodyMedium" style={styles.summaryText}>
                  {profile.healthConditions.allergies.length} allergies noted
                </Text>
              </View>
            )}
        </View>
      )}

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={handleGoToDashboard}
          style={styles.primaryButton}
          contentStyle={styles.buttonContent}
          buttonColor={palette.primary}
          labelStyle={styles.primaryButtonLabel}
        >
          Go to Dashboard
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
    backgroundColor: palette.white,
  },
  celebration: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 16,
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
  summary: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    gap: 12,
  },
  summaryTitle: {
    color: palette.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryEmoji: {
    fontSize: 20,
  },
  summaryText: {
    color: palette.textSecondary,
    textTransform: 'capitalize',
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
});
