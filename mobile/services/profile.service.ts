import { PROFILE_MOCK_DELAY_MS } from '@/constants/profile.constants';
import type {
  ProfileResponse,
  ProfileStepData,
  UserProfile,
} from '@/types/profile.types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const EMPTY_PROFILE: UserProfile = {
  basicBodyInfo: null,
  healthConditions: null,
  dietPreferences: null,
  goals: null,
  isComplete: false,
  completionPercentage: 0,
  updatedAt: new Date().toISOString(),
};

// In-memory storage for mock
let storedProfile: UserProfile = { ...EMPTY_PROFILE };

function calculateCompletion(profile: UserProfile): number {
  const steps = [
    profile.basicBodyInfo,
    profile.healthConditions,
    profile.dietPreferences,
    profile.goals,
  ];
  const completed = steps.filter((step) => step !== null).length;
  return Math.round((completed / steps.length) * 100);
}

export async function getProfile(): Promise<ProfileResponse> {
  await delay(PROFILE_MOCK_DELAY_MS);

  return { profile: { ...storedProfile } };
}

export async function saveProfileStep(
  step: number,
  data: ProfileStepData,
): Promise<ProfileResponse> {
  await delay(PROFILE_MOCK_DELAY_MS);

  const stepKeys: (keyof Pick<
    UserProfile,
    'basicBodyInfo' | 'healthConditions' | 'dietPreferences' | 'goals'
  >)[] = ['basicBodyInfo', 'healthConditions', 'dietPreferences', 'goals'];

  const key = stepKeys[step];
  if (!key) {
    throw new Error(`Invalid step number: ${step}`);
  }

  storedProfile = {
    ...storedProfile,
    [key]: data,
    updatedAt: new Date().toISOString(),
  };

  storedProfile.completionPercentage = calculateCompletion(storedProfile);
  storedProfile.isComplete = storedProfile.completionPercentage === 100;

  return { profile: { ...storedProfile } };
}

export async function completeProfile(): Promise<ProfileResponse> {
  await delay(PROFILE_MOCK_DELAY_MS);

  storedProfile = {
    ...storedProfile,
    isComplete: true,
    completionPercentage: 100,
    updatedAt: new Date().toISOString(),
  };

  return { profile: { ...storedProfile } };
}

export function resetMockProfile(): void {
  storedProfile = { ...EMPTY_PROFILE };
}
