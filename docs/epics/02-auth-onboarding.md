# Epic 02 — Auth & Onboarding Redesign

**Depends on:** Epic 01 (Design Foundation)

## Goal

Redesign the existing auth screens (Login, Register) to match the Pencil design exactly, add Forgot Password flow, and replace the current ProfileCompletion wizard with a proper onboarding flow that shows after first registration.

## Design Reference (Pencil frames)

| Frame Name | ID |
|---|---|
| Login | `hJehG` |
| Login / Error | `SDgFX` |
| Sign Up | `aEl5B` |
| Sign Up / Error | `VHfM3` |
| Forgot Password | `e6so7` |
| Forgot Password / Email Sent | `YLynG` |
| Onboarding 1 - Welcome | `g1vCy` |
| Onboarding 2 - Features | `qjY7y` |
| Onboarding 3 - Method | `J6KhR` |
| Onboarding 4a - Personal Data | `lYN1g` |
| Onboarding 4a2 - Activity & Goal | `zO0Iw` |
| Onboarding 4b - Manual Entry | `wk8D7` |
| Onboarding - Result Modal | `Oh9oq` |

Use `mcp__pencil__get_screenshot({ filePath: "diet-manager.pen", nodeId: "<ID>" })` to view each screen during implementation.

## Auth Screens Redesign

### Login (`screens/Login/Login.tsx`)

Current UI uses Material cards and generic inputs — replace with Pencil layout:

```
[DietManager logo + leaf icon, centered]
"Welcome back"        ← H1, bold
"Sign in to your account"  ← subtitle, gray

[Email input field]
[Password input field]

[Login button]  ← full-width, primary green

[Forgot password?]  ← centered link

───── (space) ─────

"Don't have an account? Sign Up"  ← centered, bottom
```

- Error state: red border on invalid field + error message below field
- No Google Sign-In button (not in Pencil design — remove it)
- Keep `useLoginForm()` hook — only update the JSX/styling

### Register / Sign Up (`screens/Register/Register.tsx`)

```
[DietManager logo, centered]
"Create account"      ← H1
"Start tracking your nutrition"

[First name input]
[Last name input]
[Email input]
[Password input]
[Confirm password input]

[Sign Up button]  ← full-width, primary green

"Already have an account? Log In"  ← centered, bottom
```

- Keep `useRegisterForm()` hook
- After successful registration → navigate to `/(onboarding)/welcome`

### Forgot Password (new screen)

Create: `screens/ForgotPassword/ForgotPassword.tsx`
Create: `screens/ForgotPassword/hooks/useForgotPasswordForm.ts`
Create: `app/(auth)/forgot-password.tsx`
Create: `app/(auth)/forgot-password-sent.tsx`

**Screen 1 — Forgot Password:**
```
← back button

"Forgot password?"   ← H1
"Enter your email and we'll send a reset link"

[Email input]

[Send Reset Email button]
```

**Screen 2 — Email Sent:**
```
[Success icon / illustration]
"Check your inbox"
"We sent a password reset link to user@example.com"

[Back to Login button]
```

Validation: email required + valid format (reuse Zod schema from login form).

## Onboarding Flow (new)

Replaces the existing ProfileCompletion wizard. Shown once after first registration. Stored in `useProfileStore` as `hasCompletedOnboarding: boolean`.

### Navigation

Add route group: `app/(onboarding)/`

```
app/(onboarding)/
  _layout.tsx          ← Stack navigator, no header
  welcome.tsx          → screens/Onboarding/Welcome/
  features.tsx         → screens/Onboarding/Features/
  method.tsx           → screens/Onboarding/Method/
  personal-data.tsx    → screens/Onboarding/PersonalData/
  activity-goal.tsx    → screens/Onboarding/ActivityGoal/
  manual-entry.tsx     → screens/Onboarding/ManualEntry/
  result.tsx           → screens/Onboarding/Result/
```

Update `useAuthGate.ts`:
- If `isAuthenticated && !hasCompletedOnboarding` → push to `/(onboarding)/welcome`
- If `isAuthenticated && hasCompletedOnboarding` → push to `/(tabs)`

### Screen 1 — Welcome (`screens/Onboarding/Welcome/`)

```
[DietManager logo]
"Track Calories with AI"  ← H1
"Simply snap a photo of your food and let AI do the counting"

• Instant food recognition
• Smart nutrition tracking
• Personalized goals

[progress dots: ● ○ ○ ○]

[Get Started button]
[Skip for now]  ← text link
```

### Screen 2 — Features (`screens/Onboarding/Features/`)

Highlight 3 key features with icons and short descriptions. Progress: ● ● ○ ○

### Screen 3 — Method (`screens/Onboarding/Method/`)

```
"How do you want to track?"

[AI Scan card]   ← recommended
  Camera icon
  "Snap a photo"
  "AI identifies food and nutrition"

[Manual Entry card]
  Edit icon
  "Type it in"
  "Search and add meals manually"

[progress dots: ● ● ● ○]
[Continue button]
```

Store selected method in `useProfileStore`.

### Screen 4a — Personal Data (`screens/Onboarding/PersonalData/`)

Reuse existing form logic from `useBasicBodyInfoForm()`:
- Date of birth
- Gender (chip selector)
- Measurement system toggle (metric/imperial)
- Height input
- Current weight
- Target weight

Progress: ● ● ● ●, [Continue button]

### Screen 4a2 — Activity & Goal (`screens/Onboarding/ActivityGoal/`)

Reuse `useGoalsForm()`:
- Activity level (chip selector)
- Primary goal (chip selector)

[Calculate My Plan button]

### Screen 4b — Manual Entry (`screens/Onboarding/ManualEntry/`)

For users who selected "Manual Entry" on Method screen. Simple calorie/macro goal input form.

### Result Modal (`screens/Onboarding/Result/`)

```
[Success illustration]
"You're all set!"
"Based on your profile:"

Calorie Goal: 2,100 kcal/day
Protein: 150g  |  Carbs: 220g  |  Fat: 70g

[Start Tracking button]  → navigates to /(tabs)
```

Calculated from profile data using a TDEE formula in `services/calorieCalculator.service.ts`.

## Calorie Calculator Service

Create: `mobile/services/calorieCalculator.service.ts`

```typescript
// Mifflin-St Jeor equation
function calculateBMR(weightKg, heightCm, age, gender): number

// Apply activity multiplier
function calculateTDEE(bmr, activityLevel): number

// Apply goal adjustment (-500 kcal for loss, +300 for gain, 0 for maintain)
function calculateCalorieGoal(tdee, primaryGoal): number

// Calculate macro split (40/30/30 protein/carbs/fat as default)
function calculateMacros(calorieGoal): { protein, carbs, fat }
```

## Key Implementation Notes

- Remove Google Sign-In buttons from Login and Register (not in Pencil design)
- Remove the existing `screens/Welcome/Welcome.tsx` screen — replaced by Onboarding flow
- The old `profile-completion` route can be deprecated once onboarding is complete
- Keep ALL existing form validation logic (React Hook Form + Zod) — only update styling
- All new screens follow the component pattern from CLAUDE.md

## Files to Create / Modify

```
# Modify
mobile/screens/Login/Login.tsx
mobile/screens/Register/Register.tsx
mobile/hooks/useAuthGate.ts
mobile/stores/useProfileStore.ts        ← add hasCompletedOnboarding field

# Create - Auth
mobile/screens/ForgotPassword/ForgotPassword.tsx
mobile/screens/ForgotPassword/hooks/useForgotPasswordForm.ts
mobile/app/(auth)/forgot-password.tsx
mobile/app/(auth)/forgot-password-sent.tsx

# Create - Onboarding
mobile/app/(onboarding)/_layout.tsx
mobile/app/(onboarding)/welcome.tsx
mobile/app/(onboarding)/features.tsx
mobile/app/(onboarding)/method.tsx
mobile/app/(onboarding)/personal-data.tsx
mobile/app/(onboarding)/activity-goal.tsx
mobile/app/(onboarding)/manual-entry.tsx
mobile/app/(onboarding)/result.tsx
mobile/screens/Onboarding/Welcome/Welcome.tsx
mobile/screens/Onboarding/Features/Features.tsx
mobile/screens/Onboarding/Method/Method.tsx
mobile/screens/Onboarding/PersonalData/PersonalData.tsx
mobile/screens/Onboarding/ActivityGoal/ActivityGoal.tsx
mobile/screens/Onboarding/ManualEntry/ManualEntry.tsx
mobile/screens/Onboarding/Result/Result.tsx

# Create - Services
mobile/services/calorieCalculator.service.ts
```

## Tests to Suggest

- `calorieCalculator.service.test.ts` — unit tests for BMR, TDEE, calorie goal, macro calculations
- `useForgotPasswordForm.test.ts` — form validation unit tests

## Verification

1. Take screenshots using Pencil MCP and compare with implemented screens side-by-side
2. Flow: Launch app → Register → automatically lands on Onboarding 1 → complete all steps → lands on Home
3. Flow: Launch app → Login → lands on Home (skips onboarding since `hasCompletedOnboarding = true`)
4. Flow: Login screen → "Forgot password?" → Forgot Password screen → Email Sent screen → Back to Login
5. `npx tsc --noEmit` passes
