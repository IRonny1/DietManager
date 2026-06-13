# Remove Auth — Single-User Setup

**Date:** 2026-06-13  
**Status:** Approved

## Context

DietManager is used by a single person. Multi-user authentication (JWT, login/register screens, token refresh) adds unnecessary complexity and is the source of network timeout issues when the auth server is unavailable. This spec removes all auth infrastructure and replaces it with a hardcoded single-user identity.

## Approach

Single-user middleware injection. A `SingleUserMiddleware` populates `request.user` on every request, keeping the `@CurrentUser()` decorator and all service method signatures unchanged. The mobile app routes directly to onboarding or tabs on launch.

---

## Backend Changes

### Single-user constants

New file: `server/src/common/constants/single-user.constants.ts`

```ts
export const SINGLE_USER_ID = '<fixed-uuid>';
export const SINGLE_TENANT_ID = 'a1b2c3d4-1234-4321-abcd-ef0123456789';
```

`SINGLE_TENANT_ID` matches the existing `EXPO_PUBLIC_TENANT_ID` value.

### SingleUserMiddleware

New file: `server/src/common/middleware/single-user.middleware.ts`

Implements `NestMiddleware`. Sets `req.user = { userId: SINGLE_USER_ID, tenantId: SINGLE_TENANT_ID }` then calls `next()`. Applied globally via `AppModule.configure(consumer)` to all routes.

### Controllers

Remove `@UseGuards(JwtAuthGuard)` and `@ApiBearerAuth()` from all 5 controllers:
- `DiaryController`
- `WaterController`
- `WeightController`
- `ProfileController`
- `ScanController`

`@CurrentUser()` decorator and all service call signatures stay untouched.

### AuthModule removal

Delete:
- `server/src/auth/auth.module.ts`
- `server/src/auth/guards/jwt-auth.guard.ts`
- `server/src/auth/strategies/jwt.strategy.ts`
- `server/src/common/types/jwt.types.ts`

Unregister `AuthModule` from `AppModule` imports. Remove `AuthModule` imports from `DiaryModule`, `WaterModule`, `WeightModule`, `ProfileModule`.

Uninstall: `@nestjs/passport`, `passport`, `passport-jwt`, `@types/passport-jwt`.

### DB seed

New file: `server/prisma/seed.ts`  
Upserts a `User` row with `id = SINGLE_USER_ID`, `externalAuthId = SINGLE_USER_ID`, `email = 'user@dietmanager.local'`. Run once with `npx prisma db seed` to satisfy FK constraints before first use.

Add seed config to `server/package.json`:
```json
"prisma": { "seed": "ts-node prisma/seed.ts" }
```

---

## Mobile Changes

### Files to delete

| File | Reason |
|------|--------|
| `mobile/app/(auth)/` | Entire route group — all auth screens |
| `mobile/app/logout-confirmation.tsx` | No longer applicable |
| `mobile/stores/useAuthStore.ts` | Replaced by no-op / removed |
| `mobile/stores/secureStorage.ts` | Only used by auth store |
| `mobile/services/auth.service.ts` | All auth API calls |
| `mobile/constants/auth.constants.ts` | Auth-only constants |
| `mobile/hooks/useAuthGate.ts` | Auth redirect logic |
| `mobile/types/auth.types.ts` | LoginRequest, RegisterRequest, AuthResponse, User |

### `authenticatedFetch` rewrite

`mobile/api/authenticatedFetch.ts` becomes a thin fetch wrapper:
- Prepends `API_BASE_URL` to the path
- Sets `Content-Type: application/json` when a body is present
- No token logic, no 401 retry, no auth store dependency

### `_layout.tsx` updates

- Remove `useAuthGate()` call
- Remove `(auth)` stack screen registration
- Change `initialRouteName` from `(auth)` to `(tabs)`
- Add inline redirect effect: if `!hasCompletedOnboarding` → `/(onboarding)/welcome`, else `/(tabs)`

### `useHome` hook

Remove `useAuthStore` import. The greeting name falls back to the existing `'Alex'` default permanently.

### Profile screen

Remove the "Log Out" button and any imports from `useAuthStore`.

### `mobile/.env` and `env.constants.ts`

Remove `EXPO_PUBLIC_AUTH_BASE_URL` and `EXPO_PUBLIC_TENANT_ID` — both are only needed by the deleted auth service.

---

## Data Flow After Change

```
App launch
  → _layout.tsx reads hasCompletedOnboarding from useProfileStore
  → false → (onboarding)/welcome
  → true  → (tabs)

API call (e.g. getTodayMeals)
  → authenticatedFetch('/api/diary/today')
  → fetch('http://<host>:3001/api/diary/today')
  → SingleUserMiddleware sets req.user = { userId, tenantId }
  → DiaryController.getTodayMeals(@CurrentUser() user)
  → DiaryService.getTodayMeals(user.userId)
```

---

## What Does Not Change

- All service files (`diary.service.ts`, `water.service.ts`, etc.)
- All `@CurrentUser()` decorator usages in controllers
- Onboarding flow and `useProfileStore`
- Profile, stats, history, water, weight screens
- Prisma schema (no schema migration needed)
