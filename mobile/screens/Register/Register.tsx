import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegisterForm from './components/RegisterForm';
import { useRegisterForm } from './hooks/useRegisterForm';
import { Colors } from '../../constants/Colors';
import { SPACING } from '../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../constants/typography.constants';
import AppLogo from '../../components/AppLogo/AppLogo';

export default function Register(): React.JSX.Element {
  const router = useRouter();
  const formProps = useRegisterForm();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <AppLogo style={styles.logo} />

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to start your nutrition journey</Text>

        <RegisterForm {...formProps} />

        <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.loginBtn}>
          <Text style={styles.loginText}>
            {'Already have an account? '}
            <Text style={styles.loginLink}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  container: {
    flexGrow: 1,
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.XL,
    paddingBottom: SPACING.XL,
  },
  logo: { alignSelf: 'center', marginBottom: SPACING.XL },
  title: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: FONT_WEIGHT.BOLD,
    color: Colors.textPrimary,
    marginBottom: SPACING.XS,
  },
  subtitle: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary, marginBottom: SPACING.XL },
  loginBtn: { marginTop: SPACING.LG, alignSelf: 'center' },
  loginText: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary, textAlign: 'center' },
  loginLink: { color: Colors.primary, fontWeight: FONT_WEIGHT.SEMIBOLD },
});
