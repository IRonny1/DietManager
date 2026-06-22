# Backend-Driven Onboarding Check — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the in-memory `hasCompletedOnboarding` Zustand flag (and its SecureStore patch) with `profile.isComplete` fetched from the backend — so onboarding is only shown once, even after reinstall or device change.

**Architecture:** On app start, the root layout fetches the profile from `GET /api/profile`. If `profile.isComplete` is true the user goes to `/(tabs)`; otherwise to `/(onboarding)/welcome`. At the end of onboarding the mobile calls `POST /api/profile/complete` (after saving goals data), which sets `isComplete = true` in Postgres. No local flag is needed.

**Tech stack:** React Native / Expo Router, Zustand, NestJS + Prisma (PostgreSQL). No new packages required. The backend already uses a single-user middleware that injects `userId` — no JWT auth needed for API calls.

---

## File Map

| File | Action | Why |
|------|--------|-----|
| `server/src/profile/profile.service.ts` | Modify | Remove the 100%-completion gate in `completeProfile()` — onboarding doesn't fill all 4 wizard steps |
| `mobile/services/profile.service.ts` | Modify | Add `saveGoalsStep()` for the correct `PUT /api/profile/step/goals` endpoint |
| `mobile/stores/useProfileStore.ts` | Modify | Remove old `hasCompletedOnboarding`/`isOnboardingChecked`/`initOnboarding`/`completeOnboarding`; add `isBootstrapDone` flag; update `loadProfile` to set it |
| `mobile/app/_layout.tsx` | Modify | Call `loadProfile()` on mount; gate routing on `isBootstrapDone + profile?.isComplete` |
| `mobile/screens/Onboarding/Result/Result.tsx` | Modify | Save goals to backend, call `completeProfile()`, then navigate — replacing the removed store action |

---

## Task 1: Backend — Allow `completeProfile` without 100 % fill

**Files:**
- Modify: `server/src/profile/profile.service.ts:63-82`

**Context:** `completeProfile()` currently throws `ProfileIncompleteException` unless all four wizard steps are 100 % filled. The new onboarding only collects personalData + activityGoal (2 of 4 steps), so calling `POST /api/profile/complete` from the onboarding would always fail.

- [ ] **Step 1: Remove the percentage gate**

Replace the body of `completeProfile()` with:

```typescript
async completeProfile(
  userId: string,
  tenantId: string,
): Promise<ProfileResponse> {
  const profile = await this.prisma.userProfile.upsert({
    where: { userId },
    create: { userId, tenantId, isComplete: true },
    update: { isComplete: true },
  });

  return { profile: this.toProfileResponse(profile) };
}
```

The full method after editing (lines 63–82 of `profile.service.ts`):

```typescript
async completeProfile(
  userId: string,
  tenantId: string,
): Promise<ProfileResponse> {
  const profile = await this.prisma.userProfile.upsert({
    where: { userId },
    create: { userId, tenantId, isComplete: true },
    update: { isComplete: true },
  });

  return { profile: this.toProfileResponse(profile) };
}
```

- [ ] **Step 2: Verify the server still compiles**

```bash
cd server && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add server/src/profile/profile.service.ts
git commit -m "fix(server): allow completeProfile without requiring 100% wizard fill"
```

---

## Task 2: Mobile service — add `saveGoalsStep`

**Files:**
- Modify: `mobile/services/profile.service.ts`

**Context:** The existing `saveProfileStep()` in this file sends `POST /api/profile/step` with `{ step: number, data }`, but the backend expects `PUT /api/profile/step/:stepName`. We need a correctly-typed call to save the `goals` step from the onboarding completion screen.

- [ ] **Step 1: Add `saveGoalsStep` function**

Append to `mobile/services/profile.service.ts`:

```typescript
export type GoalsStepPayload = {
  activityLevel: string;
  primaryGoal: string;
};

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
```

- [ ] **Step 2: Verify the mobile TypeScript compiles**

```bash
cd mobile && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add mobile/services/profile.service.ts
git commit -m "feat(mobile): add saveGoalsStep service function with correct PUT endpoint"
```

---

## Task 3: Mobile store — revert local-storage fix, add `isBootstrapDone`

**Files:**
- Modify: `mobile/stores/useProfileStore.ts`

**Context:** A previous patch added `hasCompletedOnboarding`, `isOnboardingChecked`, `initOnboarding`, and `completeOnboarding` (with SecureStore persistence). Those are being replaced by backend-driven routing. We also need an `isBootstrapDone` flag so the root layout waits until the first profile fetch completes before making any routing decisions.

- [ ] **Step 1: Remove the SecureStore import and key constant**

Delete these lines at the top of `useProfileStore.ts`:
```typescript
import * as SecureStore from 'expo-secure-store';
// ...
const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';
```

- [ ] **Step 2: Remove old fields from `ProfileState`**

Remove from the `ProfileState` type:
- `hasCompletedOnboarding: boolean;`
- `isOnboardingChecked: boolean;`

Add in their place:
```typescript
isBootstrapDone: boolean;
```

- [ ] **Step 3: Remove old actions from `ProfileActions`**

Remove from the `ProfileActions` type:
- `initOnboarding: () => Promise<void>;`
- `completeOnboarding: () => Promise<void>;`

- [ ] **Step 4: Update `initialState`**

Remove:
```typescript
hasCompletedOnboarding: false,
isOnboardingChecked: false,
```

Add:
```typescript
isBootstrapDone: false,
```

- [ ] **Step 5: Update `loadProfile` to set `isBootstrapDone`**

In the existing `loadProfile` action, add `isBootstrapDone: true` to BOTH the `set()` call in the success branch AND the `set()` call in the catch branch:

Success branch (replace):
```typescript
set({ profile, currentStep: resumeStep, isLoading: false, isBootstrapDone: true });
```

Catch branch (replace):
```typescript
set({ isLoading: false, error: message, isBootstrapDone: true });
```

- [ ] **Step 6: Remove the old `initOnboarding` and `completeOnboarding` implementations**

Delete the two action implementations:
```typescript
initOnboarding: async (): Promise<void> => { ... },
completeOnboarding: async (): Promise<void> => { ... },
```

- [ ] **Step 7: Remove old exported selectors and replace with `useIsBootstrapDone`**

Delete:
```typescript
export const useHasCompletedOnboarding = (): boolean =>
  useProfileStore((s) => s.hasCompletedOnboarding);

export const useIsOnboardingChecked = (): boolean =>
  useProfileStore((s) => s.isOnboardingChecked);
```

Add:
```typescript
export const useIsBootstrapDone = (): boolean =>
  useProfileStore((s) => s.isBootstrapDone);
```

- [ ] **Step 8: Verify TypeScript compiles**

```bash
cd mobile && npx tsc --noEmit
```

Expected: errors only from files that still reference the removed exports (`_layout.tsx`, `Result.tsx`) — those are fixed in the next tasks.

- [ ] **Step 9: Commit**

```bash
git add mobile/stores/useProfileStore.ts
git commit -m "refactor(mobile): replace local onboarding flag with isBootstrapDone for backend-driven routing"
```

---

## Task 4: Mobile routing — update `_layout.tsx`

**Files:**
- Modify: `mobile/app/_layout.tsx`

**Context:** The current layout imports the removed `useHasCompletedOnboarding` and `useIsOnboardingChecked`. It needs to call `loadProfile()` on mount and route based on `profile?.isComplete` (backend source of truth).

- [ ] **Step 1: Update imports**

Replace:
```typescript
import { useHasCompletedOnboarding, useIsOnboardingChecked, useProfileStore } from '@/stores/useProfileStore';
```
With:
```typescript
import { useIsBootstrapDone, useProfileStore } from '@/stores/useProfileStore';
```

- [ ] **Step 2: Update `RootLayoutNav`**

Replace the entire `RootLayoutNav` function body with:

```typescript
function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const isBootstrapDone = useIsBootstrapDone();
  const profile = useProfileStore((s) => s.profile);
  const loadProfile = useProfileStore((s) => s.loadProfile);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!isBootstrapDone) return;

    const inOnboardingGroup = segments[0] === '(onboarding)';
    const isComplete = profile?.isComplete ?? false;

    if (!isComplete && !inOnboardingGroup) {
      router.replace('/(onboarding)/welcome');
    } else if (isComplete && inOnboardingGroup) {
      router.replace('/(tabs)');
    }
  }, [isBootstrapDone, profile, segments, router]);

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="profile-completion"
            options={{ headerShown: false, animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="scan-result"
            options={{ title: 'Scan Result', headerBackTitle: 'Scan' }}
          />
          <Stack.Screen
            name="edit-meal"
            options={{ title: 'Edit Meal', headerBackTitle: 'Back' }}
          />
          <Stack.Screen
            name="date-range-picker"
            options={{ title: 'Select Date Range', presentation: 'modal', headerBackTitle: 'Back' }}
          />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen
            name="edit-profile"
            options={{ title: 'Edit Profile', headerShown: false }}
          />
          <Stack.Screen
            name="edit-my-goals"
            options={{ title: 'Edit My Goals', headerShown: false }}
          />
          <Stack.Screen name="water-tracking" options={{ title: 'Water Tracking' }} />
          <Stack.Screen name="weight-log" options={{ title: 'Weight Log' }} />
          <Stack.Screen
            name="log-custom-amount"
            options={{ title: 'Log Custom Amount', presentation: 'modal', headerBackTitle: 'Back' }}
          />
          <Stack.Screen
            name="log-weight"
            options={{ title: 'Log Weight', presentation: 'modal', headerBackTitle: 'Back' }}
          />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd mobile && npx tsc --noEmit
```

Expected: remaining error only in `Result.tsx` (the removed store action). Fixed next.

- [ ] **Step 4: Commit**

```bash
git add mobile/app/_layout.tsx
git commit -m "feat(mobile): route on app start using backend profile.isComplete"
```

---

## Task 5: Mobile — update `Result.tsx` to persist onboarding to backend

**Files:**
- Modify: `mobile/screens/Onboarding/Result/Result.tsx`

**Context:** The `Result` screen currently calls the removed `completeOnboarding()` store action. It should now:
1. Save the `activityGoal` data to the backend via `saveGoalsStep()`.
2. Call `completeProfile()` from the profile service to set `isComplete = true` in Postgres.
3. Navigate to `/(tabs)`.

The personal data (age, gender, weight, height) is not saved at this stage because the backend's `basicBodyInfo` step requires `dateOfBirth` and `targetWeightKg` which the current onboarding doesn't collect. Saving goals is enough to mark completion.

- [ ] **Step 1: Update imports**

Replace:
```typescript
import { useProfileStore } from '../../../stores/useProfileStore';
```
With:
```typescript
import { useProfileStore } from '../../../stores/useProfileStore';
import { saveGoalsStep, completeProfile } from '../../../services/profile.service';
```

- [ ] **Step 2: Remove `completeOnboarding` from the component**

Delete this line:
```typescript
const completeOnboarding = useProfileStore((s) => s.completeOnboarding);
```

- [ ] **Step 3: Update `onLooksGood`**

Replace:
```typescript
async function onLooksGood(): Promise<void> {
  await completeOnboarding();
  router.replace('/(tabs)');
}
```

With:

```typescript
const [isSaving, setIsSaving] = useState(false);

async function onLooksGood(): Promise<void> {
  if (isSaving) return;
  setIsSaving(true);
  try {
    const activityGoal = onboardingData.activityGoal;
    if (activityGoal) {
      await saveGoalsStep({
        activityLevel: activityGoal.activityLevel,
        primaryGoal: activityGoal.primaryGoal,
      });
    }
    await completeProfile();
    router.replace('/(tabs)');
  } catch {
    setIsSaving(false);
  }
}
```

- [ ] **Step 4: Add `useState` to the React import**

Ensure `useState` is imported:
```typescript
import React, { useState } from 'react';
```

- [ ] **Step 5: Disable the button while saving**

Update the `Button` component's `disabled` and `loading` props:
```tsx
<Button
  mode="contained"
  buttonColor={Colors.primary}
  style={styles.btn}
  contentStyle={styles.btnContent}
  onPress={onLooksGood}
  disabled={isSaving}
  loading={isSaving}
>
  Looks good!
</Button>
```

- [ ] **Step 6: Verify TypeScript compiles with no errors**

```bash
cd mobile && npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 7: Commit**

```bash
git add mobile/screens/Onboarding/Result/Result.tsx
git commit -m "feat(mobile): persist onboarding completion to backend via profile API"
```

---

## Verification

After all tasks are done:

1. Start the backend: `cd server && npm run start:dev`
2. Start the mobile app: `cd mobile && npx expo start`
3. **First launch:** App should show onboarding (profile not yet complete on backend).
4. **Complete onboarding** through to the Result screen → tap "Looks good!" → should land on `/(tabs)/`.
5. **Restart the app.** App should go directly to `/(tabs)/` — onboarding is NOT shown again because `profile.isComplete = true` in Postgres.
6. **Verify in Prisma Studio** that the profile row has `isComplete = true` and `activityLevel` / `primaryGoal` are set:
   ```bash
   cd server && npx prisma studio
   ```

## Known Limitation

The calorie goal (`onboardingData.calorieGoal`) is still only kept in Zustand memory. After an app restart, the Home screen falls back to the default 2000 kcal. Persisting calorie goal requires either adding a `calorieGoal` column to `UserProfile` and returning it from `GET /api/profile`, or recalculating it on the fly from `profile.goals` + personalData. That is tracked as a follow-up, not part of this fix.
