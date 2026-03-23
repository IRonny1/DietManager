# Auth & Onboarding Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign auth screens to match Pencil design, add Forgot Password flow, and replace the ProfileCompletion wizard with a new onboarding flow shown once after first registration.

**Architecture:** Auth screens are updated in-place (keep hooks, replace JSX/styling). A new `(onboarding)` Expo Router group is created parallel to `(auth)` and `(tabs)`. `useAuthGate` gates access based on `hasCompletedOnboarding` in `useProfileStore`. A pure `calorieCalculator.service.ts` computes the TDEE goal.

**Tech Stack:** React Native + Expo Router, React Native Paper, React Hook Form + Zod, Zustand, TypeScript

---

## Design Reference (Pencil frames)

| Screen | Frame ID | Key observations |
|---|---|---|
| Login | `hJehG` | Logo circle+leaf, "Welcome back", email/password inputs, green Login btn, "Forgot password?" link, "Don't have an account? Sign Up" |
| Register | `aEl5B` | Single "Full Name" field (not first/last), email/password/confirm, "Create Account" btn |
| Forgot Password | `e6so7` | Back btn top-left, horizontal logo+name, email input, "Send Reset Link" btn, "Back to Login" link |
| Email Sent | `YLynG` | Envelope icon in gray circle, "Check your email", "Open Email App" btn, "Resend link", "Back to Login" |
| Onboarding 1 | `g1vCy` | Horizontal logo, illustration box (green bg), features list, 4 progress dots (1st), "Get Started", "Skip for now" |
| Onboarding 2 | `qjY7y` | Back btn, calorie ring illustration, features list, 4 dots (2nd), "Continue" |
| Onboarding 3 | `J6KhR` | "Set Your Daily Goal", radio cards: "Calculate for me" / "Enter manually", 4 dots (3rd), "Next" |
| Onboarding 4a | `lYN1g` | "Step 1 of 2" progress bar, Age/Gender chips/Weight+toggle/Height+toggle, "Continue" |
| Onboarding 4a2 | `zO0Iw` | "Step 2 of 2", activity radio list, goal radio list (Lose/Maintain/Gain), "Calculate My Goal" |
| Onboarding 4b | `wk8D7` | Back, large number +/- stepper, "Set Goal" btn, "Calculate for me instead" outline btn |
| Result Modal | `Oh9oq` | Bottom sheet, green check, "Your Daily Goal", "X kcal/day", "Looks good!" btn, "Adjust" link |

> All Pencil designs override spec text where they conflict.

---

## File Map

```
# Modify
mobile/constants/Colors.ts                        — add named `Colors` export as alias for `palette`
mobile/types/auth.types.ts                        — update RegisterFormValues to use fullName
mobile/services/auth.service.ts                   — no change needed (RegisterRequest keeps firstName/lastName)
mobile/screens/Login/Login.tsx                    — Pencil layout, remove Google btn
mobile/screens/Login/components/LoginForm.tsx     — update styling to match design
mobile/screens/Register/Register.tsx              — Pencil layout, remove Google btn
mobile/screens/Register/components/RegisterForm.tsx — single Full Name field, keep password toggles
mobile/screens/Register/hooks/useRegisterForm.ts  — use fullName field, keep password visibility state
mobile/stores/useProfileStore.ts                  — add hasCompletedOnboarding + onboardingData
mobile/hooks/useAuthGate.ts                       — add onboarding gate logic
mobile/app/_layout.tsx                            — add (onboarding) Stack.Screen entry
mobile/app/(auth)/_layout.tsx                     — add forgot-password routes

# Create — Auth
mobile/screens/ForgotPassword/ForgotPassword.tsx
mobile/screens/ForgotPassword/components/ForgotPasswordForm.tsx
mobile/screens/ForgotPassword/ForgotPasswordSent.tsx
mobile/screens/ForgotPassword/hooks/useForgotPasswordForm.ts
mobile/app/(auth)/forgot-password.tsx
mobile/app/(auth)/forgot-password-sent.tsx

# Create — Types
mobile/types/onboarding.types.ts                  — OnboardingData, GoalMethod, PersonalData, etc.

# Create — Services
mobile/services/calorieCalculator.service.ts

# Create — Shared Onboarding components
mobile/screens/Onboarding/components/OnboardingProgressDots.tsx
mobile/screens/Onboarding/components/OnboardingLayout.tsx

# Create — Onboarding Screens
mobile/screens/Onboarding/Welcome/Welcome.tsx
mobile/screens/Onboarding/Features/Features.tsx
mobile/screens/Onboarding/Method/Method.tsx
mobile/screens/Onboarding/Method/hooks/useMethodForm.ts
mobile/screens/Onboarding/PersonalData/PersonalData.tsx
mobile/screens/Onboarding/PersonalData/hooks/usePersonalDataForm.ts
mobile/screens/Onboarding/ActivityGoal/ActivityGoal.tsx
mobile/screens/Onboarding/ActivityGoal/hooks/useActivityGoalForm.ts
mobile/screens/Onboarding/ManualEntry/ManualEntry.tsx
mobile/screens/Onboarding/ManualEntry/hooks/useManualEntryForm.ts
mobile/screens/Onboarding/Result/Result.tsx

# Create — Onboarding Routes
mobile/app/(onboarding)/_layout.tsx
mobile/app/(onboarding)/welcome.tsx
mobile/app/(onboarding)/features.tsx
mobile/app/(onboarding)/method.tsx
mobile/app/(onboarding)/personal-data.tsx
mobile/app/(onboarding)/activity-goal.tsx
mobile/app/(onboarding)/manual-entry.tsx
mobile/app/(onboarding)/result.tsx
```

---

## Task 0: Export Named `Colors` Alias from Colors.ts

**Files:**
- Modify: `mobile/constants/Colors.ts`

`Colors.ts` currently exports `palette` (flat named export) and the default `Colors` (nested `{light, dark}`). All new screen code imports `{ Colors }` expecting the flat palette. Fix this by adding a named export alias.

- [ ] **Step 1: Add named export at end of Colors.ts**

```typescript
// Add after the existing code:
/** Named export alias for `palette` — use this in component/screen imports */
export const Colors = palette;
```

This shadows the existing `const Colors` (which is only the default export) with a named export. TypeScript will complain if both exist in the same scope — so rename the default-exported object to `ColorSchemes` first:

```typescript
// Rename the internal variable
const ColorSchemes = {
  light: { ... },
  dark: { ... },
} as const;

export default ColorSchemes;

// New named export used by all screens
export const Colors = palette;
```

- [ ] **Step 2: Verify existing usages of `import Colors from '...'` (default import) still compile**

```bash
cd mobile && grep -r "import Colors" --include="*.ts" --include="*.tsx" -l
```

For any file using `import Colors from '...'` (default import), verify it accesses `Colors.light` or `Colors.dark` — those still work via `ColorSchemes`. Any file using named import `import { Colors }` now gets the flat palette.

- [ ] **Step 3: TypeScript check**
```bash
cd mobile && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 4: Commit**
```bash
git add mobile/constants/Colors.ts
git commit -m "fix: export named Colors alias for palette to simplify screen imports"
```

---

## Task 1: Onboarding Types

**Files:**
- Create: `mobile/types/onboarding.types.ts`

- [ ] **Step 1: Create the types file**

```typescript
// mobile/types/onboarding.types.ts
export type GoalMethod = 'calculate' | 'manual';

export type Gender = 'male' | 'female' | 'other';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extremely_active';

export type PrimaryGoal = 'lose_weight' | 'maintain_weight' | 'gain_weight';

export interface PersonalData {
  age: number;
  gender: Gender;
  weightKg: number;
  heightCm: number;
}

export interface ActivityGoalData {
  activityLevel: ActivityLevel;
  primaryGoal: PrimaryGoal;
}

export interface OnboardingData {
  goalMethod: GoalMethod | null;
  personalData: PersonalData | null;
  activityGoal: ActivityGoalData | null;
  calorieGoal: number | null;       // final computed or entered goal
}
```

- [ ] **Step 2: Commit**
```bash
git add mobile/types/onboarding.types.ts
git commit -m "feat: add onboarding types"
```

---

## Task 2: Calorie Calculator Service

**Files:**
- Create: `mobile/services/calorieCalculator.service.ts`

- [ ] **Step 1: Create the service**

```typescript
// mobile/services/calorieCalculator.service.ts
import { ActivityLevel, Gender, PrimaryGoal } from '../types/onboarding.types';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extremely_active: 1.9,
};

const GOAL_ADJUSTMENTS: Record<PrimaryGoal, number> = {
  lose_weight: -500,
  maintain_weight: 0,
  gain_weight: 300,
};

export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') return base + 5;
  if (gender === 'female') return base - 161;
  // 'other': use average of male/female formulas
  return base - 78;
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

export function calculateCalorieGoal(tdee: number, primaryGoal: PrimaryGoal): number {
  return Math.max(1200, tdee + GOAL_ADJUSTMENTS[primaryGoal]);
}
```

- [ ] **Step 2: Commit**
```bash
git add mobile/services/calorieCalculator.service.ts
git commit -m "feat: add calorie calculator service"
```

---

## Task 3: Update useProfileStore (add onboarding fields)

**Files:**
- Modify: `mobile/stores/useProfileStore.ts`

- [ ] **Step 1: Read the current store**

Read `mobile/stores/useProfileStore.ts` to understand exact state shape.

- [ ] **Step 2: Add hasCompletedOnboarding and onboardingData to state + actions**

Add to the state interface:
```typescript
hasCompletedOnboarding: boolean;
onboardingData: OnboardingData;
```

Add initial values:
```typescript
hasCompletedOnboarding: false,
onboardingData: {
  goalMethod: null,
  personalData: null,
  activityGoal: null,
  calorieGoal: null,
},
```

Add actions:
```typescript
setOnboardingData: (partial: Partial<OnboardingData>) => void;
completeOnboarding: () => void;
```

Implement actions:
```typescript
setOnboardingData: (partial) =>
  set((s) => ({
    onboardingData: { ...s.onboardingData, ...partial },
  })),
completeOnboarding: () =>
  set({ hasCompletedOnboarding: true }),
```

Add selectors at bottom of file:
```typescript
export const useHasCompletedOnboarding = () =>
  useProfileStore((s) => s.hasCompletedOnboarding);
export const useOnboardingData = () =>
  useProfileStore((s) => s.onboardingData);
```

- [ ] **Step 3: Verify TypeScript**
```bash
cd mobile && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 4: Commit**
```bash
git add mobile/stores/useProfileStore.ts
git commit -m "feat: add hasCompletedOnboarding and onboardingData to profile store"
```

---

## Task 4: Update useAuthGate

**Files:**
- Modify: `mobile/hooks/useAuthGate.ts`

- [ ] **Step 1: Read current useAuthGate.ts**

- [ ] **Step 2: Update gate logic**

Replace the routing logic with:
```typescript
import { useHasCompletedOnboarding } from '../stores/useProfileStore';

export function useAuthGate(): void {
  const isAuthenticated = useIsAuthenticated();
  const hasCompletedOnboarding = useHasCompletedOnboarding();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!isAuthenticated) {
      if (!inAuthGroup) router.replace('/(auth)/welcome');
      return;
    }

    // authenticated
    if (inAuthGroup) {
      if (!hasCompletedOnboarding) {
        router.replace('/(onboarding)/welcome');
      } else {
        router.replace('/(tabs)');
      }
      return;
    }

    if (!hasCompletedOnboarding && !inOnboardingGroup) {
      router.replace('/(onboarding)/welcome');
    } else if (hasCompletedOnboarding && (inOnboardingGroup || inAuthGroup)) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, hasCompletedOnboarding, segments, router]);
}
```

- [ ] **Step 3: Verify TypeScript**
```bash
cd mobile && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 4: Commit**
```bash
git add mobile/hooks/useAuthGate.ts
git commit -m "feat: update useAuthGate to handle onboarding gate"
```

---

## Task 5: Update Auth Types + Register Service (Full Name)

**Files:**
- Modify: `mobile/types/auth.types.ts`
- Modify: `mobile/services/auth.service.ts`

- [ ] **Step 1: Read both files**

- [ ] **Step 2: Update RegisterFormValues in auth.types.ts**

Replace `firstName: string; lastName: string;` with `fullName: string;` in `RegisterFormValues`.
Update `RegisterRequest` the same way (or keep firstName/lastName in RegisterRequest and split in the service — see step 3).

Actually keep `RegisterRequest` with `firstName` and `lastName` since it matches the backend contract. Only `RegisterFormValues` gets `fullName`.

```typescript
export interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

- [ ] **Step 3: Update auth.service.ts mock register**

Split fullName before calling the mock:
```typescript
// In the register mock function, extract firstName/lastName from fullName
const nameParts = data.firstName.split(' ');  // firstName field carries fullName
// But better: accept fullName in the service layer
```

Actually the cleanest approach: add `fullName?: string` to `RegisterRequest`, and in the store's `register` action, split fullName before calling the service. Update `useRegisterForm` to produce a `RegisterRequest` with `firstName` and `lastName` split from `fullName`.

In `useRegisterForm.ts` `onSubmit`:
```typescript
const [firstName, ...rest] = data.fullName.trim().split(' ');
const lastName = rest.join(' ') || '';
await authStore.register({ firstName, lastName, email: data.email, password: data.password });
```

This keeps `RegisterRequest` unchanged and the split happens in the hook.

- [ ] **Step 4: Update useRegisterForm.ts**

Read `mobile/screens/Register/hooks/useRegisterForm.ts`.

Replace the Zod schema fields:
```typescript
const schema = z.object({
  fullName: z.string().min(1, 'Full name is required').trim(),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[0-9]/, 'Must include a number')
    .regex(/[^A-Za-z0-9]/, 'Must include a special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
```

Update `onSubmit` to split fullName (see above).

- [ ] **Step 5: Verify TypeScript**
```bash
cd mobile && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 6: Commit**
```bash
git add mobile/types/auth.types.ts mobile/services/auth.service.ts mobile/screens/Register/hooks/useRegisterForm.ts
git commit -m "feat: update register form to use single Full Name field (matches Pencil design)"
```

---

## Task 6: Redesign Login Screen

**Files:**
- Modify: `mobile/screens/Login/Login.tsx`
- Modify: `mobile/screens/Login/components/LoginForm.tsx`

Design reference: frame `hJehG`

- [ ] **Step 1: Read both files**

- [ ] **Step 2: Rewrite Login.tsx**

```tsx
// mobile/screens/Login/Login.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginForm from './components/LoginForm';
import { useLoginForm } from './hooks/useLoginForm';
import { Colors } from '../../constants/Colors';
import { SPACING } from '../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../constants/typography.constants';
import AppLogo from '../../components/AppLogo';

export default function Login(): React.JSX.Element {
  const router = useRouter();
  const formProps = useLoginForm();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <AppLogo style={styles.logo} />

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <LoginForm {...formProps} />

        <TouchableOpacity
          style={styles.forgotBtn}
          onPress={() => router.push('/(auth)/forgot-password')}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />

        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.registerText}>
            Don't have an account?{' '}
            <Text style={styles.registerLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  container: { flexGrow: 1, paddingHorizontal: SPACING.LG, paddingTop: SPACING.XL, paddingBottom: SPACING.XL },
  logo: { alignSelf: 'center', marginBottom: SPACING.XL },
  title: { fontSize: FONT_SIZE.XXL, fontWeight: FONT_WEIGHT.BOLD, color: Colors.textPrimary, marginBottom: SPACING.XS },
  subtitle: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary, marginBottom: SPACING.XL },
  forgotBtn: { alignSelf: 'center', marginTop: SPACING.MD },
  forgotText: { fontSize: FONT_SIZE.MD, color: Colors.primary },
  spacer: { flex: 1, minHeight: SPACING.XL },
  registerText: { textAlign: 'center', fontSize: FONT_SIZE.MD, color: Colors.textSecondary },
  registerLink: { color: Colors.primary, fontWeight: FONT_WEIGHT.SEMIBOLD },
});
```

> **Note:** `AppLogo` is a shared component to create in Task 7. It renders the green circle with leaf + "DietManager" text below.

- [ ] **Step 3: Update LoginForm.tsx styling**

Keep all form logic. Update inputs to use `mode="outlined"` with `activeOutlineColor={Colors.primary}`. Remove any Google Sign-In button. Keep email + password fields + submit button.

- [ ] **Step 4: Take Pencil screenshot and visually compare**
```
mcp__pencil__get_screenshot({ filePath: "diet-manager.pen", nodeId: "hJehG" })
```

- [ ] **Step 5: Commit**
```bash
git add mobile/screens/Login/
git commit -m "feat: redesign Login screen to match Pencil design"
```

---

## Task 7: Create AppLogo Shared Component

**Files:**
- Create: `mobile/components/AppLogo/AppLogo.tsx`

This component is used by Login, Register, ForgotPassword, and Onboarding screens.

- [ ] **Step 1: Create AppLogo**

```tsx
// mobile/components/AppLogo/AppLogo.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { SPACING } from '../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../constants/typography.constants';

interface AppLogoProps {
  style?: ViewStyle;
  horizontal?: boolean; // if true: icon + text side-by-side (used in Forgot Password, Onboarding)
}

export default function AppLogo({ style, horizontal = false }: AppLogoProps): React.JSX.Element {
  const content = (
    <>
      <View style={styles.iconCircle}>
        <Text style={styles.leafIcon}>🌿</Text>
      </View>
      <Text style={[styles.appName, horizontal && styles.appNameHorizontal]}>DietManager</Text>
    </>
  );

  return (
    <View style={[horizontal ? styles.containerRow : styles.containerColumn, style]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  containerColumn: { alignItems: 'center' },
  containerRow: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leafIcon: { fontSize: 22 },
  appName: { fontSize: FONT_SIZE.MD, fontWeight: FONT_WEIGHT.SEMIBOLD, color: Colors.textPrimary, marginTop: SPACING.XS },
  appNameHorizontal: { marginTop: 0, marginLeft: SPACING.SM },
});
```

> After implementing, take a screenshot of the Login screen and compare with the Pencil `hJehG` frame. The logo should be a green-tinted circle with a leaf icon.

- [ ] **Step 2: Commit**
```bash
git add mobile/components/AppLogo/
git commit -m "feat: add AppLogo shared component"
```

---

## Task 8: Redesign Register Screen

**Files:**
- Modify: `mobile/screens/Register/Register.tsx`
- Modify: `mobile/screens/Register/components/RegisterForm.tsx`

Design reference: frame `aEl5B`

- [ ] **Step 1: Read both files**

- [ ] **Step 2: Rewrite Register.tsx**

```tsx
// mobile/screens/Register/Register.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegisterForm from './components/RegisterForm';
import { useRegisterForm } from './hooks/useRegisterForm';
import { Colors } from '../../constants/Colors';
import { SPACING } from '../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../constants/typography.constants';
import AppLogo from '../../components/AppLogo/AppLogo';

export default function Register(): React.JSX.Element {
  const router = useRouter();
  const formProps = useRegisterForm();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <AppLogo style={styles.logo} />

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to start your nutrition journey</Text>

        <RegisterForm {...formProps} />

        <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.loginBtn}>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginLink}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  container: { flexGrow: 1, paddingHorizontal: SPACING.LG, paddingTop: SPACING.XL, paddingBottom: SPACING.XL },
  logo: { alignSelf: 'center', marginBottom: SPACING.XL },
  title: { fontSize: FONT_SIZE.XXL, fontWeight: FONT_WEIGHT.BOLD, color: Colors.textPrimary, marginBottom: SPACING.XS },
  subtitle: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary, marginBottom: SPACING.XL },
  loginBtn: { marginTop: SPACING.LG, alignSelf: 'center' },
  loginText: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary, textAlign: 'center' },
  loginLink: { color: Colors.primary, fontWeight: FONT_WEIGHT.SEMIBOLD },
});
```

- [ ] **Step 3: Update RegisterForm.tsx**

Replace the two name inputs (firstName, lastName) with a single Full Name input. Keep email, password, confirmPassword. Remove Google Sign-In. Use `mode="outlined"` inputs.

```tsx
<Controller
  control={form.control}
  name="fullName"
  render={({ field, fieldState }) => (
    <TextInput
      label="Full Name"
      mode="outlined"
      placeholder="Enter your full name"
      value={field.value}
      onChangeText={field.onChange}
      onBlur={field.onBlur}
      error={!!fieldState.error}
      activeOutlineColor={Colors.primary}
      style={styles.input}
    />
    // error text below if fieldState.error
  )}
/>
```

- [ ] **Step 4: Update useRegisterForm.ts — navigate to onboarding after register**

After successful register, navigate to `/(onboarding)/welcome`:
```typescript
router.replace('/(onboarding)/welcome');
```

- [ ] **Step 5: Verify TypeScript**
```bash
cd mobile && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 6: Commit**
```bash
git add mobile/screens/Register/
git commit -m "feat: redesign Register screen — single Full Name field, Pencil layout"
```

---

## Task 9: Forgot Password Screens

**Files:**
- Create: `mobile/screens/ForgotPassword/hooks/useForgotPasswordForm.ts`
- Create: `mobile/screens/ForgotPassword/ForgotPassword.tsx`
- Create: `mobile/app/(auth)/forgot-password.tsx`
- Create: `mobile/app/(auth)/forgot-password-sent.tsx`
- Modify: `mobile/app/(auth)/_layout.tsx`

Design reference: frames `e6so7` (form), `YLynG` (sent)

- [ ] **Step 1: Create useForgotPasswordForm.ts**

```typescript
// mobile/screens/ForgotPassword/hooks/useForgotPasswordForm.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export type ForgotPasswordFormValues = z.infer<typeof schema>;

export function useForgotPasswordForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { email: '' },
  });

  async function onSubmit(data: ForgotPasswordFormValues): Promise<void> {
    setIsSubmitting(true);
    try {
      // Mock: simulate API call
      await new Promise((r) => setTimeout(r, 1000));
      router.push({ pathname: '/(auth)/forgot-password-sent', params: { email: data.email } });
    } finally {
      setIsSubmitting(false);
    }
  }

  return { form, isSubmitting, onSubmit: form.handleSubmit(onSubmit) };
}
```

- [ ] **Step 2: Create ForgotPasswordForm.tsx sub-component**

Per CLAUDE.md, the screen renders UI only and delegates to a form sub-component.

```tsx
// mobile/screens/ForgotPassword/components/ForgotPasswordForm.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { Controller } from 'react-hook-form';
import type { UseForgotPasswordFormReturn } from '../hooks/useForgotPasswordForm';
import { Colors } from '../../../constants/Colors';
import { SPACING } from '../../../constants/spacing.constants';
import { FONT_SIZE } from '../../../constants/typography.constants';

type ForgotPasswordFormProps = Pick<UseForgotPasswordFormReturn, 'form' | 'isSubmitting' | 'onSubmit'>;

export default function ForgotPasswordForm({ form, isSubmitting, onSubmit }: ForgotPasswordFormProps): React.JSX.Element {
  return (
    <>
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <>
            <Text style={styles.label}>Email</Text>
            <TextInput
              mode="outlined"
              placeholder="Enter your email address"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!fieldState.error}
              activeOutlineColor={Colors.primary}
              style={styles.input}
            />
            {fieldState.error && <Text style={styles.errorText}>{fieldState.error.message}</Text>}
          </>
        )}
      />
      <Button
        mode="contained"
        onPress={onSubmit}
        loading={isSubmitting}
        disabled={isSubmitting}
        buttonColor={Colors.primary}
        style={styles.submitBtn}
        contentStyle={styles.submitContent}
      >
        Send Reset Link
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary, marginBottom: SPACING.XS },
  input: { marginBottom: SPACING.XS, backgroundColor: Colors.bgPage },
  errorText: { fontSize: FONT_SIZE.XS, color: Colors.error, marginBottom: SPACING.SM },
  submitBtn: { marginTop: SPACING.MD, borderRadius: 8 },
  submitContent: { paddingVertical: SPACING.XS },
});
```

Also update `useForgotPasswordForm.ts` to export its return type:
```typescript
export type UseForgotPasswordFormReturn = ReturnType<typeof useForgotPasswordForm>;
```

- [ ] **Step 3: Create ForgotPassword.tsx screen**

```tsx
// mobile/screens/ForgotPassword/ForgotPassword.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForgotPasswordForm } from './hooks/useForgotPasswordForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import AppLogo from '../../components/AppLogo/AppLogo';
import { Colors } from '../../constants/Colors';
import { SPACING } from '../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../constants/typography.constants';

export default function ForgotPassword(): React.JSX.Element {
  const router = useRouter();
  const formProps = useForgotPasswordForm();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <AppLogo horizontal style={styles.logo} />

        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>Enter your email and we'll send you a reset link</Text>

        <ForgotPasswordForm {...formProps} />

        <View style={styles.spacer} />

        <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.backToLogin}>
          <Text style={styles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  container: { flex: 1, paddingHorizontal: SPACING.LG, paddingTop: SPACING.MD },
  backBtn: { marginBottom: SPACING.XL },
  backIcon: { fontSize: 28, color: Colors.textPrimary },
  logo: { marginBottom: SPACING.XL },
  title: { fontSize: FONT_SIZE.XXL, fontWeight: FONT_WEIGHT.BOLD, color: Colors.textPrimary, marginBottom: SPACING.XS },
  subtitle: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary, marginBottom: SPACING.XL },
  spacer: { flex: 1 },
  backToLogin: { alignSelf: 'center', marginBottom: SPACING.XL },
  backToLoginText: { fontSize: FONT_SIZE.MD, color: Colors.primary },
});
```

- [ ] **Step 4: Create ForgotPasswordSent.tsx screen**

```tsx
// mobile/screens/ForgotPassword/ForgotPasswordSent.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { SPACING } from '../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../constants/typography.constants';

export default function ForgotPasswordSent(): React.JSX.Element {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>✉️</Text>
          </View>

          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            We sent a password reset link to your email.{'\n'}
            Check your inbox and click the link to continue.
          </Text>

          <Button
            mode="contained"
            buttonColor={Colors.primary}
            style={styles.btn}
            contentStyle={styles.btnContent}
            onPress={() => { /* open mail app — no-op in mock */ }}
          >
            Open Email App
          </Button>

          <View style={styles.resendRow}>
            <Text style={styles.resendText}>Didn't receive it? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.resendLink}>Resend link</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.backToLogin} onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  container: { flex: 1, paddingHorizontal: SPACING.LG, paddingTop: SPACING.MD },
  backBtn: { marginBottom: SPACING.XL },
  backIcon: { fontSize: 28, color: Colors.textPrimary },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.bgCard, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.XL },
  iconText: { fontSize: 36 },
  title: { fontSize: FONT_SIZE.XXL, fontWeight: FONT_WEIGHT.BOLD, color: Colors.textPrimary, marginBottom: SPACING.SM, textAlign: 'center' },
  subtitle: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary, textAlign: 'center', marginBottom: SPACING.XL, lineHeight: 22 },
  btn: { width: '100%', borderRadius: 8, marginBottom: SPACING.MD },
  btnContent: { paddingVertical: SPACING.XS },
  resendRow: { flexDirection: 'row', alignItems: 'center' },
  resendText: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary },
  resendLink: { fontSize: FONT_SIZE.MD, color: Colors.primary },
  backToLogin: { alignSelf: 'center', marginBottom: SPACING.XL },
  backToLoginText: { fontSize: FONT_SIZE.MD, color: Colors.primary },
});
```

- [ ] **Step 5: Create route files (thin re-exports)**

`mobile/app/(auth)/forgot-password.tsx`:
```tsx
import ForgotPassword from '../../screens/ForgotPassword/ForgotPassword';
export default ForgotPassword;
```

`mobile/app/(auth)/forgot-password-sent.tsx`:
```tsx
import ForgotPasswordSent from '../../screens/ForgotPassword/ForgotPasswordSent';
export default ForgotPasswordSent;
```

- [ ] **Step 6: Add routes to (auth)/_layout.tsx**

Read `mobile/app/(auth)/_layout.tsx` and add:
```tsx
<Stack.Screen name="forgot-password" options={{ headerShown: false }} />
<Stack.Screen name="forgot-password-sent" options={{ headerShown: false }} />
```

- [ ] **Step 7: Verify TypeScript**
```bash
cd mobile && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 8: Commit**
```bash
git add mobile/screens/ForgotPassword/ mobile/app/(auth)/forgot-password.tsx mobile/app/(auth)/forgot-password-sent.tsx mobile/app/(auth)/_layout.tsx
git commit -m "feat: add Forgot Password flow"
```

---

## Task 10: Onboarding Shared Components

**Files:**
- Create: `mobile/screens/Onboarding/components/OnboardingProgressDots.tsx`
- Create: `mobile/screens/Onboarding/components/OnboardingLayout.tsx`

- [ ] **Step 1: Create OnboardingProgressDots**

```tsx
// mobile/screens/Onboarding/components/OnboardingProgressDots.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { SPACING } from '../../../constants/spacing.constants';

interface OnboardingProgressDotsProps {
  total: number;
  current: number; // 0-based
}

export default function OnboardingProgressDots({ total, current }: OnboardingProgressDotsProps): React.JSX.Element {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.XS },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.bgCard },
  dotActive: { width: 24, backgroundColor: Colors.primary },
});
```

- [ ] **Step 2: Create OnboardingLayout**

```tsx
// mobile/screens/Onboarding/components/OnboardingLayout.tsx
// Wrapper used by all onboarding screens
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { SPACING } from '../../../constants/spacing.constants';
import { FONT_SIZE } from '../../../constants/typography.constants';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  primaryLabel: string;
  onPrimary: () => void;
  isPrimaryLoading?: boolean;
  onSkip?: () => void;
}

export default function OnboardingLayout({
  children, showBack, onBack, primaryLabel, onPrimary, isPrimaryLoading, onSkip,
}: OnboardingLayoutProps): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {showBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
        )}

        <View style={styles.content}>{children}</View>

        <View style={styles.footer}>
          <Button
            mode="contained"
            buttonColor={Colors.primary}
            style={styles.primaryBtn}
            contentStyle={styles.primaryContent}
            onPress={onPrimary}
            loading={isPrimaryLoading}
            disabled={isPrimaryLoading}
          >
            {primaryLabel}
          </Button>
          {onSkip && (
            <TouchableOpacity onPress={onSkip} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  container: { flex: 1, paddingHorizontal: SPACING.LG },
  backBtn: { paddingTop: SPACING.MD, marginBottom: SPACING.SM },
  backIcon: { fontSize: 28, color: Colors.textPrimary },
  content: { flex: 1 },
  footer: { paddingBottom: SPACING.XL },
  primaryBtn: { borderRadius: 8, marginBottom: SPACING.SM },
  primaryContent: { paddingVertical: SPACING.XS },
  skipBtn: { alignSelf: 'center' },
  skipText: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary },
});
```

- [ ] **Step 3: Commit**
```bash
git add mobile/screens/Onboarding/components/
git commit -m "feat: add OnboardingProgressDots and OnboardingLayout shared components"
```

---

## Task 11: Onboarding Route Group

**Files:**
- Create: `mobile/app/(onboarding)/_layout.tsx`
- Create: `mobile/app/(onboarding)/welcome.tsx`
- Create: `mobile/app/(onboarding)/features.tsx`
- Create: `mobile/app/(onboarding)/method.tsx`
- Create: `mobile/app/(onboarding)/personal-data.tsx`
- Create: `mobile/app/(onboarding)/activity-goal.tsx`
- Create: `mobile/app/(onboarding)/manual-entry.tsx`
- Create: `mobile/app/(onboarding)/result.tsx`

- [ ] **Step 1: Create _layout.tsx**

```tsx
// mobile/app/(onboarding)/_layout.tsx
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
  );
}
```

- [ ] **Step 2: Add `(onboarding)` to the root layout**

Read `mobile/app/_layout.tsx`. The root layout uses explicit `<Stack.Screen>` entries — Expo Router will not navigate to `(onboarding)` unless it's registered. Add:

```tsx
<Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
```

alongside the existing `(auth)` and `(tabs)` entries.

- [ ] **Step 3: Create stub route files (each is a one-liner export)**

`welcome.tsx`:
```tsx
import Welcome from '../../screens/Onboarding/Welcome/Welcome';
export default Welcome;
```

Repeat for `features.tsx`, `method.tsx`, `personal-data.tsx`, `activity-goal.tsx`, `manual-entry.tsx`, `result.tsx` — each exports from the corresponding screen component.

- [ ] **Step 4: Commit**
```bash
git add mobile/app/(onboarding)/ mobile/app/_layout.tsx
git commit -m "feat: add (onboarding) route group and register in root layout"
```

---

## Task 12: Onboarding Welcome Screen

**Files:**
- Create: `mobile/screens/Onboarding/Welcome/Welcome.tsx`

Design reference: frame `g1vCy`

- [ ] **Step 1: Create Welcome.tsx**

```tsx
// mobile/screens/Onboarding/Welcome/Welcome.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import OnboardingLayout from '../components/OnboardingLayout';
import OnboardingProgressDots from '../components/OnboardingProgressDots';
import AppLogo from '../../../components/AppLogo/AppLogo';
import { Colors } from '../../../constants/Colors';
import { SPACING } from '../../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../../constants/typography.constants';

const FEATURES = [
  { icon: '↩', label: 'Instant food recognition' },
  { icon: '📊', label: 'Smart nutrition tracking' },
  { icon: '🎯', label: 'Personalized goals' },
];

export default function Welcome(): React.JSX.Element {
  const router = useRouter();

  function handleSkip(): void {
    // Skip navigates to method screen
    router.push('/(onboarding)/method');
  }

  return (
    <OnboardingLayout
      primaryLabel="Get Started"
      onPrimary={() => router.push('/(onboarding)/features')}
      onSkip={handleSkip}
    >
      <AppLogo horizontal style={styles.logo} />

      <View style={styles.illustration}>
        {/* Placeholder illustration box */}
        <View style={styles.illustrationBox}>
          <Text style={styles.illustrationIcon}>📷</Text>
          <Text style={styles.illustrationLabel}>AI Scanning...</Text>
        </View>
        <View style={styles.foodIcons}>
          <Text style={styles.foodIcon}>🍎</Text>
          <Text style={styles.foodIcon}>🍱</Text>
          <Text style={styles.foodIcon}>🥗</Text>
        </View>
        <Text style={styles.sparkle}>✨</Text>
      </View>

      <Text style={styles.title}>Track Calories with AI</Text>
      <Text style={styles.subtitle}>Simply snap a photo of your food and let AI do the counting</Text>

      {FEATURES.map((f) => (
        <View key={f.label} style={styles.featureRow}>
          <Text style={styles.featureIcon}>{f.icon}</Text>
          <Text style={styles.featureLabel}>{f.label}</Text>
        </View>
      ))}

      <View style={styles.dotsContainer}>
        <OnboardingProgressDots total={4} current={0} />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  logo: { marginTop: SPACING.MD, marginBottom: SPACING.LG },
  illustration: { backgroundColor: Colors.primary + '15', borderRadius: 16, padding: SPACING.LG, alignItems: 'center', marginBottom: SPACING.XL },
  illustrationBox: { backgroundColor: '#fff', borderRadius: 12, padding: SPACING.MD, alignItems: 'center', marginBottom: SPACING.MD },
  illustrationIcon: { fontSize: 32 },
  illustrationLabel: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary, marginTop: SPACING.XS },
  foodIcons: { flexDirection: 'row', gap: SPACING.MD },
  foodIcon: { fontSize: 28 },
  sparkle: { fontSize: 24, marginTop: SPACING.SM },
  title: { fontSize: FONT_SIZE.XXL, fontWeight: FONT_WEIGHT.BOLD, color: Colors.textPrimary, marginBottom: SPACING.SM },
  subtitle: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary, marginBottom: SPACING.LG, lineHeight: 22 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.SM },
  featureIcon: { fontSize: 18, marginRight: SPACING.SM, color: Colors.primary },
  featureLabel: { fontSize: FONT_SIZE.MD, color: Colors.textPrimary },
  dotsContainer: { marginTop: SPACING.XL },
});
```

- [ ] **Step 2: Commit**
```bash
git add mobile/screens/Onboarding/Welcome/
git commit -m "feat: add Onboarding Welcome screen"
```

---

## Task 13: Onboarding Features Screen

**Files:**
- Create: `mobile/screens/Onboarding/Features/Features.tsx`

Design reference: frame `qjY7y`

- [ ] **Step 1: Create Features.tsx**

```tsx
// mobile/screens/Onboarding/Features/Features.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import OnboardingLayout from '../components/OnboardingLayout';
import OnboardingProgressDots from '../components/OnboardingProgressDots';
import { Colors } from '../../../constants/Colors';
import { SPACING } from '../../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../../constants/typography.constants';

const FEATURES = [
  { icon: '↑', label: 'Daily calorie tracking' },
  { icon: '🕐', label: 'Macro breakdown (Protein, Fat, Carbs)' },
  { icon: '📅', label: 'Weekly & monthly statistics' },
];

export default function Features(): React.JSX.Element {
  const router = useRouter();

  return (
    <OnboardingLayout
      showBack
      onBack={() => router.back()}
      primaryLabel="Continue"
      onPrimary={() => router.push('/(onboarding)/method')}
      onSkip={() => router.push('/(onboarding)/method')}
    >
      {/* Calorie ring illustration placeholder */}
      <View style={styles.illustration}>
        <View style={styles.ring}>
          <Text style={styles.ringNumber}>1,840</Text>
          <Text style={styles.ringLabel}>kcal</Text>
        </View>
        <View style={styles.macroBar}><Text style={styles.macroLabel}>Protein</Text><View style={[styles.bar, { width: 120, backgroundColor: Colors.protein }]} /></View>
        <View style={styles.macroBar}><Text style={styles.macroLabel}>Fat</Text><View style={[styles.bar, { width: 80, backgroundColor: Colors.fat }]} /></View>
        <View style={styles.macroBar}><Text style={styles.macroLabel}>Carbs</Text><View style={[styles.bar, { width: 140, backgroundColor: Colors.carbs }]} /></View>
      </View>

      <Text style={styles.title}>Track Your Progress</Text>
      <Text style={styles.subtitle}>Monitor daily intake, macros, and achieve your fitness goals</Text>

      {FEATURES.map((f) => (
        <View key={f.label} style={styles.featureRow}>
          <Text style={styles.featureIcon}>{f.icon}</Text>
          <Text style={styles.featureLabel}>{f.label}</Text>
        </View>
      ))}

      <View style={styles.dotsContainer}>
        <OnboardingProgressDots total={4} current={1} />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  illustration: { backgroundColor: Colors.primary + '15', borderRadius: 16, padding: SPACING.LG, alignItems: 'center', marginBottom: SPACING.XL, marginTop: SPACING.MD },
  ring: { width: 100, height: 100, borderRadius: 50, borderWidth: 8, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.MD },
  ringNumber: { fontSize: FONT_SIZE.LG, fontWeight: FONT_WEIGHT.BOLD, color: Colors.textPrimary },
  ringLabel: { fontSize: FONT_SIZE.XS, color: Colors.textSecondary },
  macroBar: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.XS, width: '100%' },
  macroLabel: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary, width: 50 },
  bar: { height: 8, borderRadius: 4 },
  title: { fontSize: FONT_SIZE.XXL, fontWeight: FONT_WEIGHT.BOLD, color: Colors.textPrimary, marginBottom: SPACING.SM },
  subtitle: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary, marginBottom: SPACING.LG, lineHeight: 22 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.SM },
  featureIcon: { fontSize: 18, marginRight: SPACING.SM, color: Colors.primary },
  featureLabel: { fontSize: FONT_SIZE.MD, color: Colors.textPrimary },
  dotsContainer: { marginTop: SPACING.XL },
});
```

- [ ] **Step 2: Commit**
```bash
git add mobile/screens/Onboarding/Features/
git commit -m "feat: add Onboarding Features screen"
```

---

## Task 14: Onboarding Method Screen

**Files:**
- Create: `mobile/screens/Onboarding/Method/hooks/useMethodForm.ts`
- Create: `mobile/screens/Onboarding/Method/Method.tsx`

Design reference: frame `J6KhR` — "Set Your Daily Goal" — radio cards "Calculate for me" / "Enter manually"

- [ ] **Step 1: Create useMethodForm.ts**

```typescript
// mobile/screens/Onboarding/Method/hooks/useMethodForm.ts
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { GoalMethod } from '../../../../types/onboarding.types';
import { useProfileStore } from '../../../../stores/useProfileStore';

export function useMethodForm() {
  const [selected, setSelected] = useState<GoalMethod>('calculate');
  const setOnboardingData = useProfileStore((s) => s.setOnboardingData);
  const router = useRouter();

  function onNext(): void {
    setOnboardingData({ goalMethod: selected });
    if (selected === 'calculate') {
      router.push('/(onboarding)/personal-data');
    } else {
      router.push('/(onboarding)/manual-entry');
    }
  }

  return { selected, setSelected, onNext };
}
```

- [ ] **Step 2: Create Method.tsx**

```tsx
// mobile/screens/Onboarding/Method/Method.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import OnboardingLayout from '../components/OnboardingLayout';
import OnboardingProgressDots from '../components/OnboardingProgressDots';
import { useMethodForm } from './hooks/useMethodForm';
import { GoalMethod } from '../../../types/onboarding.types';
import { Colors } from '../../../constants/Colors';
import { SPACING } from '../../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../../constants/typography.constants';

const OPTIONS: { value: GoalMethod; title: string; subtitle: string; icon: string }[] = [
  { value: 'calculate', title: 'Calculate for me', subtitle: "We'll calculate your ideal goal based on your personal data", icon: '📊' },
  { value: 'manual', title: 'Enter manually', subtitle: 'Set your own daily calorie target', icon: '✏️' },
];

export default function Method(): React.JSX.Element {
  const router = useRouter();
  const { selected, setSelected, onNext } = useMethodForm();

  return (
    <OnboardingLayout
      showBack
      onBack={() => router.back()}
      primaryLabel="Next"
      onPrimary={onNext}
      onSkip={() => router.push('/(onboarding)/result')}
    >
      <Text style={styles.title}>Set Your Daily Goal</Text>
      <Text style={styles.subtitle}>Choose how you'd like to set your calorie target</Text>

      {OPTIONS.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={() => setSelected(opt.value)}
          >
            <View style={styles.cardLeft}>
              <Text style={styles.cardIcon}>{opt.icon}</Text>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{opt.title}</Text>
                <Text style={styles.cardSubtitle}>{opt.subtitle}</Text>
              </View>
            </View>
            <View style={[styles.radio, isSelected && styles.radioSelected]}>
              {isSelected && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        );
      })}

      <View style={styles.dotsContainer}>
        <OnboardingProgressDots total={4} current={2} />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: FONT_SIZE.XXL, fontWeight: FONT_WEIGHT.BOLD, color: Colors.textPrimary, marginBottom: SPACING.XS, marginTop: SPACING.LG },
  subtitle: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary, marginBottom: SPACING.XL, lineHeight: 22 },
  card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12, padding: SPACING.MD, marginBottom: SPACING.MD },
  cardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '08' },
  cardLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1 },
  cardIcon: { fontSize: 22, marginRight: SPACING.MD },
  cardText: { flex: 1 },
  cardTitle: { fontSize: FONT_SIZE.MD, fontWeight: FONT_WEIGHT.SEMIBOLD, color: Colors.textPrimary, marginBottom: 2 },
  cardSubtitle: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary, lineHeight: 18 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', marginLeft: SPACING.SM },
  radioSelected: { borderColor: Colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  dotsContainer: { marginTop: SPACING.XL },
});
```

> Note: `Colors.border` may not exist yet — check `Colors.ts` and use `Colors.divider` or `#E5E5E5` if not.

- [ ] **Step 3: Commit**
```bash
git add mobile/screens/Onboarding/Method/
git commit -m "feat: add Onboarding Method screen (Set Your Daily Goal)"
```

---

## Task 15: Onboarding PersonalData Screen

**Files:**
- Create: `mobile/screens/Onboarding/PersonalData/hooks/usePersonalDataForm.ts`
- Create: `mobile/screens/Onboarding/PersonalData/PersonalData.tsx`

Design reference: frame `lYN1g` — Age, Gender chips, Weight+toggle, Height+toggle

- [ ] **Step 1: Create usePersonalDataForm.ts**

```typescript
// mobile/screens/Onboarding/PersonalData/hooks/usePersonalDataForm.ts
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Gender } from '../../../../types/onboarding.types';
import { useProfileStore } from '../../../../stores/useProfileStore';

interface PersonalDataValues {
  age: string;
  gender: Gender;
  weightValue: string;
  heightValue: string;
  isMetric: boolean; // true = kg/cm, false = lbs/in
}

export function usePersonalDataForm() {
  const router = useRouter();
  const setOnboardingData = useProfileStore((s) => s.setOnboardingData);

  const [values, setValues] = useState<PersonalDataValues>({
    age: '25',
    gender: 'male',
    weightValue: '70',
    heightValue: '175',
    isMetric: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PersonalDataValues, string>>>({});

  function setField<K extends keyof PersonalDataValues>(key: K, value: PersonalDataValues[K]): void {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const newErrors: typeof errors = {};
    const age = Number(values.age);
    if (!values.age || isNaN(age) || age < 13 || age > 120) newErrors.age = 'Enter a valid age (13–120)';
    const weight = Number(values.weightValue);
    if (!values.weightValue || isNaN(weight) || weight <= 0) newErrors.weightValue = 'Enter a valid weight';
    const height = Number(values.heightValue);
    if (!values.heightValue || isNaN(height) || height <= 0) newErrors.heightValue = 'Enter a valid height';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function onContinue(): void {
    if (!validate()) return;
    const weightKg = values.isMetric
      ? Number(values.weightValue)
      : Number(values.weightValue) * 0.453592;
    const heightCm = values.isMetric
      ? Number(values.heightValue)
      : Number(values.heightValue) * 2.54;
    setOnboardingData({
      personalData: {
        age: Number(values.age),
        gender: values.gender,
        weightKg: Math.round(weightKg * 10) / 10,
        heightCm: Math.round(heightCm),
      },
    });
    router.push('/(onboarding)/activity-goal');
  }

  return { values, errors, setField, onContinue };
}
```

- [ ] **Step 2: Create PersonalData.tsx**

Define `Chip` and `UnitToggle` **above** the main component so they are in scope when used in JSX.

```tsx
// mobile/screens/Onboarding/PersonalData/PersonalData.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import OnboardingLayout from '../components/OnboardingLayout';
import { usePersonalDataForm } from './hooks/usePersonalDataForm';
import { Gender } from '../../../types/onboarding.types';
import { Colors } from '../../../constants/Colors';
import { SPACING } from '../../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../../constants/typography.constants';

// ─── Sub-components (defined ABOVE main component) ──────────────────────────

function Chip({ selected, onPress, children }: { selected: boolean; onPress: () => void; children: string }): React.JSX.Element {
  return (
    <TouchableOpacity style={[chipStyles.chip, selected && chipStyles.selected]} onPress={onPress}>
      <Text style={[chipStyles.text, selected && chipStyles.selectedText]}>{children}</Text>
    </TouchableOpacity>
  );
}

const chipStyles = StyleSheet.create({
  chip: { paddingHorizontal: SPACING.MD, paddingVertical: SPACING.SM, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, marginRight: SPACING.SM },
  selected: { backgroundColor: Colors.textPrimary, borderColor: Colors.textPrimary },
  text: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary },
  selectedText: { color: '#fff' },
});

function UnitToggle({ options, selected, onSelect }: { options: string[]; selected: number; onSelect: (i: number) => void }): React.JSX.Element {
  return (
    <View style={toggleStyles.container}>
      {options.map((opt, i) => (
        <TouchableOpacity key={opt} style={[toggleStyles.option, i === selected && toggleStyles.selected]} onPress={() => onSelect(i)}>
          <Text style={[toggleStyles.text, i === selected && toggleStyles.selectedText]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const toggleStyles = StyleSheet.create({
  container: { flexDirection: 'row', borderRadius: 8, overflow: 'hidden', marginLeft: SPACING.SM, borderWidth: 1, borderColor: Colors.border },
  option: { paddingHorizontal: SPACING.MD, paddingVertical: SPACING.SM, backgroundColor: Colors.bgCard },
  selected: { backgroundColor: Colors.textPrimary },
  text: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary },
  selectedText: { color: '#fff' },
});

// ─── Main Screen ─────────────────────────────────────────────────────────────

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export default function PersonalData(): React.JSX.Element {
  const router = useRouter();
  const { values, errors, setField, onContinue } = usePersonalDataForm();

  return (
    <OnboardingLayout
      showBack
      onBack={() => router.back()}
      primaryLabel="Continue"
      onPrimary={onContinue}
      onSkip={() => router.push('/(onboarding)/result')}
    >
      <View style={styles.stepHeader}>
        <Text style={styles.stepLabel}>Step 1 of 2</Text>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
      </View>

      <Text style={styles.title}>Tell us about yourself</Text>
      <Text style={styles.subtitle}>We'll use this to calculate your ideal calorie goal</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.fieldLabel}>Age</Text>
        <TextInput
          mode="outlined"
          value={values.age}
          onChangeText={(v) => setField('age', v)}
          keyboardType="numeric"
          placeholder="25"
          activeOutlineColor={Colors.primary}
          error={!!errors.age}
          style={styles.input}
        />
        {errors.age && <Text style={styles.error}>{errors.age}</Text>}

        <Text style={styles.fieldLabel}>Gender</Text>
        <View style={styles.chipRow}>
          {GENDER_OPTIONS.map((g) => (
            <Chip key={g.value} selected={values.gender === g.value} onPress={() => setField('gender', g.value)}>
              {g.label}
            </Chip>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Weight</Text>
        <View style={styles.inputWithToggle}>
          <TextInput
            mode="outlined"
            value={values.weightValue}
            onChangeText={(v) => setField('weightValue', v)}
            keyboardType="numeric"
            activeOutlineColor={Colors.primary}
            error={!!errors.weightValue}
            style={[styles.input, styles.inputFlex]}
          />
          <UnitToggle options={['kg', 'lbs']} selected={values.isMetric ? 0 : 1} onSelect={(i) => setField('isMetric', i === 0)} />
        </View>
        {errors.weightValue && <Text style={styles.error}>{errors.weightValue}</Text>}

        <Text style={styles.fieldLabel}>Height</Text>
        <View style={styles.inputWithToggle}>
          <TextInput
            mode="outlined"
            value={values.heightValue}
            onChangeText={(v) => setField('heightValue', v)}
            keyboardType="numeric"
            activeOutlineColor={Colors.primary}
            error={!!errors.heightValue}
            style={[styles.input, styles.inputFlex]}
          />
          <UnitToggle options={['cm', 'in']} selected={values.isMetric ? 0 : 1} onSelect={(i) => setField('isMetric', i === 0)} />
        </View>
        {errors.heightValue && <Text style={styles.error}>{errors.heightValue}</Text>}
      </ScrollView>
    </OnboardingLayout>
  );
}
```

Add missing styles:
```typescript
const styles = StyleSheet.create({
  stepHeader: { marginTop: SPACING.MD, marginBottom: SPACING.LG },
  stepLabel: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary, marginBottom: SPACING.XS },
  progressBar: { height: 4, backgroundColor: Colors.bgCard, borderRadius: 2 },
  progressFill: { height: 4, width: '50%', backgroundColor: Colors.primary, borderRadius: 2 },
  title: { fontSize: FONT_SIZE.XXL, fontWeight: FONT_WEIGHT.BOLD, color: Colors.textPrimary, marginBottom: SPACING.XS },
  subtitle: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary, marginBottom: SPACING.XL, lineHeight: 22 },
  fieldLabel: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary, marginBottom: SPACING.XS, marginTop: SPACING.MD },
  input: { backgroundColor: Colors.bgPage, marginBottom: 2 },
  inputFlex: { flex: 1 },
  inputWithToggle: { flexDirection: 'row', alignItems: 'center' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: SPACING.XS },
  error: { fontSize: FONT_SIZE.XS, color: Colors.error, marginBottom: SPACING.SM },
});
```

- [ ] **Step 3: Commit**
```bash
git add mobile/screens/Onboarding/PersonalData/
git commit -m "feat: add Onboarding PersonalData screen"
```

---

## Task 16: Onboarding ActivityGoal Screen

**Files:**
- Create: `mobile/screens/Onboarding/ActivityGoal/hooks/useActivityGoalForm.ts`
- Create: `mobile/screens/Onboarding/ActivityGoal/ActivityGoal.tsx`

Design reference: frame `zO0Iw` — "Activity & Goals", 5 activity radio options, 3 goal radio options

- [ ] **Step 1: Create useActivityGoalForm.ts**

```typescript
// mobile/screens/Onboarding/ActivityGoal/hooks/useActivityGoalForm.ts
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityLevel, PrimaryGoal } from '../../../../types/onboarding.types';
import { useProfileStore } from '../../../../stores/useProfileStore';
import { calculateBMR, calculateTDEE, calculateCalorieGoal } from '../../../../services/calorieCalculator.service';

export function useActivityGoalForm() {
  const router = useRouter();
  const setOnboardingData = useProfileStore((s) => s.setOnboardingData);
  const onboardingData = useProfileStore((s) => s.onboardingData);

  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderately_active');
  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal>('maintain_weight');
  const [isCalculating, setIsCalculating] = useState(false);

  async function onCalculate(): Promise<void> {
    setIsCalculating(true);
    try {
      const pd = onboardingData.personalData;
      if (!pd) { router.push('/(onboarding)/personal-data'); return; }

      const bmr = calculateBMR(pd.weightKg, pd.heightCm, pd.age, pd.gender);
      const tdee = calculateTDEE(bmr, activityLevel);
      const calorieGoal = calculateCalorieGoal(tdee, primaryGoal);

      setOnboardingData({ activityGoal: { activityLevel, primaryGoal }, calorieGoal });
      router.push('/(onboarding)/result');
    } finally {
      setIsCalculating(false);
    }
  }

  return { activityLevel, setActivityLevel, primaryGoal, setPrimaryGoal, isCalculating, onCalculate };
}
```

- [ ] **Step 2: Create ActivityGoal.tsx**

```tsx
// mobile/screens/Onboarding/ActivityGoal/ActivityGoal.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import OnboardingLayout from '../components/OnboardingLayout';
import { useActivityGoalForm } from './hooks/useActivityGoalForm';
import { ActivityLevel, PrimaryGoal } from '../../../types/onboarding.types';
import { Colors } from '../../../constants/Colors';
import { SPACING } from '../../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../../constants/typography.constants';

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string; subtitle: string }[] = [
  { value: 'sedentary', label: 'Sedentary', subtitle: 'Little or no exercise' },
  { value: 'lightly_active', label: 'Lightly Active', subtitle: 'Light exercise 1-3 days/week' },
  { value: 'moderately_active', label: 'Moderately Active', subtitle: 'Moderate exercise 3-5 days/week' },
  { value: 'very_active', label: 'Very Active', subtitle: 'Heavy exercise 6-7 days/week' },
  { value: 'extremely_active', label: 'Extremely Active', subtitle: 'Very heavy exercise & physical job' },
];

const GOAL_OPTIONS: { value: PrimaryGoal; label: string; subtitle: string }[] = [
  { value: 'lose_weight', label: 'Lose Weight', subtitle: 'Create calorie deficit' },
  { value: 'maintain_weight', label: 'Maintain Weight', subtitle: 'Keep current weight' },
  { value: 'gain_weight', label: 'Gain Weight', subtitle: 'Create calorie surplus' },
];

export default function ActivityGoal(): React.JSX.Element {
  const router = useRouter();
  const { activityLevel, setActivityLevel, primaryGoal, setPrimaryGoal, isCalculating, onCalculate } = useActivityGoalForm();

  return (
    <OnboardingLayout
      showBack
      onBack={() => router.back()}
      primaryLabel="Calculate My Goal"
      onPrimary={onCalculate}
      isPrimaryLoading={isCalculating}
      onSkip={() => router.push('/(onboarding)/result')}
    >
      {/* Step 2 of 2 progress */}
      <View style={styles.stepHeader}>
        <Text style={styles.stepLabel}>Step 2 of 2</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
      </View>

      <Text style={styles.title}>Activity & Goals</Text>
      <Text style={styles.subtitle}>Almost there! Just a bit more info</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>How active are you?</Text>
        {ACTIVITY_OPTIONS.map((opt) => (
          <RadioRow
            key={opt.value}
            label={opt.label}
            subtitle={opt.subtitle}
            selected={activityLevel === opt.value}
            onPress={() => setActivityLevel(opt.value)}
          />
        ))}

        <Text style={styles.sectionTitle}>What's your goal?</Text>
        {GOAL_OPTIONS.map((opt) => (
          <RadioRow
            key={opt.value}
            label={opt.label}
            subtitle={opt.subtitle}
            selected={primaryGoal === opt.value}
            onPress={() => setPrimaryGoal(opt.value)}
          />
        ))}
      </ScrollView>
    </OnboardingLayout>
  );
}

function RadioRow({ label, subtitle, selected, onPress }: { label: string; subtitle: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.radioRow, selected && styles.radioRowSelected]} onPress={onPress}>
      <View style={styles.radioRowText}>
        <Text style={styles.radioLabel}>{label}</Text>
        <Text style={styles.radioSubtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  stepHeader: { marginTop: SPACING.MD, marginBottom: SPACING.LG },
  stepLabel: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary, marginBottom: SPACING.XS },
  progressBar: { height: 4, backgroundColor: Colors.bgCard, borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: Colors.primary, borderRadius: 2 },
  title: { fontSize: FONT_SIZE.XXL, fontWeight: FONT_WEIGHT.BOLD, color: Colors.textPrimary, marginBottom: SPACING.XS },
  subtitle: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary, marginBottom: SPACING.LG },
  sectionTitle: { fontSize: FONT_SIZE.MD, fontWeight: FONT_WEIGHT.SEMIBOLD, color: Colors.textPrimary, marginBottom: SPACING.MD, marginTop: SPACING.MD },
  radioRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12, padding: SPACING.MD, marginBottom: SPACING.SM },
  radioRowSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '08' },
  radioRowText: { flex: 1 },
  radioLabel: { fontSize: FONT_SIZE.MD, fontWeight: FONT_WEIGHT.MEDIUM, color: Colors.textPrimary },
  radioSubtitle: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary, marginTop: 2 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center', marginLeft: SPACING.SM },
  radioSelected: { borderColor: Colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
});
```

- [ ] **Step 3: Commit**
```bash
git add mobile/screens/Onboarding/ActivityGoal/
git commit -m "feat: add Onboarding ActivityGoal screen"
```

---

## Task 17: Onboarding ManualEntry Screen

**Files:**
- Create: `mobile/screens/Onboarding/ManualEntry/hooks/useManualEntryForm.ts`
- Create: `mobile/screens/Onboarding/ManualEntry/ManualEntry.tsx`

Design reference: frame `wk8D7` — large number +/- stepper, "Set Goal" btn, "Calculate for me instead"

- [ ] **Step 1: Create useManualEntryForm.ts**

```typescript
// mobile/screens/Onboarding/ManualEntry/hooks/useManualEntryForm.ts
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useProfileStore } from '../../../../stores/useProfileStore';

const MIN_CALORIES = 1200;
const MAX_CALORIES = 5000;
const STEP = 50;

export function useManualEntryForm() {
  const router = useRouter();
  const setOnboardingData = useProfileStore((s) => s.setOnboardingData);
  const [calories, setCalories] = useState(2000);

  function increment(): void {
    setCalories((prev) => Math.min(prev + STEP, MAX_CALORIES));
  }

  function decrement(): void {
    setCalories((prev) => Math.max(prev - STEP, MIN_CALORIES));
  }

  function onSetGoal(): void {
    setOnboardingData({ calorieGoal: calories });
    router.push('/(onboarding)/result');
  }

  function onCalculateInstead(): void {
    router.push('/(onboarding)/personal-data');
  }

  return { calories, increment, decrement, onSetGoal, onCalculateInstead };
}
```

- [ ] **Step 2: Create ManualEntry.tsx**

Uses `OnboardingLayout` for consistency. The "Set Goal" and "Calculate for me instead" buttons are passed as children in the footer via `OnboardingLayout`'s `primaryLabel`/`onPrimary`. The secondary outline button is rendered as a child of the content area since `OnboardingLayout` only supports one primary action.

```tsx
// mobile/screens/Onboarding/ManualEntry/ManualEntry.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import OnboardingLayout from '../components/OnboardingLayout';
import { useManualEntryForm } from './hooks/useManualEntryForm';
import { Colors } from '../../../constants/Colors';
import { SPACING } from '../../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../../constants/typography.constants';

export default function ManualEntry(): React.JSX.Element {
  const router = useRouter();
  const { calories, increment, decrement, onSetGoal, onCalculateInstead } = useManualEntryForm();

  return (
    <OnboardingLayout
      showBack
      onBack={() => router.back()}
      primaryLabel="Set Goal"
      onPrimary={onSetGoal}
      onSkip={() => router.push('/(onboarding)/result')}
    >
      <Text style={styles.title}>Set Your Daily Goal</Text>
      <Text style={styles.subtitle}>Enter your target daily calories</Text>

      <View style={styles.stepper}>
        <TouchableOpacity style={styles.stepBtn} onPress={decrement}>
          <Text style={styles.stepBtnText}>−</Text>
        </TouchableOpacity>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{calories.toLocaleString()}</Text>
          <Text style={styles.unit}>kcal / day</Text>
        </View>
        <TouchableOpacity style={styles.stepBtn} onPress={increment}>
          <Text style={styles.stepBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.range}>Typical range: 1,500 – 2,500 kcal/day</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>Not sure? Most adults need 1,600–2,500 calories per day</Text>
      </View>

      {/* Secondary action rendered inside content, above OnboardingLayout's primary btn */}
      <View style={styles.spacer} />
      <Button
        mode="outlined"
        textColor={Colors.textPrimary}
        style={styles.calcBtn}
        contentStyle={styles.calcContent}
        onPress={onCalculateInstead}
      >
        Calculate for me instead
      </Button>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: FONT_SIZE.XXL, fontWeight: FONT_WEIGHT.BOLD, color: Colors.textPrimary, marginBottom: SPACING.XS, marginTop: SPACING.LG },
  subtitle: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary, marginBottom: SPACING.XXL },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.MD },
  stepBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  stepBtnText: { fontSize: 32, color: Colors.textSecondary },
  valueContainer: { alignItems: 'center', minWidth: 160 },
  value: { fontSize: 48, fontWeight: FONT_WEIGHT.BOLD, color: Colors.textPrimary },
  unit: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary },
  range: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary, textAlign: 'center', marginBottom: SPACING.MD },
  infoBox: { flexDirection: 'row', backgroundColor: '#EFF6FF', borderRadius: 8, padding: SPACING.MD, alignItems: 'flex-start' },
  infoIcon: { fontSize: 16, marginRight: SPACING.SM },
  infoText: { fontSize: FONT_SIZE.SM, color: '#1D4ED8', flex: 1, lineHeight: 18 },
  spacer: { flex: 1 },
  calcBtn: { borderRadius: 8, borderColor: Colors.border, marginBottom: SPACING.SM },
  calcContent: { paddingVertical: SPACING.XS },
});
```

- [ ] **Step 3: Commit**
```bash
git add mobile/screens/Onboarding/ManualEntry/
git commit -m "feat: add Onboarding ManualEntry screen"
```

---

## Task 18: Onboarding Result Screen (Modal)

**Files:**
- Create: `mobile/screens/Onboarding/Result/Result.tsx`

Design reference: frame `Oh9oq` — bottom sheet modal, green check circle, "Your Daily Goal", "X kcal/day", "Looks good!" btn, "Adjust" link

- [ ] **Step 1: Create Result.tsx**

```tsx
// mobile/screens/Onboarding/Result/Result.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfileStore } from '../../../stores/useProfileStore';
import { Colors } from '../../../constants/Colors';
import { SPACING } from '../../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../../constants/typography.constants';

export default function Result(): React.JSX.Element {
  const router = useRouter();
  const onboardingData = useProfileStore((s) => s.onboardingData);
  const completeOnboarding = useProfileStore((s) => s.completeOnboarding);

  const calorieGoal = onboardingData.calorieGoal ?? 2000;

  function onLooksGood(): void {
    completeOnboarding();
    router.replace('/(tabs)');
  }

  function onAdjust(): void {
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Dimmed background to simulate modal */}
      <View style={styles.backdrop} />
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.checkCircle}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>

        <Text style={styles.label}>Your Daily Goal</Text>
        <Text style={styles.kcal}>{calorieGoal.toLocaleString()} kcal/day</Text>
        <Text style={styles.description}>
          Based on your age, weight, height, and activity level
        </Text>

        <Button
          mode="contained"
          buttonColor={Colors.primary}
          style={styles.btn}
          contentStyle={styles.btnContent}
          onPress={onLooksGood}
        >
          Looks good!
        </Button>

        <TouchableOpacity onPress={onAdjust} style={styles.adjustBtn}>
          <Text style={styles.adjustText}>Adjust</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.bgPage,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.XL,
    alignItems: 'center',
    paddingBottom: SPACING.XXL,
  },
  handle: { width: 40, height: 4, backgroundColor: Colors.bgCard, borderRadius: 2, marginBottom: SPACING.XL },
  checkCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primary + '20', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.LG },
  checkIcon: { fontSize: 28, color: Colors.primary },
  label: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary, marginBottom: SPACING.XS },
  kcal: { fontSize: 36, fontWeight: FONT_WEIGHT.BOLD, color: Colors.primary, marginBottom: SPACING.SM },
  description: { fontSize: FONT_SIZE.SM, color: Colors.textSecondary, textAlign: 'center', marginBottom: SPACING.XL, lineHeight: 20 },
  btn: { width: '100%', borderRadius: 8, marginBottom: SPACING.MD },
  btnContent: { paddingVertical: SPACING.XS },
  adjustBtn: { paddingVertical: SPACING.SM },
  adjustText: { fontSize: FONT_SIZE.MD, color: Colors.textSecondary },
});
```

> **iOS note:** `SafeAreaView` with `backgroundColor: transparent` may not clip correctly on all iOS versions. If the backdrop doesn't render as expected, switch to React Native Paper's `<Modal>` component: `<Modal visible dismissable={false} contentContainerStyle={styles.sheet}>`. Test on a physical device or simulator.

- [ ] **Step 2: Commit**
```bash
git add mobile/screens/Onboarding/Result/
git commit -m "feat: add Onboarding Result screen"
```

---

## Task 19: Final TypeScript Check + Verification

- [ ] **Step 1: Full TypeScript check**
```bash
cd mobile && npx tsc --noEmit
```
Fix any errors before proceeding.

- [ ] **Step 2: Confirm Colors exports are complete**

`mobile/constants/Colors.ts` (the `palette` object) already has: `primary`, `error`, `border`, `bgPage`, `bgCard`, `textPrimary`, `textSecondary`, `protein`, `fat`, `carbs`. Nothing additional needs to be added — Task 0 adds the named `Colors` export so all screen imports resolve correctly.

- [ ] **Step 3: Visual verification using Pencil screenshots**

Take screenshots of each implemented screen and compare against Pencil frames:
- Login: compare with `hJehG`
- Register: compare with `aEl5B`
- Forgot Password: compare with `e6so7`
- Email Sent: compare with `YLynG`
- Onboarding Welcome: compare with `g1vCy`
- Onboarding Features: compare with `qjY7y`
- Onboarding Method: compare with `J6KhR`
- Personal Data: compare with `lYN1g`
- Activity & Goal: compare with `zO0Iw`
- Manual Entry: compare with `wk8D7`
- Result Modal: compare with `Oh9oq`

- [ ] **Step 4: Flow verification (manual)**

1. Launch app → Register → lands on Onboarding Welcome → complete all steps → lands on Home
2. Launch app → Login → lands on Home (skips onboarding — `hasCompletedOnboarding = true`)
3. Login screen → "Forgot password?" → Forgot Password → Email Sent → Back to Login

- [ ] **Step 5: Final commit**
```bash
git add -p  # stage any remaining changes
git commit -m "feat: complete Epic 02 — auth/onboarding redesign"
```

---

## Notes for Implementer

- `Colors.border` and `Colors.error` may need to be added to `Colors.ts` (check before using)
- The `(onboarding)` route group must be registered in `mobile/app/_layout.tsx` — add a Stack screen for it if not auto-discovered
- `useAuthGate` uses `useEffect` — ensure dependency array includes `hasCompletedOnboarding`
- All `router.replace` to `/(tabs)` will fail until `(tabs)` group exists — this is expected; the tab group exists from prior work
- The existing `ProfileCompletion` screen and `profile-completion` route can remain for now — they are superseded but not deleted until Epic 09
