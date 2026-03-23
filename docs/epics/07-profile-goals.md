# Epic 07 — Profile & Goals

**Depends on:** Epic 01 (Design Foundation), Epic 02 (Auth & Onboarding)

## Goal

Redesign the Profile tab to match the Pencil design, and implement Edit Profile, Edit My Goals screens, and the Logout Confirmation modal.

## Design Reference (Pencil frames)

| Frame Name | ID |
|---|---|
| Profile | `88l2G` |
| Edit Profile | `avlrA` |
| Edit My Goals | `MlJrH` |
| Profile / Log Out Confirmation | `UhUyi` |

Use `mcp__pencil__get_screenshot({ filePath: "diet-manager.pen", nodeId: "<ID>" })` to view each frame.

## Profile Screen Redesign

The current `screens/Profile/Profile.tsx` shows the old Material card layout. Replace entirely with the Pencil design.

### Layout

```
Profile                  ← H1

┌────────────────────────────────┐
│  [SJ]  Sarah Johnson           │
│        sarah.johnson@email.com │
│        ✏ Edit Profile          │  ← link
└────────────────────────────────┘

My Goals              Edit →
┌──────────┬──────────┬──────────┐
│  2,100   │   Lose   │  Active  │
│ Cal Goal │  Weight  │ Lifestyle│
└──────────┴──────────┴──────────┘

┌────────────────────────────────┐
│ 💧 Water Tracking           → │
└────────────────────────────────┘
┌────────────────────────────────┐
│ ⚖  Weight Log               → │
└────────────────────────────────┘

┌────────────────────────────────┐
│ [→ Log Out]                    │  ← red/destructive
└────────────────────────────────┘

[Tab Bar]
```

### Profile Hook (`mobile/screens/Profile/hooks/useProfile.ts`)

Update (already exists) to match new data shape:

```typescript
function useProfile(): {
  user: User | null;
  profile: UserProfile | null;
  avatarInitials: string;     // e.g. "SJ" from "Sarah Johnson"
  calorieGoal: number;
  primaryGoal: string;        // display label e.g. "Lose Weight"
  activityLevel: string;      // display label e.g. "Active"
  handleEditProfile: () => void;
  handleEditGoals: () => void;
  handleWaterTracking: () => void;
  handleWeightLog: () => void;
  handleLogOut: () => void;   // opens logout confirmation modal
}
```

Remove the old 4-section expandable list (Body Info, Health & Allergies, etc.) — replaced by a simpler My Goals card + links.

## Edit Profile Screen

Create: `mobile/screens/EditProfile/EditProfile.tsx`
Create: `mobile/screens/EditProfile/hooks/useEditProfileForm.ts`
Create: `mobile/app/edit-profile.tsx`

### Layout

```
← Edit Profile          [Save]

First Name   [Sarah          ]
Last Name    [Johnson         ]
Email        [sarah@email.com ]

────── Body Info ───────────────────────
Date of Birth  [Jan 15, 1990  ]
Gender         [Female    ▾   ]
Height         [165 cm        ]
Weight         [72.4 kg       ]
```

Validation (reuse Zod schemas from onboarding hooks):
- Name: required, min 2 chars
- Email: required, valid format
- Height: 50–300 cm (or imperial equivalent)
- Weight: 20–500 kg (or imperial equivalent)

On save: update `useProfileStore`, show success toast.

## Edit My Goals Screen

Create: `mobile/screens/EditMyGoals/EditMyGoals.tsx`
Create: `mobile/screens/EditMyGoals/hooks/useEditMyGoalsForm.ts`
Create: `mobile/app/edit-my-goals.tsx`

### Layout

```
← Edit My Goals         [Save]

Daily Calorie Goal
[2,100          ]  kcal/day

Primary Goal
[Lose Weight]  [Gain Muscle]
[Maintain]     [Eat Healthier]  ← chip selector

Activity Level
[Sedentary]  [Lightly Active]
[Moderately] [Very Active]
[Extremely Active]              ← chip selector
```

Reuse `ChipSelector` component from existing codebase.

On save: update `useProfileStore`, recalculate calorie goal if activity/goal changed (call `calorieCalculator.service.ts` from Epic 02).

## Logout Confirmation Modal

Create: `mobile/modals/LogoutConfirmation/LogoutConfirmation.tsx`
Create: `mobile/app/logout-confirmation.tsx` ← modal route

### Layout

```
┌────────────────────────────┐
│  Log Out?                  │
│  Are you sure you want to  │
│  log out of DietManager?   │
│                            │
│  [Cancel]  [Log Out]       │  ← destructive red
└────────────────────────────┘
```

Presented as a centered modal overlay (not full screen). Use React Native Paper's `Dialog` or a custom modal.

On confirm: call `useAuthStore().logout()` → navigates to `/(auth)/welcome`.

## Navigation

Profile screen → Edit Profile: `router.push('/edit-profile')`
Profile screen → Edit My Goals: `router.push('/edit-my-goals')`
Profile screen → Water Tracking: `router.push('/water-tracking')`
Profile screen → Weight Log: `router.push('/weight-log')`
Profile screen → Log Out: show modal (either via `router.push('/logout-confirmation')` or local state)

## Files to Create / Modify

```
# Modify (redesign)
mobile/screens/Profile/Profile.tsx
mobile/screens/Profile/hooks/useProfile.ts

# Create - Edit Profile
mobile/screens/EditProfile/EditProfile.tsx
mobile/screens/EditProfile/hooks/useEditProfileForm.ts
mobile/app/edit-profile.tsx

# Create - Edit Goals
mobile/screens/EditMyGoals/EditMyGoals.tsx
mobile/screens/EditMyGoals/hooks/useEditMyGoalsForm.ts
mobile/app/edit-my-goals.tsx

# Create - Logout Modal
mobile/modals/LogoutConfirmation/LogoutConfirmation.tsx
mobile/app/logout-confirmation.tsx
```

## Tests to Suggest

- `useEditProfileForm.test.ts` — field validation, save logic
- `useEditMyGoalsForm.test.ts` — chip selection, calorie recalculation on save
- `useProfile.test.ts` — avatar initials generation, goal display labels

## Verification

1. Screenshot comparison: Pencil frames `88l2G`, `avlrA`, `MlJrH`, `UhUyi` vs app
2. Profile screen shows correct avatar initials, name, email, goals
3. "Edit Profile" saves changes and reflects them on Profile screen
4. "Edit My Goals" saves and updates calorie goal on Home dashboard
5. Logout modal appears → "Log Out" clears auth state → redirects to Welcome
6. Water Tracking and Weight Log links navigate correctly (even if those screens are stubs)
7. `npx tsc --noEmit` passes
