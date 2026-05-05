import { API_BASE_URL } from '@/constants/env.constants';
import { useAuthStore } from '@/stores/useAuthStore';

export async function authenticatedFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const makeRequest = (token: string): Promise<Response> =>
    fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

  const { accessToken } = useAuthStore.getState();
  const response = await makeRequest(accessToken ?? '');

  if (response.status !== 401) {
    return response;
  }

  try {
    await useAuthStore.getState().refreshTokens();
    const { accessToken: newToken } = useAuthStore.getState();
    const retryResponse = await makeRequest(newToken ?? '');
    if (retryResponse.status === 401) {
      await useAuthStore.getState().logout();
      throw new Error('Session expired. Please log in again.');
    }
    return retryResponse;
  } catch (err) {
    if (err instanceof Error && err.message === 'Session expired. Please log in again.') {
      throw err;
    }
    await useAuthStore.getState().logout();
    throw new Error('Session expired. Please log in again.');
  }
}
