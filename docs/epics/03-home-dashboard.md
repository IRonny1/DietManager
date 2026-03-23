# Epic 03 — Home Dashboard

**Depends on:** Epic 01 (Design Foundation), Epic 02 (Auth & Onboarding)

## Goal

Implement the Home tab screen with a daily calorie summary, macro breakdown, and today's meal list. Replace the current placeholder with a fully functional dashboard.

## Design Reference (Pencil frames)

| Frame Name | ID |
|---|---|
| Home | `RKbm2` |
| Home / Empty State | `UGGu7` |

Use `mcp__pencil__get_screenshot({ filePath: "diet-manager.pen", nodeId: "RKbm2" })` to view the design.

## Screen Layout

```
[Status bar]

Good Morning, Alex          ← greeting with time-of-day
Wednesday, March 19         ← current date

┌─────────────────────────┐
│      [Calorie Ring]      │   ← donut chart
│         1,248            │
│       / 2,100 kcal       │
└─────────────────────────┘

┌────────┬────────┬────────┐
│Protein │  Fat   │ Carbs  │   ← macro bar
│  82g   │  45g   │  156g  │
│ green  │ orange │  blue  │
└────────┴────────┴────────┘

Today's Meals           See All →
┌─────────────────────────┐
│ [img] Breakfast         │   ← meal card
│       Oatmeal w/ Berries│
│       320 kcal · 8:30AM │
└─────────────────────────┘
┌─────────────────────────┐
│ [img] Lunch             │
│       Grilled Chicken   │
│       528 kcal · 12:45PM│
└─────────────────────────┘
...

[Tab Bar: HOME | HISTORY | SCAN | STATS | PROFILE]
```

**Empty state** (no meals logged today):
```
[Illustrated empty plate icon]
"No meals logged yet"
"Tap the scan button to add your first meal"

[Scan Food button]  ← navigates to Scan tab
```

## Data Layer

### Types (`mobile/types/diary.types.ts`)

```typescript
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
  loggedAt: string;  // ISO datetime string
  date: string;      // YYYY-MM-DD
}

export interface DailyLog {
  date: string;
  meals: MealEntry[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  calorieGoal: number;
}
```

### Service (`mobile/services/diary.service.ts`)

```typescript
// In-memory store for now (replaced by API in Epic 09)
let meals: MealEntry[] = [];

export function getTodayMeals(): Promise<MealEntry[]>
export function getMeals(dateRange: { from: string; to: string }): Promise<MealEntry[]>
export function addMeal(meal: Omit<MealEntry, 'id'>): Promise<MealEntry>
export function updateMeal(id: string, updates: Partial<MealEntry>): Promise<MealEntry>
export function deleteMeal(id: string): Promise<void>
```

### Hook (`mobile/screens/Home/hooks/useHome.ts`)

```typescript
function useHome(): {
  dailyLog: DailyLog | null;
  isLoading: boolean;
  calorieGoal: number;
  greeting: string;       // "Good Morning", "Good Afternoon", etc.
  formattedDate: string;  // "Wednesday, March 19"
  hasMeals: boolean;
  handleSeeAllPress: () => void;  // navigates to History tab
  handleScanPress: () => void;    // navigates to Scan tab
}
```

Greeting logic:
- 5am–11:59am → "Good Morning"
- 12pm–4:59pm → "Good Afternoon"
- 5pm–9:59pm → "Good Evening"
- 10pm–4:59am → "Good Night"

Calorie goal comes from `useProfileStore` (set during onboarding).

## Calorie Ring Component

Create: `mobile/components/CalorieRing/CalorieRing.tsx`

A donut chart showing consumed vs goal. Use `react-native-svg` (already a React Native common dep) to draw:
- Gray background ring (full circle)
- Green progress arc (percentage consumed)
- Center text: calories consumed (large, bold) + "/ 2,100 kcal" (small, gray)

Props:
```typescript
type CalorieRingProps = {
  consumed: number;
  goal: number;
  size?: number;       // default 160
  strokeWidth?: number; // default 16
};
```

## Macro Bar Component

Create: `mobile/components/MacroBar/MacroBar.tsx`

Three equal columns showing protein, fat, carbs:
- Label (small, gray)
- Value (large, bold, colored: green/orange/blue per Pencil design)

Props:
```typescript
type MacroBarProps = {
  protein: number;
  fat: number;
  carbs: number;
};
```

## Meal Card Component

Create: `mobile/components/MealCard/MealCard.tsx`

Horizontal card with:
- Square food image (placeholder if no `imageUri`)
- Meal category label (small, gray)
- Meal name (medium, bold)
- Calories + time (small, gray)

Props:
```typescript
type MealCardProps = {
  meal: MealEntry;
  onPress: () => void;
};
```

## Screen Component (`mobile/screens/Home/Home.tsx`)

```tsx
function Home() {
  const { dailyLog, isLoading, greeting, formattedDate, hasMeals,
          handleSeeAllPress, handleScanPress } = useHome();

  if (isLoading) return <LoadingSpinner />;

  return (
    <ScrollView>
      <Header greeting={greeting} date={formattedDate} />
      <CalorieRing consumed={dailyLog.totalCalories} goal={dailyLog.calorieGoal} />
      <MacroBar protein={dailyLog.totalProtein} fat={dailyLog.totalFat} carbs={dailyLog.totalCarbs} />

      <SectionHeader title="Today's Meals" onSeeAll={handleSeeAllPress} />

      {hasMeals ? (
        dailyLog.meals.map(meal => (
          <MealCard key={meal.id} meal={meal} onPress={() => {}} />
        ))
      ) : (
        <EmptyState onScanPress={handleScanPress} />
      )}
    </ScrollView>
  );
}
```

## Navigation Updates

Update `app/(tabs)/index.tsx` to render `<Home />`.

The "See All" link and empty state scan button use `router.push()` from Expo Router:
- See All → `/(tabs)/history`
- Scan CTA → `/(tabs)/scan`

## Tab Bar

The tab bar (HOME | HISTORY | SCAN | STATS | PROFILE) is defined in `app/(tabs)/_layout.tsx`. Update tab icons and labels to match Pencil design:
- HOME: house icon
- HISTORY: clock/history icon
- SCAN: scan/camera icon (center, larger, filled circle background)
- STATS: bar chart icon
- PROFILE: person icon

The SCAN tab should have a distinctive look (green circle, white icon) per the Pencil design.

## Files to Create / Modify

```
# New types
mobile/types/diary.types.ts

# New service
mobile/services/diary.service.ts

# New hook
mobile/screens/Home/hooks/useHome.ts

# New components
mobile/components/CalorieRing/CalorieRing.tsx
mobile/components/MacroBar/MacroBar.tsx
mobile/components/MealCard/MealCard.tsx

# New screen
mobile/screens/Home/Home.tsx

# Modify
mobile/app/(tabs)/index.tsx
mobile/app/(tabs)/_layout.tsx   ← update tab bar styling
```

## Tests to Suggest

- `diary.service.test.ts` — CRUD operations, date filtering
- `useHome.test.ts` — greeting logic, date formatting, calorie/macro aggregation
- `CalorieRing.ui.test.tsx` — renders ring with correct consumed/goal values
- `MealCard.ui.test.tsx` — renders meal info correctly

## Verification

1. Screenshot comparison: `get_screenshot` for frame `RKbm2` vs running app
2. With no meals: empty state shown with Scan CTA
3. With meals: calorie ring, macros, and meal list populate correctly
4. Greeting changes based on time of day
5. "See All" navigates to History tab
6. `npx tsc --noEmit` passes
