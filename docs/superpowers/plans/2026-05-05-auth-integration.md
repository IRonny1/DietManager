# Auth Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist auth tokens across app restarts using SecureStore and add a fetch wrapper that auto-refreshes expired access tokens.

**Architecture:** Zustand `persist` middleware stores the auth state slice (`accessToken`, `refreshToken`, `user`, `isAuthenticated`) in `expo-secure-store` (device keychain/Keystore). A thin `authenticatedFetch` wrapper in `mobile/api/` injects the Bearer token on every DietManager-backend call and silently refreshes on 401.

**Tech Stack:** expo-secure-store, Zustand v5 `persist` + `createJSONStorage`, native fetch API.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `mobile/stores/secureStorage.ts` | Create | Zustand `StateStorage` adapter backed by `expo-secure-store` |
| `mobile/stores/useAuthStore.ts` | Modify | Wrap store with `persist` middleware |
| `mobile/api/authenticatedFetch.ts` | Create | fetch wrapper with Bearer injection + 401 auto-refresh |

---

## Task 1: Install expo-secure-store

**Files:**
- Modify: `mobile/package.json` (via npx expo install)

- [ ] **Step 1.1: Install the package**

```bash
cd mobile && npx expo install expo-secure-store
```

Expected output ends with something like:
```
+ expo-secure-store@...
```

- [ ] **Step 1.2: Verify it resolves**

```bash
node -e "require('expo-secure-store'); console.log('ok')"
```

Expected: `ok`

- [ ] **Step 1.3: Commit**

```bash
git add mobile/package.json mobile/package-lock.json
git commit -m "chore: install expo-secure-store"
```

---

## Task 2: Create SecureStore adapter for Zustand

**Files:**
- Create: `mobile/stores/secureStorage.ts`

- [ ] **Step 2.1: Create the file**

`mobile/stores/secureStorage.ts`:
```typescript
import * as SecureStore from 'expo-secure-store';
import type { StateStorage } from 'zustand/middleware';

export const secureStorage: StateStorage = {
  getItem: (name: string): Promise<string | null> =>
    SecureStore.getItemAsync(name),

  setItem: (name: string, value: string): Promise<void> =>
    SecureStore.setItemAsync(name, value),

  removeItem: (name: string): Promise<void> =>
    SecureStore.deleteItemAsync(name),
};
```

- [ ] **Step 2.2: Verify TypeScript compiles**

```bash
cd mobile && npx tsc --noEmit 2>&1 | grep -E "secureStorage|error" | head -20
```

Expected: no output (no errors).

- [ ] **Step 2.3: Commit**

```bash
git add mobile/stores/secureStorage.ts
git commit -m "feat: add SecureStore adapter for Zustand persist"
```

---

## Task 3: Persist auth state across app restarts

**Files:**
- Modify: `mobile/stores/useAuthStore.ts`

The current store uses `create<AuthStore>((set, get) => ...)`.  
Wrap it with `persist(...)` so the four auth fields survive app restarts.

- [ ] **Step 3.1: Update useAuthStore.ts**

Replace the entire file with:

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import * as authService from '@/services/auth.service';
import { secureStorage } from './secureStorage';
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

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
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
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

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
```

- [ ] **Step 3.2: Verify TypeScript compiles**

```bash
cd mobile && npx tsc --noEmit 2>&1 | grep -E "useAuthStore|error" | head -20
```

Expected: no output.

- [ ] **Step 3.3: Commit**

```bash
git add mobile/stores/useAuthStore.ts
git commit -m "feat: persist auth tokens in SecureStore across app restarts"
```

---

## Task 4: Create authenticatedFetch utility

**Files:**
- Create: `mobile/api/authenticatedFetch.ts`

This wrapper is the standard way to call the DietManager backend (port 3001). It is not used for auth-microservice calls (those are public endpoints in `auth.service.ts`).

- [ ] **Step 4.1: Create the api directory and file**

```bash
mkdir -p mobile/api
```

`mobile/api/authenticatedFetch.ts`:
```typescript
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
        'Content-Type': 'application/json',
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
    return makeRequest(newToken ?? '');
  } catch {
    await useAuthStore.getState().logout();
    throw new Error('Session expired. Please log in again.');
  }
}
```

- [ ] **Step 4.2: Verify TypeScript compiles**

```bash
cd mobile && npx tsc --noEmit 2>&1 | grep -E "authenticatedFetch|error" | head -20
```

Expected: no output.

- [ ] **Step 4.3: Commit**

```bash
git add mobile/api/authenticatedFetch.ts
git commit -m "feat: add authenticatedFetch with Bearer injection and 401 auto-refresh"
```

---

## Test Suggestions

> Per project conventions (CLAUDE.md), tests are suggested rather than implemented by the planner.

**`mobile/stores/secureStorage.test.ts`**
- Mock `expo-secure-store` methods; verify `getItem`, `setItem`, `removeItem` delegate to the correct SecureStore calls.

**`mobile/api/authenticatedFetch.test.ts`**
- Happy path: injects `Authorization: Bearer <token>` header.
- 401 path: calls `refreshTokens()`, retries with new token, returns retried response.
- Refresh failure path: calls `logout()` and throws `'Session expired. Please log in again.'`
- Verify it does NOT prepend `API_BASE_URL` for calls that pass a full URL (confirm behavior).

---

## Verification Checklist

- [ ] `npx tsc --noEmit` passes with 0 errors
- [ ] Register a new user → receive tokens → kill the app → reopen → `useAuthGate` sends directly to `/(tabs)` (not to login)
- [ ] Login → wait 15 minutes for access token to expire → make a backend call → tokens silently refresh, no error shown
- [ ] Auth microservice still responds: `curl -s http://localhost:3000/auth/login -X POST -H "Content-Type: application/json" -d '{"email":"test@dietmanager.com","password":"Test1234!","tenantId":"a1b2c3d4-1234-4321-abcd-ef0123456789"}'` returns `accessToken` + `refreshToken`
