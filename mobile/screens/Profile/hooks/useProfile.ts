import { useCallback } from 'react';

import { useRouter } from 'expo-router';

import { useProfileStore } from '@/stores/useProfileStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { PRIMARY_GOAL_OPTIONS, ACTIVITY_LEVEL_OPTIONS } from '@/constants/profile.constants';
import type { User } from '@/types/auth.types';
import type { UserProfile } from '@/types/profile.types';

type UseProfileReturn = {
  user: User | null;
  profile: UserProfile | null;
  avatarInitials: string;
  calorieGoal: number;
  primaryGoal: string;
  activityLevel: string;
  handleEditProfile: () => void;
  handleEditGoals: () => void;
  handleWaterTracking: () => void;
  handleWeightLog: () => void;
  handleLogOut: () => void;
};

function getAvatarInitials(profile: UserProfile | null, email: string | undefined): string {
  if (profile?.firstName && profile?.lastName) {
    return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
  }
  if (profile?.firstName) {
    return profile.firstName[0].toUpperCase();
  }
  return (email?.[0] ?? '?').toUpperCase();
}

function getGoalLabel(primaryGoal: string | null | undefined): string {
  if (!primaryGoal) return '—';
  const option = PRIMARY_GOAL_OPTIONS.find((o) => o.value === primaryGoal);
  return option?.label ?? primaryGoal;
}

function getActivityLabel(activityLevel: string | null | undefined): string {
  if (!activityLevel) return '—';
  const option = ACTIVITY_LEVEL_OPTIONS.find((o) => o.value === activityLevel);
  return option?.label ?? activityLevel;
}

export function useProfile(): UseProfileReturn {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const profile = useProfileStore((state) => state.profile);

  const avatarInitials = getAvatarInitials(profile, user?.email);
  const calorieGoal = profile?.calorieGoal ?? 0;
  const primaryGoal = getGoalLabel(profile?.goals?.primaryGoal);
  const activityLevel = getActivityLabel(profile?.goals?.activityLevel);

  const handleEditProfile = useCallback((): void => {
    router.push('/edit-profile');
  }, [router]);

  const handleEditGoals = useCallback((): void => {
    router.push('/edit-my-goals');
  }, [router]);

  const handleWaterTracking = useCallback((): void => {
    router.push('/water-tracking');
  }, [router]);

  const handleWeightLog = useCallback((): void => {
    router.push('/weight-log');
  }, [router]);

  const handleLogOut = useCallback((): void => {
    router.push('/logout-confirmation');
  }, [router]);

  return {
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
  };
}
