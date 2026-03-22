import { create } from 'zustand';

import { TOTAL_STEPS } from '@/constants/profile.constants';
import * as profileService from '@/services/profile.service';
import type {
  MeasurementSystem,
  ProfileStepData,
  UserProfile,
} from '@/types/profile.types';

type ProfileState = {
  profile: UserProfile | null;
  currentStep: number;
  measurementSystem: MeasurementSystem;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
};

type ProfileActions = {
  loadProfile: () => Promise<void>;
  saveStepData: (step: number, data: ProfileStepData) => Promise<void>;
  setMeasurementSystem: (system: MeasurementSystem) => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeProfile: () => Promise<void>;
  clearError: () => void;
  resetProfile: () => void;
};

type ProfileStore = ProfileState & ProfileActions;

const initialState: ProfileState = {
  profile: null,
  currentStep: 0,
  measurementSystem: 'metric',
  isLoading: false,
  isSaving: false,
  error: null,
};

export const useProfileStore = create<ProfileStore>((set, get) => ({
  ...initialState,

  loadProfile: async (): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const response = await profileService.getProfile();
      const profile = response.profile;

      // Find the first incomplete step to resume from
      const steps = [
        profile.basicBodyInfo,
        profile.healthConditions,
        profile.dietPreferences,
        profile.goals,
      ];
      const firstIncomplete = steps.findIndex((step) => step === null);
      const resumeStep =
        firstIncomplete === -1 ? 0 : firstIncomplete;

      set({ profile, currentStep: resumeStep, isLoading: false });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to load profile. Please try again.';
      set({ isLoading: false, error: message });
    }
  },

  saveStepData: async (
    step: number,
    data: ProfileStepData,
  ): Promise<void> => {
    set({ isSaving: true, error: null });

    try {
      const response = await profileService.saveProfileStep(step, data);
      set({ profile: response.profile, isSaving: false });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to save. Please try again.';
      set({ isSaving: false, error: message });
      throw err;
    }
  },

  setMeasurementSystem: (system: MeasurementSystem): void => {
    set({ measurementSystem: system });
  },

  goToStep: (step: number): void => {
    if (step >= 0 && step < TOTAL_STEPS) {
      set({ currentStep: step });
    }
  },

  nextStep: (): void => {
    const { currentStep } = get();
    if (currentStep < TOTAL_STEPS - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: (): void => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  completeProfile: async (): Promise<void> => {
    set({ isSaving: true, error: null });

    try {
      const response = await profileService.completeProfile();
      set({ profile: response.profile, isSaving: false });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to complete profile. Please try again.';
      set({ isSaving: false, error: message });
      throw err;
    }
  },

  clearError: (): void => {
    set({ error: null });
  },

  resetProfile: (): void => {
    profileService.resetMockProfile();
    set(initialState);
  },
}));

export function useProfile(): UserProfile | null {
  return useProfileStore((state) => state.profile);
}

export function useCurrentStep(): number {
  return useProfileStore((state) => state.currentStep);
}

export function useProfileLoading(): boolean {
  return useProfileStore((state) => state.isLoading);
}

export function useProfileSaving(): boolean {
  return useProfileStore((state) => state.isSaving);
}

export function useCompletionPercentage(): number {
  return useProfileStore((state) => state.profile?.completionPercentage ?? 0);
}

export function useMeasurementSystem(): MeasurementSystem {
  return useProfileStore((state) => state.measurementSystem);
}

export function useIsProfileComplete(): boolean {
  return useProfileStore((state) => state.profile?.isComplete ?? false);
}
