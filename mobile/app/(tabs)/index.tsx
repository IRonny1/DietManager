import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from 'react-native-paper';

import ProfileCompletionBanner from '@/screens/Profile/components/ProfileCompletionBanner';
import { useProfileStore } from '@/stores/useProfileStore';

export default function TabOneScreen() {
  const profile = useProfileStore((state) => state.profile);
  const loadProfile = useProfileStore((state) => state.loadProfile);
  const isComplete = profile?.isComplete ?? false;
  const completionPercentage = profile?.completionPercentage ?? 0;

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <View style={styles.container}>
      {!isComplete && (
        <View style={styles.bannerContainer}>
          <ProfileCompletionBanner completionPercentage={completionPercentage} />
        </View>
      )}

      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          🍽️ Dashboard
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Your personalized diet overview will appear here.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  bannerContainer: {
    marginBottom: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 24,
  },
});
