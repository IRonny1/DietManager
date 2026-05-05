import { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useIsAuthenticated, useAuthStore } from '../stores/useAuthStore';
import { useHasCompletedOnboarding } from '../stores/useProfileStore';

export function useAuthGate(): void {
  const isAuthenticated = useIsAuthenticated();
  const hasCompletedOnboarding = useHasCompletedOnboarding();
  const segments = useSegments();
  const router = useRouter();

  const [hasHydrated, setHasHydrated] = useState<boolean>(
    () => useAuthStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

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
  }, [isAuthenticated, hasCompletedOnboarding, segments, router, hasHydrated]);
}
