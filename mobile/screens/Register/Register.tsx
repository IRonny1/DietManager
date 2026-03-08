import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';
import { Button, Divider, Text } from 'react-native-paper';

import { palette } from '@/constants/Colors';

import RegisterForm from './components/RegisterForm';
import { useRegisterForm } from './hooks/useRegisterForm';

export default function RegisterScreen(): React.JSX.Element {
  const router = useRouter();
  const {
    form,
    isSubmitting,
    serverError,
    onSubmit,
    isPasswordVisible,
    togglePasswordVisibility,
    isConfirmPasswordVisible,
    toggleConfirmPasswordVisibility,
  } = useRegisterForm();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Create Account
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Start tracking your nutrition with AI
          </Text>
        </View>

        <RegisterForm
          form={form}
          isSubmitting={isSubmitting}
          serverError={serverError}
          onSubmit={onSubmit}
          isPasswordVisible={isPasswordVisible}
          togglePasswordVisibility={togglePasswordVisibility}
          isConfirmPasswordVisible={isConfirmPasswordVisible}
          toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
        />

        <View style={styles.dividerContainer}>
          <Divider style={styles.divider} />
          <Text variant="bodySmall" style={styles.dividerText}>
            OR
          </Text>
          <Divider style={styles.divider} />
        </View>

        {/* Google Sign-Up placeholder — will be functional with OAuth later */}
        <Button
          mode="outlined"
          icon="google"
          disabled
          style={styles.googleButton}
          contentStyle={styles.googleButtonContent}
          labelStyle={styles.googleButtonLabel}
        >
          Sign up with Google
        </Button>

        <Button
          mode="text"
          onPress={() => router.replace('/(auth)/login')}
          textColor={palette.accent}
          style={styles.switchAuth}
        >
          Already have an account? Sign In
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.white,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    color: palette.textPrimary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: palette.textSecondary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    color: palette.textSecondary,
  },
  googleButton: {
    borderRadius: 12,
    borderColor: palette.divider,
  },
  googleButtonContent: {
    paddingVertical: 8,
  },
  googleButtonLabel: {
    fontSize: 14,
    color: palette.textSecondary,
  },
  switchAuth: {
    marginTop: 24,
  },
});
