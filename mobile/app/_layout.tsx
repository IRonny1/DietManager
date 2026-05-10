import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';

import { useColorScheme } from '@/components/useColorScheme';
import { paperTheme } from '@/constants/paperTheme';
import { useAuthGate } from '@/hooks/useAuthGate';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
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
  useAuthGate();

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
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
            name="logout-confirmation"
            options={{ presentation: 'transparentModal', headerShown: false, animation: 'fade' }}
          />
          <Stack.Screen
            name="edit-profile"
            options={{ title: 'Edit Profile', headerShown: false }}
          />
          <Stack.Screen
            name="edit-my-goals"
            options={{ title: 'Edit My Goals', headerShown: false }}
          />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}
