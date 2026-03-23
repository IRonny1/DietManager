import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { SPACING } from '../../../constants/spacing.constants';
import { FONT_SIZE } from '../../../constants/typography.constants';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  primaryLabel: string;
  onPrimary: () => void;
  isPrimaryLoading?: boolean;
  onSkip?: () => void;
}

export default function OnboardingLayout({
  children,
  showBack,
  onBack,
  primaryLabel,
  onPrimary,
  isPrimaryLoading,
  onSkip,
}: OnboardingLayoutProps): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {showBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
        )}

        <View style={styles.content}>{children}</View>

        <View style={styles.footer}>
          <Button
            mode="contained"
            buttonColor={Colors.primary}
            style={styles.primaryBtn}
            contentStyle={styles.primaryContent}
            onPress={onPrimary}
            loading={isPrimaryLoading}
            disabled={isPrimaryLoading}
          >
            {primaryLabel}
          </Button>
          {onSkip && (
            <TouchableOpacity onPress={onSkip} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  container: { flex: 1, paddingHorizontal: SPACING.LG },
  backBtn: { paddingTop: SPACING.MD, marginBottom: SPACING.SM },
  backIcon: { fontSize: 28, color: Colors.textPrimary },
  content: { flex: 1 },
  footer: { paddingBottom: SPACING.XL },
  primaryBtn: { borderRadius: 8, marginBottom: SPACING.SM },
  primaryContent: { paddingVertical: SPACING.XS },
  skipBtn: { alignSelf: 'center' },
  skipText: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary },
});
