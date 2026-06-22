import { authenticatedFetch } from '@/api/authenticatedFetch';
import type {
  GoalsStepPayload,
  ProfileResponse,
  ProfileStepData,
} from '@/types/profile.types';

export async function getProfile(): Promise<ProfileResponse> {
  const response = await authenticatedFetch('/api/profile');

  if (!response.ok) {
    throw new Error(`Failed to fetch profile: ${response.status}`);
  }

  return response.json() as Promise<ProfileResponse>;
}

export async function saveProfileStep(
  step: number,
  data: ProfileStepData,
): Promise<ProfileResponse> {
  const response = await authenticatedFetch('/api/profile/step', {
    method: 'POST',
    body: JSON.stringify({ step, data }),
  });

  if (!response.ok) {
    throw new Error(`Failed to save profile step: ${response.status}`);
  }

  return response.json() as Promise<ProfileResponse>;
}

export async function completeProfile(): Promise<ProfileResponse> {
  const response = await authenticatedFetch('/api/profile/complete', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Failed to complete profile: ${response.status}`);
  }

  return response.json() as Promise<ProfileResponse>;
}

export async function saveGoalsStep(
  payload: GoalsStepPayload,
): Promise<ProfileResponse> {
  const response = await authenticatedFetch('/api/profile/step/goals', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to save goals step: ${response.status}`);
  }

  return response.json() as Promise<ProfileResponse>;
}
