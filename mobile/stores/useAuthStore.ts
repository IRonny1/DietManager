import { create } from 'zustand';

import * as authService from '@/services/auth.service';
import type {
  AuthActions,
  AuthState,
  LoginRequest,
  RegisterRequest,
  User,
} from '@/types/auth.types';

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  login: async (data: LoginRequest): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const { accessToken, refreshToken } = await authService.login(data);
      const user = await authService.getMe(accessToken);
      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please try again.';
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  register: async (data: RegisterRequest): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const { accessToken, refreshToken } = await authService.register(data);
      const user = await authService.getMe(accessToken);
      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.';
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  logout: async (): Promise<void> => {
    const { refreshToken } = get();
    if (refreshToken !== null) {
      await authService.logout(refreshToken);
    }
    set(initialState);
  },

  refreshTokens: async (): Promise<void> => {
    const { refreshToken } = get();
    if (refreshToken === null) {
      throw new Error('No refresh token available.');
    }
    const tokens = await authService.refreshTokens(refreshToken);
    set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
  },

  clearError: (): void => {
    set({ error: null });
  },
}));

export function useUser(): User | null {
  return useAuthStore((state) => state.user);
}

export function useIsAuthenticated(): boolean {
  return useAuthStore((state) => state.isAuthenticated);
}

export function useAuthLoading(): boolean {
  return useAuthStore((state) => state.isLoading);
}

export function useAuthError(): string | null {
  return useAuthStore((state) => state.error);
}
