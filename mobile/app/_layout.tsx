import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';

import { useColorScheme } from '@/components/useColorScheme';
import { paperTheme } from '@/constants/paperTheme';
import { useIsBootstrapDone, useProfileStore } from '@/stores/useProfileStore';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const isBootstrapDone = useIsBootstrapDone();
  const profile = useProfileStore((s) => s.profile);
  const loadProfile = useProfileStore((s) => s.loadProfile);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!isBootstrapDone) return;
    if (profile === null) return;

    const inOnboardingGroup = segments[0] === '(onboarding)';
    const isComplete = profile.isComplete;

    if (!isComplete && !inOnboardingGroup) {
      router.replace('/(onboarding)/welcome');
    } else if (isComplete && inOnboardingGroup) {
      router.replace('/(tabs)');
    }
  }, [isBootstrapDone, profile, segments, router]);

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="profile-completion"
            options={{ headerShown: false, animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="scan-result"
            options={{ title: 'Scan Result', headerBackTitle: 'Scan' }}
          />
          <Stack.Screen
            name="edit-meal"
            options={{ title: 'Edit Meal', headerBackTitle: 'Back' }}
          />
          <Stack.Screen
            name="date-range-picker"
            options={{ title: 'Select Date Range', presentation: 'modal', headerBackTitle: 'Back' }}
          />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen
            name="edit-profile"
            options={{ title: 'Edit Profile', headerShown: false }}
          />
          <Stack.Screen
            name="edit-my-goals"
            options={{ title: 'Edit My Goals', headerShown: false }}
          />
          <Stack.Screen name="water-tracking" options={{ title: 'Water Tracking' }} />
          <Stack.Screen name="weight-log" options={{ title: 'Weight Log' }} />
          <Stack.Screen
            name="log-custom-amount"
            options={{ title: 'Log Custom Amount', presentation: 'modal', headerBackTitle: 'Back' }}
          />
          <Stack.Screen
            name="log-weight"
            options={{ title: 'Log Weight', presentation: 'modal', headerBackTitle: 'Back' }}
          />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}
