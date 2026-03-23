# Home Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Home tab screen with a calorie ring, macro bar, and today's meals list — replacing the current placeholder with a fully functional dashboard.

**Architecture:** Data flows from an in-memory `diary.service.ts` → `useHome` hook → `Home.tsx` screen → three reusable components (`CalorieRing`, `MacroBar`, `MealCard`). The tab navigation is expanded from 3 tabs to 5 (adding History and Stats placeholders, renaming Scan). No API calls yet — all data is in-memory until Epic 09.

**Tech Stack:** React Native + Expo Router, `react-native-svg` (new install) for the donut chart, Zustand (`useProfileStore` for calorie goal), `expo-symbols` for tab icons, design tokens from `constants/Colors.ts`, `constants/spacing.constants.ts`, `constants/typography.constants.ts`.

---

## Design Reference

- **Filled state** (`RKbm2`): Greeting + date → calorie donut → macro bar (3 cards) → "Today's Meals" + "See All" → meal cards
- **Empty state** (`UGGu7`): Same header → ring showing 0 → macro row → "No meals logged yet" empty state with "+ Add Meal" button (Pencil design is the source of truth per CLAUDE.md; the written spec text differs slightly but the design takes precedence)
- Macro colors from `palette` (use the palette constants, not hardcoded hex): `palette.protein` = blue `#2196F3`, `palette.fat` = orange `#FF9800`, `palette.carbs` = green `#4CAF50`
- Tab order: HOME | HISTORY | SCAN | STATS | PROFILE (SCAN tab has green circle background, white icon)

---

## File Map

```
# New (create)
mobile/types/diary.types.ts                             ← MealEntry, DailyLog interfaces
mobile/services/diary.service.ts                        ← in-memory CRUD service
mobile/screens/Home/hooks/useHome.ts                    ← greeting, dailyLog, navigation
mobile/components/CalorieRing/CalorieRing.tsx           ← SVG donut chart component
mobile/components/MacroBar/MacroBar.tsx                 ← 3-column macro display
mobile/components/MealCard/MealCard.tsx                 ← horizontal meal card
mobile/screens/Home/Home.tsx                            ← Home screen (uses all above)
mobile/app/(tabs)/scan.tsx                              ← Scan tab placeholder (replaces two.tsx)
mobile/app/(tabs)/history.tsx                           ← History tab placeholder
mobile/app/(tabs)/stats.tsx                             ← Stats tab placeholder

# Modify (existing)
mobile/app/(tabs)/index.tsx                             ← render <Home /> instead of placeholder
mobile/app/(tabs)/_layout.tsx                           ← 5 tabs, correct order, SCAN styling
```

---

## Task 1: Install react-native-svg

**Files:** none (dependency install)

- [ ] **Step 1: Install the package**

  ```bash
  cd /path/to/DietManager/mobile && npx expo install react-native-svg
  ```

  Expected: Package added to `package.json` dependencies, `node_modules/react-native-svg` present.

- [ ] **Step 2: Verify TypeScript types are available**

  ```bash
  cd mobile && npx tsc --noEmit 2>&1 | head -20
  ```

  Expected: No errors about missing `react-native-svg` types (they ship with the package).

---

## Task 2: Diary Types

**Files:**
- Create: `mobile/types/diary.types.ts`

- [ ] **Step 1: Create the types file**

  ```typescript
  // mobile/types/diary.types.ts

  export interface MealEntry {
    id: string;
    name: string;
    category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    calories: number;
    protein: number;   // grams
    fat: number;       // grams
    carbs: number;     // grams
    portionGrams: number;
    imageUri?: string;
    loggedAt: string;  // ISO datetime string, e.g. "2026-03-23T08:30:00Z"
    date: string;      // YYYY-MM-DD, e.g. "2026-03-23"
  }

  export interface DailyLog {
    date: string;          // YYYY-MM-DD
    meals: MealEntry[];
    totalCalories: number;
    totalProtein: number;
    totalFat: number;
    totalCarbs: number;
    calorieGoal: number;
  }
  ```

- [ ] **Step 2: Verify TypeScript**

  ```bash
  cd mobile && npx tsc --noEmit 2>&1 | grep diary
  ```

  Expected: No output (no errors).

---

## Task 3: Diary Service

**Files:**
- Create: `mobile/services/diary.service.ts`

The service uses an in-memory array as storage. It will be replaced by API calls in Epic 09.

- [ ] **Step 1: Create the service**

  ```typescript
  // mobile/services/diary.service.ts
  import type { MealEntry, DailyLog } from '@/types/diary.types';

  let meals: MealEntry[] = [
    {
      id: '1',
      name: 'Oatmeal with Berries',
      category: 'Breakfast',
      calories: 320,
      protein: 12,
      fat: 6,
      carbs: 58,
      portionGrams: 300,
      loggedAt: new Date().toISOString().replace(/T\d{2}:\d{2}.*/, 'T08:30:00.000Z'),
      date: new Date().toISOString().split('T')[0],
    },
    {
      id: '2',
      name: 'Grilled Chicken Salad',
      category: 'Lunch',
      calories: 528,
      protein: 48,
      fat: 22,
      carbs: 30,
      portionGrams: 450,
      loggedAt: new Date().toISOString().replace(/T\d{2}:\d{2}.*/, 'T12:45:00.000Z'),
      date: new Date().toISOString().split('T')[0],
    },
  ];

  let nextId = 3;

  export async function getTodayMeals(): Promise<MealEntry[]> {
    const today = new Date().toISOString().split('T')[0];
    return meals.filter((m) => m.date === today);
  }

  export async function getMeals(dateRange: { from: string; to: string }): Promise<MealEntry[]> {
    return meals.filter((m) => m.date >= dateRange.from && m.date <= dateRange.to);
  }

  export async function addMeal(meal: Omit<MealEntry, 'id'>): Promise<MealEntry> {
    const newMeal: MealEntry = { ...meal, id: String(nextId++) };
    meals = [...meals, newMeal];
    return newMeal;
  }

  export async function updateMeal(id: string, updates: Partial<MealEntry>): Promise<MealEntry> {
    const index = meals.findIndex((m) => m.id === id);
    if (index === -1) throw new Error(`Meal ${id} not found`);
    const updated = { ...meals[index], ...updates };
    meals = meals.map((m) => (m.id === id ? updated : m));
    return updated;
  }

  export async function deleteMeal(id: string): Promise<void> {
    meals = meals.filter((m) => m.id !== id);
  }
  ```

  > Note: Seed data is pre-filled for today's date so the UI renders populated state immediately during development. The initializer uses `toISOString().replace(...)` to pin the `loggedAt` time while keeping the date dynamic.

- [ ] **Step 2: Verify TypeScript**

  ```bash
  cd mobile && npx tsc --noEmit 2>&1 | grep diary
  ```

  Expected: No output.

---

## Task 4: CalorieRing Component

**Files:**
- Create: `mobile/components/CalorieRing/CalorieRing.tsx`

Renders an SVG donut chart using `react-native-svg`. Uses stroke-dasharray/dashoffset technique to draw a partial arc.

- [ ] **Step 1: Create the component**

  ```typescript
  // mobile/components/CalorieRing/CalorieRing.tsx
  import React from 'react';
  import { View, StyleSheet } from 'react-native';
  import Svg, { Circle } from 'react-native-svg';
  import { Text } from 'react-native-paper';

  import { palette } from '@/constants/Colors';
  import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

  type CalorieRingProps = {
    consumed: number;
    goal: number;
    size?: number;
    strokeWidth?: number;
  };

  export function CalorieRing({
    consumed,
    goal,
    size = 160,
    strokeWidth = 16,
  }: CalorieRingProps): React.JSX.Element {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = goal > 0 ? Math.min(consumed / goal, 1) : 0;
    const strokeDashoffset = circumference - progress * circumference;
    const center = size / 2;

    return (
      <View style={styles.container}>
        <Svg width={size} height={size}>
          {/* Background track */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={palette.textDisabled}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress arc */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={palette.primary}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${center}, ${center}`}
          />
        </Svg>
        <View style={[styles.centerLabel, { width: size, height: size }]}>
          <Text style={styles.caloriesText}>{consumed.toLocaleString()}</Text>
          <Text style={styles.goalText}>/ {goal.toLocaleString()} kcal</Text>
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerLabel: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },
    caloriesText: {
      fontSize: FONT_SIZE.XXL,
      fontWeight: FONT_WEIGHT.BOLD,
      color: palette.textPrimary,
    },
    goalText: {
      fontSize: FONT_SIZE.SM,
      color: palette.textSecondary,
    },
  });
  ```

- [ ] **Step 2: Verify TypeScript**

  ```bash
  cd mobile && npx tsc --noEmit 2>&1 | grep CalorieRing
  ```

  Expected: No output.

---

## Task 5: MacroBar Component

**Files:**
- Create: `mobile/components/MacroBar/MacroBar.tsx`

Three equal-width columns, each showing label + colored gram value, on a card background.

- [ ] **Step 1: Create the component**

  ```typescript
  // mobile/components/MacroBar/MacroBar.tsx
  import React from 'react';
  import { View, StyleSheet } from 'react-native';
  import { Text } from 'react-native-paper';

  import { palette } from '@/constants/Colors';
  import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
  import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

  type MacroBarProps = {
    protein: number;
    fat: number;
    carbs: number;
  };

  type MacroItemProps = {
    label: string;
    value: number;
    color: string;
  };

  function MacroItem({ label, value, color }: MacroItemProps): React.JSX.Element {
    return (
      <View style={styles.item}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color }]}>{value}g</Text>
      </View>
    );
  }

  export function MacroBar({ protein, fat, carbs }: MacroBarProps): React.JSX.Element {
    return (
      <View style={styles.container}>
        <MacroItem label="Protein" value={protein} color={palette.protein} />
        <MacroItem label="Fat" value={fat} color={palette.fat} />
        <MacroItem label="Carbs" value={carbs} color={palette.carbs} />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: SPACING.SM,
    },
    item: {
      flex: 1,
      backgroundColor: palette.bgCard,
      borderRadius: BORDER_RADIUS.MD,
      paddingVertical: SPACING.MD,
      paddingHorizontal: SPACING.SM,
      alignItems: 'center',
      gap: SPACING.XS,
    },
    label: {
      fontSize: FONT_SIZE.XS,
      color: palette.textSecondary,
    },
    value: {
      fontSize: FONT_SIZE.LG,
      fontWeight: FONT_WEIGHT.BOLD,
    },
  });
  ```

- [ ] **Step 2: Verify TypeScript**

  ```bash
  cd mobile && npx tsc --noEmit 2>&1 | grep MacroBar
  ```

  Expected: No output.

---

## Task 6: MealCard Component

**Files:**
- Create: `mobile/components/MealCard/MealCard.tsx`

Horizontal card: square food image (or placeholder) on the left, category/name/calories+time on the right. Tappable.

- [ ] **Step 1: Create the component**

  ```typescript
  // mobile/components/MealCard/MealCard.tsx
  import React from 'react';
  import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
  import { Text } from 'react-native-paper';

  import type { MealEntry } from '@/types/diary.types';
  import { palette } from '@/constants/Colors';
  import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
  import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

  type MealCardProps = {
    meal: MealEntry;
    onPress: () => void;
  };

  function formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  export function MealCard({ meal, onPress }: MealCardProps): React.JSX.Element {
    return (
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.imageWrapper}>
          {meal.imageUri ? (
            <Image source={{ uri: meal.imageUri }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]} />
          )}
        </View>
        <View style={styles.content}>
          <Text style={styles.category}>{meal.category}</Text>
          <Text style={styles.name}>{meal.name}</Text>
          <Text style={styles.meta}>
            {meal.calories} kcal · {formatTime(meal.loggedAt)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  const IMAGE_SIZE = 64;

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.MD,
      gap: SPACING.MD,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
    },
    imageWrapper: {
      flexShrink: 0,
    },
    image: {
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
      borderRadius: BORDER_RADIUS.SM,
    },
    imagePlaceholder: {
      backgroundColor: palette.bgCard,
    },
    content: {
      flex: 1,
      gap: 2,
    },
    category: {
      fontSize: FONT_SIZE.XS,
      color: palette.textSecondary,
    },
    name: {
      fontSize: FONT_SIZE.MD,
      fontWeight: FONT_WEIGHT.SEMIBOLD,
      color: palette.textPrimary,
    },
    meta: {
      fontSize: FONT_SIZE.SM,
      color: palette.textSecondary,
    },
  });
  ```

- [ ] **Step 2: Verify TypeScript**

  ```bash
  cd mobile && npx tsc --noEmit 2>&1 | grep MealCard
  ```

  Expected: No output.

---

## Task 7: useHome Hook

**Files:**
- Create: `mobile/screens/Home/hooks/useHome.ts`

Fetches today's meals from the diary service, derives DailyLog totals, generates greeting and formatted date, reads calorie goal from the profile store, and exposes navigation handlers.

- [ ] **Step 1: Create the hook**

  ```typescript
  // mobile/screens/Home/hooks/useHome.ts
  import { useState, useEffect, useCallback } from 'react';

  import { useRouter } from 'expo-router';

  import { getTodayMeals } from '@/services/diary.service';
  import { useAuthStore } from '@/stores/useAuthStore';
  import { useProfileStore } from '@/stores/useProfileStore';
  import type { MealEntry, DailyLog } from '@/types/diary.types';

  type UseHomeReturn = {
    dailyLog: DailyLog | null;
    isLoading: boolean;
    greeting: string;
    userName: string;        // first name from auth store; defaults to "Alex" until Epic 07
    formattedDate: string;
    hasMeals: boolean;
    handleSeeAllPress: () => void;
    handleScanPress: () => void;
  };

  function getGreeting(hour: number): string {
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 22) return 'Good Evening';
    return 'Good Night';
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }

  function buildDailyLog(meals: MealEntry[], calorieGoal: number): DailyLog {
    const today = new Date().toISOString().split('T')[0];
    return {
      date: today,
      meals,
      totalCalories: meals.reduce((sum, m) => sum + m.calories, 0),
      totalProtein: meals.reduce((sum, m) => sum + m.protein, 0),
      totalFat: meals.reduce((sum, m) => sum + m.fat, 0),
      totalCarbs: meals.reduce((sum, m) => sum + m.carbs, 0),
      calorieGoal,
    };
  }

  const DEFAULT_CALORIE_GOAL = 2000;

  export function useHome(): UseHomeReturn {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const onboardingData = useProfileStore((state) => state.onboardingData);
    const calorieGoal = onboardingData?.calorieGoal ?? DEFAULT_CALORIE_GOAL;

    const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const now = new Date();
    const greeting = getGreeting(now.getHours());
    const formattedDate = formatDate(now);

    useEffect(() => {
      let cancelled = false;

      setIsLoading(true);
      getTodayMeals()
        .then((meals) => {
          if (!cancelled) {
            setDailyLog(buildDailyLog(meals, calorieGoal));
          }
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });

      return () => {
        cancelled = true;
      };
    }, [calorieGoal]);

    const handleSeeAllPress = useCallback((): void => {
      router.push('/(tabs)/history');
    }, [router]);

    const handleScanPress = useCallback((): void => {
      router.push('/(tabs)/scan');
    }, [router]);

    // Extract first name from the user's full name; fall back to "there"
    // until Epic 07 wires in a dedicated firstName field.
    const userName = user?.email?.split('@')[0] ?? 'Alex';

    return {
      dailyLog,
      isLoading,
      greeting,
      userName,
      formattedDate,
      hasMeals: (dailyLog?.meals.length ?? 0) > 0,
      handleSeeAllPress,
      handleScanPress,
    };
  }
  ```

- [ ] **Step 2: Verify TypeScript**

  ```bash
  cd mobile && npx tsc --noEmit 2>&1 | grep useHome
  ```

  Expected: No output.

---

## Task 8: Home Screen

**Files:**
- Create: `mobile/screens/Home/Home.tsx`

The screen assembles all components. It renders a loading state, then either the full dashboard or the empty state based on `hasMeals`.

- [ ] **Step 1: Create the screen**

  ```typescript
  // mobile/screens/Home/Home.tsx
  import React from 'react';
  import { ScrollView, View, StyleSheet, TouchableOpacity } from 'react-native';
  import { Text, ActivityIndicator, Button } from 'react-native-paper';

  import { useHome } from './hooks/useHome';
  import { CalorieRing } from '@/components/CalorieRing/CalorieRing';
  import { MacroBar } from '@/components/MacroBar/MacroBar';
  import { MealCard } from '@/components/MealCard/MealCard';
  import { palette } from '@/constants/Colors';
  import { SPACING } from '@/constants/spacing.constants';
  import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

  export function Home(): React.JSX.Element {
    const {
      dailyLog,
      isLoading,
      greeting,
      userName,
      formattedDate,
      hasMeals,
      handleSeeAllPress,
      handleScanPress,
    } = useHome();

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      );
    }

    const log = dailyLog!;

    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting}, {userName}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        {/* Calorie Ring */}
        <View style={styles.ringContainer}>
          <CalorieRing consumed={log.totalCalories} goal={log.calorieGoal} />
        </View>

        {/* Macro Bar */}
        <MacroBar protein={log.totalProtein} fat={log.totalFat} carbs={log.totalCarbs} />

        {/* Meals Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          {hasMeals && (
            <TouchableOpacity onPress={handleSeeAllPress}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          )}
        </View>

        {hasMeals ? (
          log.meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} onPress={() => {}} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🍽</Text>
            <Text style={styles.emptyTitle}>No meals logged yet</Text>
            <Text style={styles.emptySubtitle}>Tap + to add your first meal of the day</Text>
            <Button
              mode="contained"
              onPress={handleScanPress}
              style={styles.addMealButton}
              contentStyle={styles.addMealButtonContent}
            >
              + Add Meal
            </Button>
          </View>
        )}
      </ScrollView>
    );
  }

  const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scroll: {
      flex: 1,
      backgroundColor: palette.bgPage,
    },
    content: {
      paddingHorizontal: SPACING.LG,
      paddingTop: SPACING.LG,
      paddingBottom: SPACING.XXL,
    },
    header: {
      marginBottom: SPACING.XL,
    },
    greeting: {
      fontSize: FONT_SIZE.XL,
      fontWeight: FONT_WEIGHT.BOLD,
      color: palette.textPrimary,
    },
    date: {
      fontSize: FONT_SIZE.SM,
      color: palette.textSecondary,
      marginTop: 2,
    },
    ringContainer: {
      alignItems: 'center',
      marginBottom: SPACING.XL,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: SPACING.XL,
      marginBottom: SPACING.SM,
    },
    sectionTitle: {
      fontSize: FONT_SIZE.LG,
      fontWeight: FONT_WEIGHT.BOLD,
      color: palette.textPrimary,
    },
    seeAll: {
      fontSize: FONT_SIZE.SM,
      color: palette.textSecondary,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: SPACING.XXL,
      backgroundColor: palette.bgCard,
      borderRadius: 12,
      marginTop: SPACING.MD,
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: SPACING.MD,
    },
    emptyTitle: {
      fontSize: FONT_SIZE.LG,
      fontWeight: FONT_WEIGHT.SEMIBOLD,
      color: palette.textPrimary,
      marginBottom: SPACING.SM,
    },
    emptySubtitle: {
      fontSize: FONT_SIZE.SM,
      color: palette.textSecondary,
      textAlign: 'center',
      marginBottom: SPACING.LG,
    },
    addMealButton: {
      borderRadius: 24,
    },
    addMealButtonContent: {
      paddingHorizontal: SPACING.LG,
    },
  });
  ```

  > Note: `userName` is derived from `user.email` prefix (e.g. `"john@..."` → `"john"`) as a temporary fallback. Epic 07 will replace this with a proper `firstName` field from the auth/profile store.

- [ ] **Step 2: Verify TypeScript**

  ```bash
  cd mobile && npx tsc --noEmit 2>&1 | grep Home
  ```

  Expected: No output.

---

## Task 9: Update Tab Navigation

**Files:**
- Create: `mobile/app/(tabs)/scan.tsx`
- Create: `mobile/app/(tabs)/history.tsx`
- Create: `mobile/app/(tabs)/stats.tsx`
- Modify: `mobile/app/(tabs)/_layout.tsx`

Expand from 3 tabs to 5. Rename Scan from `two` to `scan`. Add History and Stats as placeholders. Apply SCAN tab's green circle styling.

- [ ] **Step 1: Create scan.tsx placeholder**

  ```typescript
  // mobile/app/(tabs)/scan.tsx
  import React from 'react';
  import { View, StyleSheet } from 'react-native';
  import { Text } from 'react-native-paper';

  export default function ScanScreen(): React.JSX.Element {
    return (
      <View style={styles.container}>
        <Text variant="headlineMedium">Scan</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Camera scan will appear here.
        </Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    subtitle: { opacity: 0.6, marginTop: 8 },
  });
  ```

- [ ] **Step 2: Create history.tsx placeholder**

  ```typescript
  // mobile/app/(tabs)/history.tsx
  import React from 'react';
  import { View, StyleSheet } from 'react-native';
  import { Text } from 'react-native-paper';

  export default function HistoryScreen(): React.JSX.Element {
    return (
      <View style={styles.container}>
        <Text variant="headlineMedium">History</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Meal history will appear here.
        </Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    subtitle: { opacity: 0.6, marginTop: 8 },
  });
  ```

- [ ] **Step 3: Create stats.tsx placeholder**

  ```typescript
  // mobile/app/(tabs)/stats.tsx
  import React from 'react';
  import { View, StyleSheet } from 'react-native';
  import { Text } from 'react-native-paper';

  export default function StatsScreen(): React.JSX.Element {
    return (
      <View style={styles.container}>
        <Text variant="headlineMedium">Stats</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Nutrition statistics will appear here.
        </Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    subtitle: { opacity: 0.6, marginTop: 8 },
  });
  ```

- [ ] **Step 4: Replace _layout.tsx with 5-tab configuration**

  Rewrite `mobile/app/(tabs)/_layout.tsx` entirely:

  ```typescript
  // mobile/app/(tabs)/_layout.tsx
  import React from 'react';
  import { View } from 'react-native';
  import { SymbolView } from 'expo-symbols';
  import { Tabs } from 'expo-router';

  import ColorSchemes, { palette } from '@/constants/Colors';
  import { useColorScheme } from '@/components/useColorScheme';
  import { useClientOnlyValue } from '@/components/useClientOnlyValue';

  export default function TabLayout(): React.JSX.Element {
    const colorScheme = useColorScheme();

    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: ColorSchemes[colorScheme].tint,
          headerShown: useClientOnlyValue(false, true),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <SymbolView
                name={{ ios: 'house.fill', android: 'home', web: 'home' }}
                tintColor={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color }) => (
              <SymbolView
                name={{ ios: 'clock.fill', android: 'history', web: 'history' }}
                tintColor={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="scan"
          options={{
            title: '',
            tabBarIcon: () => (
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: palette.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <SymbolView
                  name={{
                    ios: 'barcode.viewfinder',
                    android: 'qr_code_scanner',
                    web: 'qr_code_scanner',
                  }}
                  tintColor={palette.white}
                  size={26}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: 'Stats',
            tabBarIcon: ({ color }) => (
              <SymbolView
                name={{ ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' }}
                tintColor={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <SymbolView
                name={{ ios: 'person.fill', android: 'person', web: 'person' }}
                tintColor={color}
                size={24}
              />
            ),
          }}
        />
        {/* Hide old placeholder tab from tab bar */}
        <Tabs.Screen name="two" options={{ href: null }} />
      </Tabs>
    );
  }
  ```

  > Note: `two.tsx` is hidden via `href: null` so it stays off the tab bar without needing a file delete. **`two.tsx` must keep its existing valid default export** — Metro will error if the file exists but doesn't export a component. The SCAN tab's circular icon floats above the bar using negative `marginBottom`.

- [ ] **Step 5: Verify TypeScript**

  ```bash
  cd mobile && npx tsc --noEmit 2>&1 | grep -E "layout|tabs"
  ```

  Expected: No output.

---

## Task 10: Wire index.tsx to Home Screen

**Files:**
- Modify: `mobile/app/(tabs)/index.tsx`

Replace the placeholder content with the `<Home />` screen component.

- [ ] **Step 1: Replace index.tsx content**

  ```typescript
  // mobile/app/(tabs)/index.tsx
  import React from 'react';

  import { Home } from '@/screens/Home/Home';

  export default function HomeTab(): React.JSX.Element {
    return <Home />;
  }
  ```

- [ ] **Step 2: Run full TypeScript check**

  ```bash
  cd mobile && npx tsc --noEmit
  ```

  Expected: Zero errors.

- [ ] **Step 3: Start the dev server and visually verify**

  ```bash
  cd mobile && npx expo start
  ```

  Verify in simulator:
  1. Home tab shows greeting + date, calorie ring with seed data, macro bar, two meal cards
  2. Remove seed data from `diary.service.ts` (clear `meals` array to `[]`) → empty state appears with "+ Add Meal" button
  3. Restore seed data
  4. Tab bar shows 5 tabs: HOME | HISTORY | SCAN | STATS | PROFILE
  5. SCAN tab has green circle icon elevated above the bar
  6. Tapping "See All" navigates to History tab
  7. Tapping "+ Add Meal" in empty state navigates to Scan tab

---

## Suggested Tests (do not implement — author's responsibility)

Per project conventions, new services and hooks need tests. Suggest the following:

### `mobile/services/diary.service.test.ts`
- `getTodayMeals()` returns only meals with today's date
- `addMeal()` assigns a unique id and appends to the list
- `updateMeal()` applies partial updates without affecting other meals
- `deleteMeal()` removes the meal by id
- `getMeals({ from, to })` returns meals within the date range only

### `mobile/screens/Home/hooks/useHome.test.ts`
- `getGreeting()` returns correct string for each hour range (5am, 12pm, 5pm, 10pm edge cases)
- `buildDailyLog()` sums calories/protein/fat/carbs correctly across multiple meals
- `useHome()` sets `hasMeals: false` when service returns empty array
- `useHome()` sets `hasMeals: true` when service returns at least one meal
- `useHome()` uses `DEFAULT_CALORIE_GOAL` when `onboardingData.calorieGoal` is undefined

### `mobile/components/CalorieRing/CalorieRing.ui.test.tsx`
- Renders consumed value and goal text in center
- Caps progress arc at 100% when `consumed > goal`
- Renders background track always visible

### `mobile/components/MealCard/MealCard.ui.test.tsx`
- Renders meal name, category, calories, and formatted time
- Shows placeholder view when `imageUri` is undefined
- Calls `onPress` when tapped

---

## Verification Checklist

- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] Home screen matches `get_screenshot({ filePath: "diet-manager.pen", nodeId: "RKbm2" })`
- [ ] Empty state (clear seed meals) matches frame `UGGu7`
- [ ] Greeting changes based on device time
- [ ] "See All" navigates to History tab
- [ ] "+ Add Meal" in empty state navigates to Scan tab
- [ ] Tab bar shows exactly 5 tabs in order: HOME | HISTORY | SCAN | STATS | PROFILE
- [ ] SCAN tab icon is white on green circle, elevated above the bar
