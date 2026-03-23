# Epic 06 — Statistics

**Depends on:** Epic 01 (Design Foundation), Epic 03 (Home Dashboard — needs `diary.service.ts`), Epic 08 (Water & Weight Tracking — needs `weightLog.service.ts`) or implement weight log service stub here.

## Goal

Implement the Statistics tab with two sub-tabs: Nutrition statistics (calorie/macro trends) and Body statistics (weight trend, BMI, measurements).

## Design Reference (Pencil frames)

| Frame Name | ID |
|---|---|
| Statistics / Nutrition | `O4TJb` |
| Statistics / Body | `WQspo` |

Use `mcp__pencil__get_screenshot` to view both frames before implementing.

## Chart Library

**Recommended: `react-native-gifted-charts`**
- Simpler API than Victory Native
- Good React Native support
- Supports bar charts, line charts, donut charts out of the box
- Install: `npm install react-native-gifted-charts react-native-linear-gradient`

Alternative: `victory-native` if more customization is needed.

**Decide before starting this epic** and add a note to CLAUDE.md.

## Statistics Tab Layout

```
Statistics              ← header

   [Mar 2026 ▾]        ← date period selector

[Nutrition]  [Body]     ← segment control
```

## Nutrition Sub-tab

```
Avg daily    On target    Streaks
1,847 kcal   5/7 days     12 days

─── Calorie Trend ──────────────────────
[Bar chart: 7 bars, one per day]
Avg: 1,847 ←

─── Macronutrient Trend ─────────────────
[Protein] [Fat] [Carbs]  ← toggle
[Bar chart: one bar per day]

─── Macronutrient Split ─────────────────
[Donut chart]
● Protein  28%
● Fat      20%
● Carbs    42%

─── Calories by Meal Type ───────────────
Breakfast  ████░░░░░  321 kcal (18%)
Lunch      ██████░░░  548 kcal (30%)
Dinner     █████░░░░  462 kcal (25%)
Snacks     ████░░░░░  300 kcal (16%)
```

## Body Sub-tab

```
Current      Change       Goal
75.5 kg     -0.5 kg      50%

─── Weight Trend ────────────────────────
Goal: 75 kg →
[Line chart with goal line overlay]

─── Weight Log History ──────────────────
+ Add Entry
March 19, 2026    75.5 kg   ↓ -0.2 kg
March 16, 2026    75.3 kg   ↓ -0.2 kg
March 12, 2026    75.5 kg   ↓ -0.2 kg
[View All Entries]

─── Body Measurements ───────────────────
[Expandable accordion]

─── BMI ─────────────────────────────────
24.2  Normal weight
[Color bar: Underweight | Normal | Overweight | Obese]
```

## Data Layer

### Statistics Service (`mobile/services/statistics.service.ts`)

```typescript
export interface NutritionStats {
  avgDailyCalories: number;
  onTargetDays: number;
  totalDays: number;
  currentStreak: number;
  calorieTrend: Array<{ date: string; calories: number }>;
  macroTrend: Array<{ date: string; protein: number; fat: number; carbs: number }>;
  macroSplit: { protein: number; fat: number; carbs: number };  // percentages
  caloriesByMealType: { breakfast: number; lunch: number; dinner: number; snacks: number };
}

export interface BodyStats {
  currentWeight: number;
  weightChange: number;      // kg since start
  goalWeight: number;
  progressPercent: number;
  weightTrend: Array<{ date: string; weight: number }>;
  bmi: number;
  bmiCategory: 'underweight' | 'normal' | 'overweight' | 'obese';
}

export function getNutritionStats(dateRange: { from: string; to: string }): Promise<NutritionStats>
export function getBodyStats(dateRange: { from: string; to: string }): Promise<BodyStats>
export function calculateBMI(weightKg: number, heightCm: number): number
export function getBMICategory(bmi: number): BodyStats['bmiCategory']
```

Aggregates from `diary.service.ts` and `weightLog.service.ts`.

### Weight Log Service Stub

If Epic 08 isn't done yet, create a minimal stub:

```typescript
// mobile/services/weightLog.service.ts
export interface WeightEntry {
  id: string;
  date: string;       // YYYY-MM-DD
  weightKg: number;
  note?: string;
}

let entries: WeightEntry[] = [];

export function getWeightEntries(dateRange?: { from: string; to: string }): Promise<WeightEntry[]>
export function addWeightEntry(entry: Omit<WeightEntry, 'id'>): Promise<WeightEntry>
export function deleteWeightEntry(id: string): Promise<void>
```

## Statistics Hook (`mobile/screens/Statistics/hooks/useStatistics.ts`)

```typescript
type StatTab = 'nutrition' | 'body';
type DatePeriod = 'week' | 'month' | 'custom';
type MacroFilter = 'protein' | 'fat' | 'carbs';

function useStatistics(): {
  activeTab: StatTab;
  activePeriod: DatePeriod;
  activeMacroFilter: MacroFilter;
  nutritionStats: NutritionStats | null;
  bodyStats: BodyStats | null;
  isLoading: boolean;
  periodLabel: string;              // "Mar 2026"
  handleTabChange: (tab: StatTab) => void;
  handlePeriodChange: (period: DatePeriod) => void;
  handleMacroFilterChange: (macro: MacroFilter) => void;
  handlePeriodPrevious: () => void;
  handlePeriodNext: () => void;
  handleAddWeightEntry: () => void;  // navigates to log weight modal
  handleViewAllWeightEntries: () => void;  // navigates to Weight Log screen
}
```

## Components

### Segment Control (`mobile/components/SegmentControl/SegmentControl.tsx`)

Nutrition / Body toggle. Reuse the `Component / Segment Control` from the Pencil design system.

```typescript
type SegmentControlProps = {
  options: Array<{ label: string; value: string }>;
  activeValue: string;
  onChange: (value: string) => void;
};
```

### Stat Card (`mobile/components/StatCard/StatCard.tsx`)

Small card showing a label + value + optional delta/unit. Already exists as a Pencil component (`Component / Stat Card`).

### BMI Scale (`mobile/components/BMIScale/BMIScale.tsx`)

Horizontal color bar with a marker at the current BMI position:
- Red: Underweight (< 18.5)
- Green: Normal (18.5–24.9)
- Orange: Overweight (25–29.9)
- Red: Obese (≥ 30)

## Screen Component (`mobile/screens/Statistics/Statistics.tsx`)

```tsx
function Statistics() {
  const { activeTab, activeStatistics, handleTabChange, ... } = useStatistics();

  return (
    <ScrollView>
      <Header title="Statistics" periodSelector={...} />
      <SegmentControl options={[
        { label: 'Nutrition', value: 'nutrition' },
        { label: 'Body', value: 'body' },
      ]} activeValue={activeTab} onChange={handleTabChange} />

      {activeTab === 'nutrition' ? (
        <NutritionView stats={nutritionStats} />
      ) : (
        <BodyView stats={bodyStats} />
      )}
    </ScrollView>
  );
}
```

Split into sub-components:
- `mobile/screens/Statistics/components/NutritionView.tsx`
- `mobile/screens/Statistics/components/BodyView.tsx`
- `mobile/screens/Statistics/components/WeightTrendChart.tsx`
- `mobile/screens/Statistics/components/CalorieTrendChart.tsx`
- `mobile/screens/Statistics/components/MacroSplitChart.tsx`

## Files to Create / Modify

```
# New service
mobile/services/statistics.service.ts
mobile/services/weightLog.service.ts   ← stub (full impl in Epic 08)

# New types (add to existing files or create)
mobile/types/statistics.types.ts

# New screen + sub-components
mobile/screens/Statistics/Statistics.tsx
mobile/screens/Statistics/hooks/useStatistics.ts
mobile/screens/Statistics/components/NutritionView.tsx
mobile/screens/Statistics/components/BodyView.tsx
mobile/screens/Statistics/components/WeightTrendChart.tsx
mobile/screens/Statistics/components/CalorieTrendChart.tsx
mobile/screens/Statistics/components/MacroSplitChart.tsx

# New components
mobile/components/SegmentControl/SegmentControl.tsx
mobile/components/StatCard/StatCard.tsx
mobile/components/BMIScale/BMIScale.tsx

# New route
mobile/app/(tabs)/stats.tsx
```

## Tests to Suggest

- `statistics.service.test.ts` — avg calories, streak counting, macro split calculation, BMI calculation
- `useStatistics.test.ts` — tab switching, period navigation, data loading
- `BMIScale.ui.test.tsx` — renders correct category label and color

## Verification

1. Screenshot comparison: Pencil frames `O4TJb` and `WQspo` vs running app
2. Nutrition tab: all 4 chart sections render with data
3. Macro trend toggle (Protein/Fat/Carbs) switches the bar chart data
4. Body tab: weight trend line chart renders, BMI displays with correct category
5. Period selector (week/month) updates all charts
6. "Add Entry" navigates to weight log modal
7. `npx tsc --noEmit` passes
