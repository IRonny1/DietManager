import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button, Divider, List, Text } from 'react-native-paper';

import { palette } from '@/constants/Colors';

import ProfileCompletionBanner from './components/ProfileCompletionBanner';
import { useProfile } from './hooks/useProfile';

export default function ProfileScreen(): React.JSX.Element {
  const {
    user,
    profile,
    isLoading,
    completionPercentage,
    isProfileComplete,
    handleEditProfile,
    handleLogout,
  } = useProfile();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.email?.[0]?.toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text variant="titleLarge" style={styles.userName}>
          {user?.email}
        </Text>
        <Text variant="bodyMedium" style={styles.userEmail}>
          {user?.email}
        </Text>
      </View>

      {/* Completion Banner (if not complete) */}
      {!isProfileComplete && (
        <View style={styles.bannerSection}>
          <ProfileCompletionBanner completionPercentage={completionPercentage} />
        </View>
      )}

      {/* Profile Sections */}
      <View style={styles.sectionsContainer}>
        <Text variant="titleMedium" style={styles.sectionHeader}>
          Profile Details
        </Text>

        <View style={styles.listCard}>
          <List.Item
            title="Body Info"
            description={
              profile?.basicBodyInfo
                ? `${profile.basicBodyInfo.weightKg}kg, ${profile.basicBodyInfo.heightCm}cm`
                : 'Not set'
            }
            left={(props) => <List.Icon {...props} icon="human-male-height" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleEditProfile}
            style={styles.listItem}
          />
          <Divider />

          <List.Item
            title="Health & Allergies"
            description={
              profile?.healthConditions
                ? `${profile.healthConditions.allergies.length} allergies, ${profile.healthConditions.medicalConditions.length} conditions`
                : 'Not set'
            }
            left={(props) => <List.Icon {...props} icon="medical-bag" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleEditProfile}
            style={styles.listItem}
          />
          <Divider />

          <List.Item
            title="Diet Preferences"
            description={
              profile?.dietPreferences
                ? profile.dietPreferences.dietType.replace(/_/g, ' ')
                : 'Not set'
            }
            left={(props) => <List.Icon {...props} icon="food-apple" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleEditProfile}
            style={styles.listItem}
            titleStyle={styles.listItemTitle}
          />
          <Divider />

          <List.Item
            title="Goals"
            description={
              profile?.goals
                ? profile.goals.primaryGoal.replace(/_/g, ' ')
                : 'Not set'
            }
            left={(props) => <List.Icon {...props} icon="target" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleEditProfile}
            style={styles.listItem}
            titleStyle={styles.listItemTitle}
          />
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.sectionsContainer}>
        <Text variant="titleMedium" style={styles.sectionHeader}>
          Settings
        </Text>

        <View style={styles.listCard}>
          <List.Item
            title="Notifications"
            left={(props) => <List.Icon {...props} icon="bell-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            style={styles.listItem}
            disabled
          />
          <Divider />
          <List.Item
            title="Privacy"
            left={(props) => <List.Icon {...props} icon="shield-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            style={styles.listItem}
            disabled
          />
          <Divider />
          <List.Item
            title="Help & Support"
            left={(props) => (
              <List.Icon {...props} icon="help-circle-outline" />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            style={styles.listItem}
            disabled
          />
        </View>
      </View>

      {/* Logout */}
      <Button
        mode="outlined"
        onPress={handleLogout}
        textColor={palette.white}
        style={styles.logoutButton}
        icon="logout"
      >
        Sign Out
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 48,
  },
  userCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: palette.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  userName: {
    color: palette.textPrimary,
    fontWeight: 'bold',
  },
  userEmail: {
    color: palette.textSecondary,
    marginTop: 4,
  },
  bannerSection: {
    marginBottom: 24,
  },
  sectionsContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    color: palette.textPrimary,
    fontWeight: '600',
    marginBottom: 12,
  },
  listCard: {
    backgroundColor: palette.white,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  listItem: {
    paddingVertical: 4,
  },
  listItemTitle: {
    textTransform: 'capitalize',
  },
  logoutButton: {
    borderColor: palette.error,
    backgroundColor: palette.error,
    borderRadius: 12,
  },
});
