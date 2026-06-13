import { API_BASE_URL } from '@/constants/env.constants';

export async function authenticatedFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
}
