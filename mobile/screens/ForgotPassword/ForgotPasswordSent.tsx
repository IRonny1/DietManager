import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { SPACING } from '../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../constants/typography.constants';

export default function ForgotPasswordSent(): React.JSX.Element {
  const router = useRouter();
  useLocalSearchParams<{ email: string }>();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>✉️</Text>
          </View>

          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            {"We sent a password reset link to your email.\nCheck your inbox and click the link to continue."}
          </Text>

          <Button
            mode="contained"
            buttonColor={Colors.primary}
            style={styles.btn}
            contentStyle={styles.btnContent}
            onPress={() => {}}
          >
            Open Email App
          </Button>

          <View style={styles.resendRow}>
            <Text style={styles.resendText}>{"Didn't receive it? "}</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.resendLink}>Resend link</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.backToLogin} onPress={() => router.replace('/(auth)/login')}>
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
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.bgCard, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.XL },
  iconText: { fontSize: 36 },
  title: { fontSize: FONT_SIZE.XXL, fontWeight: FONT_WEIGHT.BOLD, color: Colors.textPrimary, marginBottom: SPACING.SM, textAlign: 'center' },
  subtitle: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary, textAlign: 'center', marginBottom: SPACING.XL, lineHeight: 22 },
  btn: { width: '100%', borderRadius: 8, marginBottom: SPACING.MD },
  btnContent: { paddingVertical: SPACING.XS },
  resendRow: { flexDirection: 'row', alignItems: 'center' },
  resendText: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary },
  resendLink: { fontSize: FONT_SIZE.MD, color: Colors.primary },
  backToLogin: { alignSelf: 'center', marginBottom: SPACING.XL },
  backToLoginText: { fontSize: FONT_SIZE.MD, color: Colors.primary },
});
