import { AUTH_BASE_URL, TENANT_ID } from '@/constants/env.constants';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/auth.types';

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json() as { message?: string };
    return typeof body.message === 'string' && body.message.length > 0
      ? body.message
      : fallback;
  } catch {
    return fallback;
  }
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: data.email, password: data.password, tenantId: TENANT_ID }),
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response, 'Login failed. Please try again.');
    throw new Error(message);
  }

  return response.json() as Promise<AuthResponse>;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: data.email, password: data.password, tenantId: TENANT_ID }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }
    const message = await parseErrorMessage(response, 'Registration failed. Please try again.');
    throw new Error(message);
  }

  return response.json() as Promise<AuthResponse>;
}

export async function refreshTokens(refreshToken: string): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response, 'Token refresh failed.');
    throw new Error(message);
  }

  return response.json() as Promise<AuthResponse>;
}

export async function logout(refreshToken: string): Promise<void> {
  try {
    await fetch(`${AUTH_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    // best-effort — ignore errors
  }
}

export async function getMe(accessToken: string): Promise<User> {
  const response = await fetch(`${AUTH_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response, 'Failed to fetch user profile.');
    throw new Error(message);
  }

  return response.json() as Promise<User>;
}
