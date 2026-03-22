import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useRouter } from 'expo-router';
import { Button, ProgressBar, Text } from 'react-native-paper';

import { palette } from '@/constants/Colors';

type ProfileCompletionBannerProps = {
  completionPercentage: number;
};

export default function ProfileCompletionBanner({
  completionPercentage,
}: ProfileCompletionBannerProps): React.JSX.Element {
  const router = useRouter();

  const handlePress = (): void => {
    router.push('/profile-completion');
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>📋</Text>
        <View style={styles.headerText}>
          <Text variant="titleSmall" style={styles.title}>
            Complete Your Profile
          </Text>
          <Text variant="bodySmall" style={styles.subtitle}>
            Help us personalize your diet plan
          </Text>
        </View>
        <Text variant="titleMedium" style={styles.percentage}>
          {completionPercentage}%
        </Text>
      </View>

      <ProgressBar
        progress={completionPercentage / 100}
        color={palette.primary}
        style={styles.progressBar}
      />

      <Button
        mode="contained"
        onPress={handlePress}
        buttonColor={palette.primary}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        compact
      >
        {completionPercentage === 0 ? 'Get Started' : 'Continue'}
      </Button>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: palette.primaryLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 28,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: palette.primaryDark,
    fontWeight: '600',
  },
  subtitle: {
    color: palette.textSecondary,
    marginTop: 2,
  },
  percentage: {
    color: palette.primary,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C8E6C9',
  },
  button: {
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  buttonContent: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});
