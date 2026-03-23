import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForgotPasswordForm } from './hooks/useForgotPasswordForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import AppLogo from '../../components/AppLogo/AppLogo';
import { Colors } from '../../constants/Colors';
import { SPACING } from '../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../constants/typography.constants';

export default function ForgotPassword(): React.JSX.Element {
  const router = useRouter();
  const formProps = useForgotPasswordForm();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <AppLogo horizontal style={styles.logo} />

        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>Enter your email and we'll send you a reset link</Text>

        <ForgotPasswordForm {...formProps} />

        <View style={styles.spacer} />

        <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.backToLogin}>
          <Text style={styles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  container: { flex: 1, paddingHorizontal: SPACING.LG, paddingTop: SPACING.MD },
  backBtn: { marginBottom: SPACING.XL },
  backIcon: { fontSize: 28, color: Colors.textPrimary },
  logo: { marginBottom: SPACING.XL },
  title: { fontSize: FONT_SIZE.XXL, fontWeight: FONT_WEIGHT.BOLD, color: Colors.textPrimary, marginBottom: SPACING.XS },
  subtitle: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary, marginBottom: SPACING.XL },
  spacer: { flex: 1 },
  backToLogin: { alignSelf: 'center', marginBottom: SPACING.XL },
  backToLoginText: { fontSize: FONT_SIZE.MD, color: Colors.primary },
});
