# Auth Integration Design

**Date:** 2026-05-05  
**Scope:** Complete integration between the mobile app and the auth microservice

## Context

The auth microservice (port 3000, DB port 5436) is fully implemented and now seeded with the DietManager tenant (`a1b2c3d4-1234-4321-abcd-ef0123456789`). The mobile `auth.service.ts` and `useAuthStore` are implemented and correctly call the microservice. The gaps are token persistence and auto token refresh.

## Gap 1: Token Persistence

**Problem:** `useAuthStore` is pure in-memory. Every app restart logs the user out.

**Solution:** Add `expo-secure-store` + Zustand `persist` middleware with a SecureStore storage adapter.

- Install `expo-secure-store`
- Create a `createSecureStorage()` adapter in `mobile/stores/secureStorage.ts` that implements Zustand's `StateStorage` interface using `SecureStore.getItemAsync` / `setItemAsync` / `deleteItemAsync`
- Wrap `useAuthStore` with `persist(...)`, persisting only: `{ accessToken, refreshToken, user, isAuthenticated }`
- Transient fields (`isLoading`, `error`) remain in-memory only

On app boot Zustand rehydrates automatically before the first render. `useAuthGate` needs no changes.

## Gap 2: Auto Token Refresh

**Problem:** When the DietManager backend (port 3001) returns 401, nothing silently refreshes the access token. The user sees an error or stale data.

**Solution:** Create `mobile/api/authenticatedFetch.ts` — a thin wrapper around `fetch`:

1. Read `accessToken` from `useAuthStore.getState()`
2. Inject `Authorization: Bearer <token>` header
3. Execute the request
4. On 401 response → call `useAuthStore.getState().refreshTokens()` → retry the request once with the new token
5. On second 401 (refresh token expired/revoked) → call `useAuthStore.getState().logout()` and throw — `useAuthGate` redirects to login

Update `mobile/services/profile.service.ts` to use `authenticatedFetch` instead of raw `fetch`.

## What Does Not Change

- `mobile/services/auth.service.ts` — public endpoints, no auth header needed
- `useAuthStore` action logic — only persistence layer is added
- `useAuthGate` — no changes
- All screens and hooks — no changes
- ForgotPassword — remains a UI stub (auth microservice has no password reset endpoint)

## Files to Create / Modify

```
# Install
expo-secure-store

# Create
mobile/stores/secureStorage.ts          ← SecureStore adapter for Zustand persist
mobile/api/authenticatedFetch.ts        ← fetch wrapper with auto-refresh

# Modify
mobile/stores/useAuthStore.ts           ← wrap with persist middleware
mobile/services/profile.service.ts     ← replace raw fetch with authenticatedFetch
```
