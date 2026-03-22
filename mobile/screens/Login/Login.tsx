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

import LoginForm from './components/LoginForm';
import { useLoginForm } from './hooks/useLoginForm';

export default function LoginScreen(): React.JSX.Element {
  const router = useRouter();
  const {
    form,
    isSubmitting,
    serverError,
    onSubmit,
    isPasswordVisible,
    togglePasswordVisibility,
  } = useLoginForm();

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
            Welcome Back
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Sign in to continue tracking your nutrition
          </Text>
        </View>

        <LoginForm
          form={form}
          isSubmitting={isSubmitting}
          serverError={serverError}
          onSubmit={onSubmit}
          isPasswordVisible={isPasswordVisible}
          togglePasswordVisibility={togglePasswordVisibility}
        />

        <Button
          mode="text"
          textColor={palette.accent}
          style={styles.forgotPassword}
        >
          Forgot Password?
        </Button>

        <View style={styles.dividerContainer}>
          <Divider style={styles.divider} />
          <Text variant="bodySmall" style={styles.dividerText}>
            OR
          </Text>
          <Divider style={styles.divider} />
        </View>

        {/* Google Sign-In placeholder — will be functional with OAuth later */}
        <Button
          mode="outlined"
          icon="google"
          disabled
          textColor={palette.white}
          style={styles.googleButton}
          contentStyle={styles.googleButtonContent}
          labelStyle={styles.googleButtonLabel}
        >
          Continue with Google
        </Button>

        <Button
          mode="text"
          onPress={() => router.replace('/(auth)/register')}
          textColor={palette.accent}
          style={styles.switchAuth}
        >
          Don't have an account? Sign Up</Button>
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 4,
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
