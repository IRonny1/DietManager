import { useCallback } from 'react';

import { useRouter } from 'expo-router';

import { useProfileStore } from '@/stores/useProfileStore';
import { PRIMARY_GOAL_OPTIONS, ACTIVITY_LEVEL_OPTIONS } from '@/constants/profile.constants';
import type { UserProfile } from '@/types/profile.types';

type UseProfileReturn = {
  profile: UserProfile | null;
  avatarInitials: string;
  calorieGoal: number;
  primaryGoal: string;
  activityLevel: string;
  handleEditProfile: () => void;
  handleEditGoals: () => void;
  handleWaterTracking: () => void;
  handleWeightLog: () => void;
};

function getAvatarInitials(profile: UserProfile | null): string {
  if (profile?.firstName && profile?.lastName) {
    return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
  }
  if (profile?.firstName) {
    return profile.firstName[0].toUpperCase();
  }
  return 'U';
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
  const profile = useProfileStore((state) => state.profile);

  const avatarInitials = getAvatarInitials(profile);
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
    // @ts-ignore
    router.push('/water-tracking');
  }, [router]);

  const handleWeightLog = useCallback((): void => {
    // @ts-ignore
    router.push('/weight-log');
  }, [router]);

  return {
    profile,
    avatarInitials,
    calorieGoal,
    primaryGoal,
    activityLevel,
    handleEditProfile,
    handleEditGoals,
    handleWaterTracking,
    handleWeightLog,
  };
}
