import React from 'react';

import { Stack } from 'expo-router';

export default function OnboardingLayout(): React.JSX.Element {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="features" />
      <Stack.Screen name="method" />
      <Stack.Screen name="personal-data" />
      <Stack.Screen name="activity-goal" />
      <Stack.Screen name="manual-entry" />
      <Stack.Screen name="result" />
    </Stack>
  );
}
