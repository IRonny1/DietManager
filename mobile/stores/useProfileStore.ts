import { create } from 'zustand';

import { TOTAL_STEPS } from '@/constants/profile.constants';
import * as profileService from '@/services/profile.service';
import type {
  MeasurementSystem,
  ProfileStepData,
  UserProfile,
} from '@/types/profile.types';
import { OnboardingData } from '@/types/onboarding.types';

type ProfileState = {
  profile: UserProfile | null;
  currentStep: number;
  measurementSystem: MeasurementSystem;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  isBootstrapDone: boolean;
  onboardingData: OnboardingData;
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
  setOnboardingData: (partial: Partial<OnboardingData>) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
};

type ProfileStore = ProfileState & ProfileActions;

const initialState: ProfileState = {
  profile: null,
  currentStep: 0,
  measurementSystem: 'metric',
  isLoading: false,
  isSaving: false,
  error: null,
  isBootstrapDone: false,
  onboardingData: {
    goalMethod: null,
    personalData: null,
    activityGoal: null,
    calorieGoal: null,
  },
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

      set({ profile, currentStep: resumeStep, isLoading: false, isBootstrapDone: true });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to load profile. Please try again.';
      set({ isLoading: false, error: message, isBootstrapDone: true });
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
    set(initialState);
  },

  setOnboardingData: (partial: Partial<OnboardingData>) =>
    set((s) => ({
      onboardingData: { ...s.onboardingData, ...partial },
    })),

  updateProfile: (partial: Partial<UserProfile>): void => {
    const current = get().profile;
    if (current === null) return;
    set({
      profile: {
        ...current,
        ...partial,
        ...(partial.basicBodyInfo !== undefined && {
          basicBodyInfo: current.basicBodyInfo !== null
            ? { ...current.basicBodyInfo, ...partial.basicBodyInfo }
            : partial.basicBodyInfo,
        }),
        ...(partial.goals !== undefined && {
          goals: current.goals !== null
            ? { ...current.goals, ...partial.goals }
            : partial.goals,
        }),
        ...(partial.healthConditions !== undefined && {
          healthConditions: current.healthConditions !== null
            ? { ...current.healthConditions, ...partial.healthConditions }
            : partial.healthConditions,
        }),
        ...(partial.dietPreferences !== undefined && {
          dietPreferences: current.dietPreferences !== null
            ? { ...current.dietPreferences, ...partial.dietPreferences }
            : partial.dietPreferences,
        }),
      },
    });
  },
}));

export const useIsBootstrapDone = (): boolean =>
  useProfileStore((s) => s.isBootstrapDone);

