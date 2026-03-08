import {
  MOCK_DELAY_MS,
  MOCK_ERROR_EMAIL,
  MOCK_EXISTING_EMAIL,
  MOCK_TOKEN,
  MOCK_USER,
} from '@/constants/auth.constants';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '@/types/auth.types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  await delay(MOCK_DELAY_MS);

  if (data.email.toLowerCase() === MOCK_ERROR_EMAIL) {
    throw new Error('Invalid email or password. Please try again.');
  }

  return {
    user: {
      ...MOCK_USER,
      email: data.email,
      firstName: 'John',
      lastName: 'Doe',
    },
    token: MOCK_TOKEN,
  };
}

export async function register(
  data: RegisterRequest,
): Promise<AuthResponse> {
  await delay(MOCK_DELAY_MS);

  if (data.email.toLowerCase() === MOCK_EXISTING_EMAIL) {
    throw new Error(
      'An account with this email already exists. Please sign in instead.',
    );
  }

  return {
    user: {
      ...MOCK_USER,
      id: `mock-user-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    },
    token: MOCK_TOKEN,
  };
}
