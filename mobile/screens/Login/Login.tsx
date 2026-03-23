import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginForm from './components/LoginForm';
import { useLoginForm } from './hooks/useLoginForm';
import { Colors } from '../../constants/Colors';
import { SPACING } from '../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../constants/typography.constants';
import AppLogo from '../../components/AppLogo/AppLogo';

export default function Login(): React.JSX.Element {
  const router = useRouter();
  const formProps = useLoginForm();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <AppLogo style={styles.logo} />

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <LoginForm {...formProps} />

        <TouchableOpacity
          style={styles.forgotBtn}
          onPress={() => router.push('/(auth)/forgot-password')}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />

        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.registerText}>
            {"Don't have an account? "}
            <Text style={styles.registerLink}>Sign Up</Text>
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
  forgotBtn: { alignSelf: 'center', marginTop: SPACING.MD },
  forgotText: { fontSize: FONT_SIZE.MD, color: Colors.primary },
  spacer: { flex: 1, minHeight: SPACING.XL },
  registerText: {
    textAlign: 'center',
    fontSize: FONT_SIZE.MD,
    color: Colors.textSecondary,
  },
  registerLink: { color: Colors.primary, fontWeight: FONT_WEIGHT.SEMIBOLD },
});
