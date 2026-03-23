import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useIsAuthenticated } from '../stores/useAuthStore';
import { useHasCompletedOnboarding } from '../stores/useProfileStore';

export function useAuthGate(): void {
  const isAuthenticated = useIsAuthenticated();
  const hasCompletedOnboarding = useHasCompletedOnboarding();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (!isAuthenticated) {
      if (!inAuthGroup) router.replace('/(auth)/welcome');
      return;
    }

    // authenticated
    if (inAuthGroup) {
      if (!hasCompletedOnboarding) {
        router.replace('/(onboarding)/welcome');
      } else {
        router.replace('/(tabs)');
      }
      return;
    }

    if (!hasCompletedOnboarding && !inOnboardingGroup) {
      router.replace('/(onboarding)/welcome');
    } else if (hasCompletedOnboarding && inOnboardingGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, hasCompletedOnboarding, segments, router]);
}
