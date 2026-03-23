import { useCallback, useEffect } from 'react';

import { useRouter } from 'expo-router';

import { useProfileStore } from '@/stores/useProfileStore';
import { useAuthStore } from '@/stores/useAuthStore';
import type { User } from '@/types/auth.types';
import type { UserProfile } from '@/types/profile.types';

type UseProfileReturn = {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  completionPercentage: number;
  isProfileComplete: boolean;
  handleEditProfile: () => void;
  handleLogout: () => void;
};

export function useProfile(): UseProfileReturn {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const profile = useProfileStore((state) => state.profile);
  const isLoading = useProfileStore((state) => state.isLoading);
  const loadProfile = useProfileStore((state) => state.loadProfile);

  const completionPercentage = profile?.completionPercentage ?? 0;
  const isProfileComplete = profile?.isComplete ?? false;

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleEditProfile = useCallback((): void => {
    router.push('/profile-completion');
  }, [router]);

  const handleLogout = useCallback((): void => {
    void logout();
  }, [logout]);

  return {
    user,
    profile,
    isLoading,
    completionPercentage,
    isProfileComplete,
    handleEditProfile,
    handleLogout,
  };
}
