import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { palette } from '@/constants/Colors';

import { useProfile } from './hooks/useProfile';

export default function ProfileScreen(): React.JSX.Element {
  const {
    user,
    profile,
    avatarInitials,
    calorieGoal,
    primaryGoal,
    activityLevel,
    handleEditProfile,
    handleEditGoals,
    handleWaterTracking,
    handleWeightLog,
    handleLogOut,
  } = useProfile();

  const displayName =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : user?.email ?? '';

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="headlineMedium" style={styles.pageTitle}>
        Profile
      </Text>

      {/* User Card */}
      <View style={styles.card}>
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarInitials}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text variant="titleMedium" style={styles.userName}>
              {displayName}
            </Text>
            <Text variant="bodySmall" style={styles.userEmail}>
              {user?.email}
            </Text>
            <TouchableOpacity onPress={handleEditProfile} style={styles.editLink}>
              <MaterialCommunityIcons name="pencil" size={14} color={palette.primary} />
              <Text variant="bodySmall" style={styles.editLinkText}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* My Goals */}
      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          My Goals
        </Text>
        <TouchableOpacity onPress={handleEditGoals} style={styles.editGoalsLink}>
          <Text variant="bodySmall" style={styles.editGoalsText}>
            Edit
          </Text>
          <MaterialCommunityIcons name="chevron-right" size={16} color={palette.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.goalsCard}>
        <View style={styles.goalStat}>
          <Text variant="titleLarge" style={styles.goalValue}>
            {calorieGoal > 0 ? calorieGoal.toLocaleString() : '—'}
          </Text>
          <Text variant="bodySmall" style={styles.goalLabel}>
            Cal Goal
          </Text>
        </View>
        <View style={styles.goalDivider} />
        <View style={styles.goalStat}>
          <Text variant="titleMedium" style={styles.goalValue}>
            {primaryGoal}
          </Text>
          <Text variant="bodySmall" style={styles.goalLabel}>
            Goal
          </Text>
        </View>
        <View style={styles.goalDivider} />
        <View style={styles.goalStat}>
          <Text variant="titleMedium" style={styles.goalValue}>
            {activityLevel}
          </Text>
          <Text variant="bodySmall" style={styles.goalLabel}>
            Lifestyle
          </Text>
        </View>
      </View>

      {/* Quick Links */}
      <TouchableOpacity style={styles.linkRow} onPress={handleWaterTracking}>
        <View style={styles.linkLeft}>
          <MaterialCommunityIcons name="water" size={20} color={palette.primary} />
          <Text variant="bodyLarge" style={styles.linkText}>
            Water Tracking
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={palette.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkRow} onPress={handleWeightLog}>
        <View style={styles.linkLeft}>
          <MaterialCommunityIcons name="scale" size={20} color={palette.primary} />
          <Text variant="bodyLarge" style={styles.linkText}>
            Weight Log
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={palette.textSecondary} />
      </TouchableOpacity>

      {/* Log Out */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
        <MaterialCommunityIcons name="logout" size={20} color={palette.white} />
        <Text variant="bodyLarge" style={styles.logoutText}>
          Log Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
    gap: 12,
  },
  pageTitle: {
    color: palette.textPrimary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    backgroundColor: palette.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: palette.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    color: palette.textPrimary,
    fontWeight: '600',
  },
  userEmail: {
    color: palette.textSecondary,
  },
  editLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  editLinkText: {
    color: palette.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sectionTitle: {
    color: palette.textPrimary,
    fontWeight: '600',
  },
  editGoalsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  editGoalsText: {
    color: palette.primary,
  },
  goalsCard: {
    backgroundColor: palette.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  goalValue: {
    color: palette.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
  goalLabel: {
    color: palette.textSecondary,
    textAlign: 'center',
  },
  goalDivider: {
    width: 1,
    height: 40,
    backgroundColor: palette.border,
  },
  linkRow: {
    backgroundColor: palette.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  linkText: {
    color: palette.textPrimary,
  },
  logoutButton: {
    backgroundColor: palette.error,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  logoutText: {
    color: palette.white,
    fontWeight: '600',
  },
});
