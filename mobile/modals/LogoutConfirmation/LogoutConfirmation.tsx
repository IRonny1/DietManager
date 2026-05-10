import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { useRouter } from 'expo-router';
import { Button, Text } from 'react-native-paper';

import { palette } from '@/constants/Colors';
import { useAuthStore } from '@/stores/useAuthStore';

export default function LogoutConfirmation(): React.JSX.Element {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleCancel = useCallback((): void => {
    router.back();
  }, [router]);

  const handleConfirm = useCallback((): void => {
    void logout();
  }, [logout]);

  return (
    <View style={styles.overlay}>
      <View style={styles.dialog}>
        <Text variant="titleLarge" style={styles.title}>
          Log Out?
        </Text>
        <Text variant="bodyMedium" style={styles.body}>
          Are you sure you want to log out of DietManager?
        </Text>
        <View style={styles.buttons}>
          <Button
            mode="outlined"
            onPress={handleCancel}
            style={styles.cancelButton}
            textColor={palette.textPrimary}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleConfirm}
            style={styles.logoutButton}
            buttonColor={palette.error}
            textColor={palette.white}
          >
            Log Out
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialog: {
    backgroundColor: palette.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    gap: 12,
  },
  title: {
    color: palette.textPrimary,
    fontWeight: 'bold',
  },
  body: {
    color: palette.textSecondary,
    lineHeight: 22,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    borderColor: palette.border,
  },
  logoutButton: {
    flex: 1,
  },
});
