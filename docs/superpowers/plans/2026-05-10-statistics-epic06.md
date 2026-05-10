# Epic 06 — Statistics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Statistics tab with Nutrition and Body sub-tabs, using react-native-gifted-charts for bar/line/donut charts, a period selector (week/month), and a SegmentControl to switch between sub-tabs.

**Architecture:** Statistics screen → `useStatistics` hook (state, period navigation, data fetching) → `statistics.service.ts` (aggregation) + `weightLog.service.ts` (stub) → sub-components per chart type (CalorieTrendChart, MacroSplitChart, WeightTrendChart) and two view containers (NutritionView, BodyView). Reusable shared components: SegmentControl, StatCard, BMIScale.

**Tech Stack:** React Native + Expo Router, react-native-gifted-charts (BarChart/LineChart/PieChart), expo-linear-gradient, react-native-svg (BMIScale), React Native Paper, TypeScript.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `mobile/types/statistics.types.ts` | Create | NutritionStats, BodyStats, StatTab, DatePeriod, MacroFilter interfaces |
| `mobile/services/weightLog.service.ts` | Create | In-memory stub for weight entries (full impl in Epic 08) |
| `mobile/services/statistics.service.ts` | Create | calculateBMI, getBMICategory, getMacroSplit, calculateStreak, getNutritionStats, getBodyStats |
| `mobile/components/SegmentControl/SegmentControl.tsx` | Create | Reusable pill-style toggle for two-option selection |
| `mobile/components/StatCard/StatCard.tsx` | Create | Small card: label + value + optional unit/delta |
| `mobile/components/BMIScale/BMIScale.tsx` | Create | Horizontal colour bar with marker at BMI position (SVG) |
| `mobile/screens/Statistics/hooks/useStatistics.ts` | Create | State, period navigation, data fetch, handler callbacks |
| `mobile/screens/Statistics/components/CalorieTrendChart.tsx` | Create | BarChart wrapper — daily calorie values |
| `mobile/screens/Statistics/components/MacroSplitChart.tsx` | Create | Donut PieChart wrapper — macro percentages |
| `mobile/screens/Statistics/components/WeightTrendChart.tsx` | Create | LineChart wrapper — weight over time with goal line |
| `mobile/screens/Statistics/components/NutritionView.tsx` | Create | Nutrition sub-tab: summary cards + 4 chart sections |
| `mobile/screens/Statistics/components/BodyView.tsx` | Create | Body sub-tab: summary cards + weight log + BMI |
| `mobile/screens/Statistics/Statistics.tsx` | Create | Root screen: header, period nav, SegmentControl, views |
| `mobile/app/(tabs)/stats.tsx` | Modify | Replace placeholder with Statistics screen |

---

### Task 1: Install Chart Library

**Files:**
- Modify: `mobile/package.json` (via npm install)

- [ ] **Step 1: Install dependencies**

```bash
cd /Users/tarasrospodniuk/IdeaProjects/DietManager/mobile
npx expo install expo-linear-gradient
npm install react-native-gifted-charts
```

- [ ] **Step 2: Verify installation resolves**

```bash
node -e "require('react-native-gifted-charts'); console.log('ok')"
```

Expected output: `ok`

- [ ] **Step 3: Commit**

```bash
git add mobile/package.json mobile/package-lock.json
git commit -m "chore: install react-native-gifted-charts and expo-linear-gradient for Epic 06"
```

---

### Task 2: Statistics Types

**Files:**
- Create: `mobile/types/statistics.types.ts`

- [ ] **Step 1: Create types file**

```typescript
// mobile/types/statistics.types.ts
export interface NutritionStats {
  avgDailyCalories: number;
  onTargetDays: number;
  totalDays: number;
  currentStreak: number;
  calorieTrend: Array<{ date: string; calories: number }>;
  macroTrend: Array<{ date: string; protein: number; fat: number; carbs: number }>;
  macroSplit: { protein: number; fat: number; carbs: number };
  caloriesByMealType: { breakfast: number; lunch: number; dinner: number; snacks: number };
}

export interface BodyStats {
  currentWeight: number;
  weightChange: number;
  goalWeight: number;
  progressPercent: number;
  weightTrend: Array<{ date: string; weight: number }>;
  bmi: number;
  bmiCategory: 'underweight' | 'normal' | 'overweight' | 'obese';
}

export type StatTab = 'nutrition' | 'body';
export type DatePeriod = 'week' | 'month';
export type MacroFilter = 'protein' | 'fat' | 'carbs';
```

- [ ] **Step 2: Commit**

```bash
git add mobile/types/statistics.types.ts
git commit -m "feat(statistics): add statistics types"
```

---

### Task 3: Weight Log Service Stub

**Files:**
- Create: `mobile/services/weightLog.service.ts`

- [ ] **Step 1: Create service**

```typescript
// mobile/services/weightLog.service.ts
export interface WeightEntry {
  id: string;
  date: string;      // YYYY-MM-DD
  weightKg: number;
  note?: string;
}

let entries: WeightEntry[] = [
  { id: '1', date: '2026-05-08', weightKg: 75.5 },
  { id: '2', date: '2026-05-04', weightKg: 75.7 },
  { id: '3', date: '2026-04-30', weightKg: 76.0 },
  { id: '4', date: '2026-04-26', weightKg: 76.3 },
  { id: '5', date: '2026-04-22', weightKg: 76.5 },
];

export function getWeightEntries(
  dateRange?: { from: string; to: string },
): Promise<WeightEntry[]> {
  const filtered = dateRange
    ? entries.filter((e) => e.date >= dateRange.from && e.date <= dateRange.to)
    : entries;
  return Promise.resolve([...filtered].sort((a, b) => b.date.localeCompare(a.date)));
}

export function addWeightEntry(entry: Omit<WeightEntry, 'id'>): Promise<WeightEntry> {
  const newEntry: WeightEntry = { ...entry, id: Date.now().toString() };
  entries = [newEntry, ...entries];
  return Promise.resolve(newEntry);
}

export function deleteWeightEntry(id: string): Promise<void> {
  entries = entries.filter((e) => e.id !== id);
  return Promise.resolve();
}
```

- [ ] **Step 2: Suggest tests**

Suggested test file: `mobile/services/weightLog.service.test.ts`

Test cases to cover:
- `getWeightEntries()` with no range returns all entries sorted descending by date
- `getWeightEntries({ from, to })` filters to entries within date range (inclusive)
- `addWeightEntry()` makes the new entry appear in a subsequent `getWeightEntries()` call
- `deleteWeightEntry(id)` removes that entry; subsequent `getWeightEntries()` no longer contains it

- [ ] **Step 3: Commit**

```bash
git add mobile/services/weightLog.service.ts
git commit -m "feat(statistics): add weightLog service stub"
```

---

### Task 4: Statistics Service

**Files:**
- Create: `mobile/services/statistics.service.ts`

- [ ] **Step 1: Create service with all functions**

```typescript
// mobile/services/statistics.service.ts
import type { MealEntry } from '@/types/diary.types';
import type { NutritionStats, BodyStats } from '@/types/statistics.types';
import { getMeals } from '@/services/diary.service';
import { getWeightEntries } from '@/services/weightLog.service';

// These constants are mocked until Epic 09 wires real profile data.
const MOCK_CALORIE_GOAL = 2000;
const MOCK_GOAL_WEIGHT_KG = 72;
const MOCK_HEIGHT_CM = 175;

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function getBMICategory(bmi: number): BodyStats['bmiCategory'] {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

export function calculateMacroSplit(
  meals: MealEntry[],
): NutritionStats['macroSplit'] {
  const totals = meals.reduce(
    (acc, m) => ({ protein: acc.protein + m.protein, fat: acc.fat + m.fat, carbs: acc.carbs + m.carbs }),
    { protein: 0, fat: 0, carbs: 0 },
  );
  const total = totals.protein + totals.fat + totals.carbs;
  if (total === 0) return { protein: 0, fat: 0, carbs: 0 };
  return {
    protein: Math.round((totals.protein / total) * 100),
    fat: Math.round((totals.fat / total) * 100),
    carbs: Math.round((totals.carbs / total) * 100),
  };
}

export function calculateStreak(
  calorieTrend: Array<{ date: string; calories: number }>,
  calorieGoal: number,
): number {
  if (calorieTrend.length === 0) return 0;
  const sorted = [...calorieTrend].sort((a, b) => b.date.localeCompare(a.date));
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  let expectedDate = today;
  for (const day of sorted) {
    if (day.date !== expectedDate) break;
    if (day.calories >= calorieGoal * 0.8 && day.calories <= calorieGoal * 1.2) {
      streak++;
      const d = new Date(expectedDate + 'T00:00:00');
      d.setDate(d.getDate() - 1);
      expectedDate = d.toISOString().split('T')[0];
    } else {
      break;
    }
  }
  return streak;
}

export async function getNutritionStats(
  dateRange: { from: string; to: string },
): Promise<NutritionStats> {
  const meals = await getMeals(dateRange);

  const byDate = new Map<string, MealEntry[]>();
  for (const meal of meals) {
    if (!byDate.has(meal.date)) byDate.set(meal.date, []);
    byDate.get(meal.date)!.push(meal);
  }

  const calorieTrend = Array.from(byDate.entries()).map(([date, dayMeals]) => ({
    date,
    calories: dayMeals.reduce((sum, m) => sum + m.calories, 0),
  }));

  const macroTrend = Array.from(byDate.entries()).map(([date, dayMeals]) => ({
    date,
    protein: dayMeals.reduce((sum, m) => sum + m.protein, 0),
    fat: dayMeals.reduce((sum, m) => sum + m.fat, 0),
    carbs: dayMeals.reduce((sum, m) => sum + m.carbs, 0),
  }));

  const totalCalories = calorieTrend.reduce((sum, d) => sum + d.calories, 0);
  const totalDays = calorieTrend.length || 1;
  const avgDailyCalories = Math.round(totalCalories / totalDays);

  const onTargetDays = calorieTrend.filter(
    (d) => d.calories >= MOCK_CALORIE_GOAL * 0.8 && d.calories <= MOCK_CALORIE_GOAL * 1.2,
  ).length;

  const caloriesByMealType = { breakfast: 0, lunch: 0, dinner: 0, snacks: 0 };
  for (const meal of meals) {
    const cat = meal.category.toLowerCase();
    if (cat === 'breakfast') caloriesByMealType.breakfast += meal.calories;
    else if (cat === 'lunch') caloriesByMealType.lunch += meal.calories;
    else if (cat === 'dinner') caloriesByMealType.dinner += meal.calories;
    else caloriesByMealType.snacks += meal.calories;
  }

  return {
    avgDailyCalories,
    onTargetDays,
    totalDays,
    currentStreak: calculateStreak(calorieTrend, MOCK_CALORIE_GOAL),
    calorieTrend,
    macroTrend,
    macroSplit: calculateMacroSplit(meals),
    caloriesByMealType,
  };
}

export async function getBodyStats(
  dateRange: { from: string; to: string },
): Promise<BodyStats> {
  const [rangeEntries, allEntries] = await Promise.all([
    getWeightEntries(dateRange),
    getWeightEntries(),
  ]);

  const currentWeight = rangeEntries.length > 0 ? rangeEntries[0].weightKg : 0;
  const oldestWeight =
    allEntries.length > 0 ? allEntries[allEntries.length - 1].weightKg : currentWeight;
  const weightChange = Math.round((currentWeight - oldestWeight) * 10) / 10;

  const goalWeight = MOCK_GOAL_WEIGHT_KG;
  const totalToLose = oldestWeight - goalWeight;
  const progressPercent =
    totalToLose <= 0
      ? 100
      : Math.min(100, Math.round(((oldestWeight - currentWeight) / totalToLose) * 100));

  const weightTrend = [...rangeEntries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(({ date, weightKg }) => ({ date, weight: weightKg }));

  const bmi = calculateBMI(currentWeight > 0 ? currentWeight : 70, MOCK_HEIGHT_CM);

  return {
    currentWeight,
    weightChange,
    goalWeight,
    progressPercent,
    weightTrend,
    bmi,
    bmiCategory: getBMICategory(bmi),
  };
}
```

- [ ] **Step 2: Suggest tests**

Suggested test file: `mobile/services/statistics.service.test.ts`

Test cases to cover:
- `calculateBMI(75, 175)` returns `24.5`
- `calculateBMI(50, 160)` returns `19.5`
- `getBMICategory(17.0)` → `'underweight'`
- `getBMICategory(22.0)` → `'normal'`
- `getBMICategory(27.0)` → `'overweight'`
- `getBMICategory(32.0)` → `'obese'`
- `calculateMacroSplit([])` → `{ protein: 0, fat: 0, carbs: 0 }`
- `calculateMacroSplit` with known values sums protein+fat+carbs to 100%
- `calculateStreak` with 3 consecutive on-target days returns 3
- `calculateStreak` returns 0 when today has no entry

- [ ] **Step 3: Verify TypeScript**

```bash
cd /Users/tarasrospodniuk/IdeaProjects/DietManager/mobile && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add mobile/services/statistics.service.ts
git commit -m "feat(statistics): add statistics service"
```

---

### Task 5: SegmentControl Component

**Files:**
- Create: `mobile/components/SegmentControl/SegmentControl.tsx`

- [ ] **Step 1: Create component**

```typescript
// mobile/components/SegmentControl/SegmentControl.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

export type SegmentControlProps = {
  options: Array<{ label: string; value: string }>;
  activeValue: string;
  onChange: (value: string) => void;
};

export function SegmentControl({
  options,
  activeValue,
  onChange,
}: SegmentControlProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isActive = option.value === activeValue;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.segment, isActive && styles.segmentActive]}
            onPress={() => onChange(option.value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: palette.bgCard,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.XS,
    marginHorizontal: SPACING.LG,
    marginBottom: SPACING.LG,
  },
  segment: {
    flex: 1,
    paddingVertical: SPACING.SM,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.SM,
  },
  segmentActive: {
    backgroundColor: palette.white,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.MEDIUM,
    color: palette.textSecondary,
  },
  labelActive: {
    color: palette.textPrimary,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add mobile/components/SegmentControl/SegmentControl.tsx
git commit -m "feat(statistics): add SegmentControl component"
```

---

### Task 6: StatCard Component

**Files:**
- Create: `mobile/components/StatCard/StatCard.tsx`

- [ ] **Step 1: Create component**

```typescript
// mobile/components/StatCard/StatCard.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

export type StatCardProps = {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
};

export function StatCard({ label, value, unit, delta }: StatCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit ? <Text style={styles.unit}> {unit}</Text> : null}
      </View>
      {delta ? <Text style={styles.delta}>{delta}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: palette.bgCard,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginHorizontal: SPACING.XS,
    alignItems: 'center',
  },
  label: {
    fontSize: FONT_SIZE.XS,
    color: palette.textSecondary,
    marginBottom: SPACING.XS,
    textAlign: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.BOLD,
    color: palette.textPrimary,
  },
  unit: {
    fontSize: FONT_SIZE.XS,
    color: palette.textSecondary,
  },
  delta: {
    fontSize: FONT_SIZE.XS,
    color: palette.primary,
    marginTop: SPACING.XS,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add mobile/components/StatCard/StatCard.tsx
git commit -m "feat(statistics): add StatCard component"
```

---

### Task 7: BMIScale Component

**Files:**
- Create: `mobile/components/BMIScale/BMIScale.tsx`

- [ ] **Step 1: Create component**

`react-native-svg` is already installed (`15.12.1`) — no additional install needed.

```typescript
// mobile/components/BMIScale/BMIScale.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Rect, Circle } from 'react-native-svg';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';
import type { BodyStats } from '@/types/statistics.types';

type BMIScaleProps = {
  bmi: number;
  category: BodyStats['bmiCategory'];
};

const SCALE_MIN = 10;
const SCALE_MAX = 40;
const BAR_HEIGHT = 8;
const SVG_WIDTH = 300;

const SEGMENTS = [
  { label: 'Underweight', color: '#2196F3', min: 10, max: 18.5 },
  { label: 'Normal', color: palette.primary, min: 18.5, max: 25 },
  { label: 'Overweight', color: palette.secondary, min: 25, max: 30 },
  { label: 'Obese', color: palette.error, min: 30, max: 40 },
] as const;

const CATEGORY_LABELS: Record<BodyStats['bmiCategory'], string> = {
  underweight: 'Underweight',
  normal: 'Normal weight',
  overweight: 'Overweight',
  obese: 'Obese',
};

const CATEGORY_COLORS: Record<BodyStats['bmiCategory'], string> = {
  underweight: '#2196F3',
  normal: palette.primary,
  overweight: palette.secondary,
  obese: palette.error,
};

function bmiToX(bmi: number): number {
  return Math.max(0, Math.min(SVG_WIDTH, ((bmi - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * SVG_WIDTH));
}

export function BMIScale({ bmi, category }: BMIScaleProps): React.JSX.Element {
  const markerX = bmiToX(bmi);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.bmiValue}>{bmi}</Text>
        <Text style={[styles.categoryLabel, { color: CATEGORY_COLORS[category] }]}>
          {CATEGORY_LABELS[category]}
        </Text>
      </View>
      <Svg width="100%" height={BAR_HEIGHT + 16} viewBox={`0 0 ${SVG_WIDTH} ${BAR_HEIGHT + 16}`}>
        {SEGMENTS.map((seg, i) => {
          const x = ((seg.min - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * SVG_WIDTH;
          const w = ((seg.max - seg.min) / (SCALE_MAX - SCALE_MIN)) * SVG_WIDTH - 1;
          return (
            <Rect
              key={seg.label}
              x={x}
              y={4}
              width={w}
              height={BAR_HEIGHT}
              fill={seg.color}
              rx={i === 0 || i === SEGMENTS.length - 1 ? 4 : 0}
            />
          );
        })}
        <Circle
          cx={markerX}
          cy={4 + BAR_HEIGHT / 2}
          r={6}
          fill={palette.white}
          stroke={CATEGORY_COLORS[category]}
          strokeWidth={2}
        />
      </Svg>
      <View style={styles.legendRow}>
        {SEGMENTS.map((seg) => (
          <Text key={seg.label} style={[styles.legendLabel, { color: seg.color }]}>
            {seg.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.bgCard,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginHorizontal: SPACING.LG,
    marginBottom: SPACING.MD,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  bmiValue: {
    fontSize: FONT_SIZE.XL,
    fontWeight: FONT_WEIGHT.BOLD,
    color: palette.textPrimary,
  },
  categoryLabel: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.XS,
  },
  legendLabel: {
    fontSize: FONT_SIZE.XS,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add mobile/components/BMIScale/BMIScale.tsx
git commit -m "feat(statistics): add BMIScale component"
```

---

### Task 8: CalorieTrendChart Component

**Files:**
- Create: `mobile/screens/Statistics/components/CalorieTrendChart.tsx`

- [ ] **Step 1: Create directory and component**

```bash
mkdir -p /Users/tarasrospodniuk/IdeaProjects/DietManager/mobile/screens/Statistics/components
```

```typescript
// mobile/screens/Statistics/components/CalorieTrendChart.tsx
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { BarChart } from 'react-native-gifted-charts';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';
import type { NutritionStats } from '@/types/statistics.types';

type CalorieTrendChartProps = {
  calorieTrend: NutritionStats['calorieTrend'];
  avgDailyCalories: number;
};

const CHART_WIDTH = Dimensions.get('window').width - SPACING.LG * 2 - SPACING.MD * 2;

export function CalorieTrendChart({
  calorieTrend,
  avgDailyCalories,
}: CalorieTrendChartProps): React.JSX.Element {
  const barData = calorieTrend.map((item) => ({
    value: item.calories,
    label: item.date.slice(5).replace('-', '/'),
    frontColor: palette.primary,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calorie Trend</Text>
      <Text style={styles.subtitle}>Avg: {avgDailyCalories} kcal</Text>
      {barData.length > 0 ? (
        <BarChart
          data={barData}
          width={CHART_WIDTH}
          height={140}
          barWidth={Math.max(10, Math.floor(CHART_WIDTH / Math.max(barData.length * 2, 1)))}
          noOfSections={4}
          barBorderRadius={4}
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisText}
          hideRules
          isAnimated
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No data for this period</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.bgCard,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginHorizontal: SPACING.LG,
    marginBottom: SPACING.MD,
  },
  title: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textPrimary,
    marginBottom: SPACING.XS,
  },
  subtitle: {
    fontSize: FONT_SIZE.XS,
    color: palette.textSecondary,
    marginBottom: SPACING.SM,
  },
  axisText: {
    fontSize: 10,
    color: palette.textTertiary,
  },
  empty: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZE.SM,
    color: palette.textTertiary,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add mobile/screens/Statistics/components/CalorieTrendChart.tsx
git commit -m "feat(statistics): add CalorieTrendChart component"
```

---

### Task 9: MacroSplitChart Component

**Files:**
- Create: `mobile/screens/Statistics/components/MacroSplitChart.tsx`

- [ ] **Step 1: Create component**

```typescript
// mobile/screens/Statistics/components/MacroSplitChart.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { PieChart } from 'react-native-gifted-charts';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';
import type { NutritionStats } from '@/types/statistics.types';

type MacroSplitChartProps = {
  macroSplit: NutritionStats['macroSplit'];
};

const MACRO_COLORS = {
  protein: palette.accent,
  fat: palette.secondary,
  carbs: palette.primary,
} as const;

export function MacroSplitChart({ macroSplit }: MacroSplitChartProps): React.JSX.Element {
  const hasData = macroSplit.protein + macroSplit.fat + macroSplit.carbs > 0;

  const pieData = [
    { value: macroSplit.protein, color: MACRO_COLORS.protein },
    { value: macroSplit.fat, color: MACRO_COLORS.fat },
    { value: macroSplit.carbs, color: MACRO_COLORS.carbs },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Macronutrient Split</Text>
      {hasData ? (
        <View style={styles.content}>
          <PieChart
            data={pieData}
            donut
            radius={60}
            innerRadius={40}
          />
          <View style={styles.legend}>
            {(['protein', 'fat', 'carbs'] as const).map((key) => (
              <View key={key} style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: MACRO_COLORS[key] }]} />
                <Text style={styles.legendLabel}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}{' '}
                  <Text style={styles.legendValue}>{macroSplit[key]}%</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No data for this period</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.bgCard,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginHorizontal: SPACING.LG,
    marginBottom: SPACING.MD,
  },
  title: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textPrimary,
    marginBottom: SPACING.MD,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legend: {
    flex: 1,
    marginLeft: SPACING.LG,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.SM,
  },
  legendLabel: {
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
  },
  legendValue: {
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textPrimary,
  },
  empty: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZE.SM,
    color: palette.textTertiary,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add mobile/screens/Statistics/components/MacroSplitChart.tsx
git commit -m "feat(statistics): add MacroSplitChart component"
```

---

### Task 10: WeightTrendChart Component

**Files:**
- Create: `mobile/screens/Statistics/components/WeightTrendChart.tsx`

- [ ] **Step 1: Create component**

```typescript
// mobile/screens/Statistics/components/WeightTrendChart.tsx
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { LineChart } from 'react-native-gifted-charts';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';
import type { BodyStats } from '@/types/statistics.types';

type WeightTrendChartProps = {
  weightTrend: BodyStats['weightTrend'];
  goalWeight: number;
};

const CHART_WIDTH = Dimensions.get('window').width - SPACING.LG * 2 - SPACING.MD * 2;

export function WeightTrendChart({
  weightTrend,
  goalWeight,
}: WeightTrendChartProps): React.JSX.Element {
  const lineData = weightTrend.map((item) => ({
    value: item.weight,
    label: item.date.slice(5).replace('-', '/'),
  }));

  const goalLineData = weightTrend.map(() => ({ value: goalWeight }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weight Trend</Text>
      <View style={styles.legendRow}>
        <View style={[styles.legendDot, { backgroundColor: palette.primary }]} />
        <Text style={styles.legendText}>Actual</Text>
        <View style={[styles.legendDot, { backgroundColor: palette.error, marginLeft: SPACING.MD }]} />
        <Text style={styles.legendText}>Goal: {goalWeight} kg</Text>
      </View>
      {lineData.length >= 2 ? (
        <LineChart
          data={lineData}
          data2={goalLineData}
          width={CHART_WIDTH}
          height={140}
          color={palette.primary}
          color2={palette.error}
          dataPointsColor={palette.primary}
          dataPointsColor2="transparent"
          thickness={2}
          thickness2={1}
          curved
          noOfSections={4}
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisText}
          hideRules
          isAnimated
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            {lineData.length === 0
              ? 'No weight entries for this period'
              : 'Add more entries to see the trend'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.bgCard,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginHorizontal: SPACING.LG,
    marginBottom: SPACING.MD,
  },
  title: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textPrimary,
    marginBottom: SPACING.XS,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.XS,
  },
  legendText: {
    fontSize: FONT_SIZE.XS,
    color: palette.textSecondary,
  },
  axisText: {
    fontSize: 10,
    color: palette.textTertiary,
  },
  empty: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZE.SM,
    color: palette.textTertiary,
    textAlign: 'center',
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add mobile/screens/Statistics/components/WeightTrendChart.tsx
git commit -m "feat(statistics): add WeightTrendChart component"
```

---

### Task 11: useStatistics Hook

**Files:**
- Create: `mobile/screens/Statistics/hooks/useStatistics.ts`

- [ ] **Step 1: Create hooks directory and file**

```bash
mkdir -p /Users/tarasrospodniuk/IdeaProjects/DietManager/mobile/screens/Statistics/hooks
```

```typescript
// mobile/screens/Statistics/hooks/useStatistics.ts
import { useState, useCallback, useRef } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { getNutritionStats, getBodyStats } from '@/services/statistics.service';
import { getWeightEntries } from '@/services/weightLog.service';
import type { WeightEntry } from '@/services/weightLog.service';
import type {
  NutritionStats,
  BodyStats,
  StatTab,
  DatePeriod,
  MacroFilter,
} from '@/types/statistics.types';

export type UseStatisticsReturn = {
  activeTab: StatTab;
  activePeriod: DatePeriod;
  activeMacroFilter: MacroFilter;
  nutritionStats: NutritionStats | null;
  bodyStats: BodyStats | null;
  recentEntries: WeightEntry[];
  isLoading: boolean;
  error: string | null;
  periodLabel: string;
  handleTabChange: (tab: StatTab) => void;
  handlePeriodChange: (period: DatePeriod) => void;
  handleMacroFilterChange: (macro: MacroFilter) => void;
  handlePeriodPrevious: () => void;
  handlePeriodNext: () => void;
  handleAddWeightEntry: () => void;
  handleViewAllWeightEntries: () => void;
};

function getDateRange(period: DatePeriod, offset: number): { from: string; to: string } {
  const now = new Date();
  if (period === 'week') {
    const start = new Date(now);
    const dayOfWeek = now.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    start.setDate(now.getDate() - daysToMonday + offset * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return {
      from: start.toISOString().split('T')[0],
      to: end.toISOString().split('T')[0],
    };
  }
  const rawMonth = now.getMonth() + offset;
  const year = now.getFullYear() + Math.floor(rawMonth / 12);
  const month = ((rawMonth % 12) + 12) % 12;
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return {
    from: start.toISOString().split('T')[0],
    to: end.toISOString().split('T')[0],
  };
}

function formatPeriodLabel(period: DatePeriod, offset: number): string {
  const { from, to } = getDateRange(period, offset);
  const fromDate = new Date(from + 'T00:00:00');
  if (period === 'week') {
    const toDate = new Date(to + 'T00:00:00');
    const fromStr = fromDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const toStr = toDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${fromStr} – ${toStr}`;
  }
  return fromDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function useStatistics(): UseStatisticsReturn {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<StatTab>('nutrition');
  const [activePeriod, setActivePeriod] = useState<DatePeriod>('month');
  const [periodOffset, setPeriodOffset] = useState(0);
  const [activeMacroFilter, setActiveMacroFilter] = useState<MacroFilter>('protein');
  const [nutritionStats, setNutritionStats] = useState<NutritionStats | null>(null);
  const [bodyStats, setBodyStats] = useState<BodyStats | null>(null);
  const [recentEntries, setRecentEntries] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchIdRef = useRef(0);

  const fetchStats = useCallback(async (period: DatePeriod, offset: number): Promise<void> => {
    const id = ++fetchIdRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const dateRange = getDateRange(period, offset);
      const [nutrition, body, entries] = await Promise.all([
        getNutritionStats(dateRange),
        getBodyStats(dateRange),
        getWeightEntries(),
      ]);
      if (id === fetchIdRef.current) {
        setNutritionStats(nutrition);
        setBodyStats(body);
        setRecentEntries(entries);
      }
    } catch {
      if (id === fetchIdRef.current) {
        setError('Failed to load statistics. Tap to retry.');
      }
    } finally {
      if (id === fetchIdRef.current) setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchStats(activePeriod, periodOffset);
    }, [fetchStats, activePeriod, periodOffset]),
  );

  const handlePeriodChange = useCallback(
    (period: DatePeriod): void => {
      setActivePeriod(period);
      setPeriodOffset(0);
      fetchStats(period, 0);
    },
    [fetchStats],
  );

  const handlePeriodPrevious = useCallback((): void => {
    const next = periodOffset - 1;
    setPeriodOffset(next);
    fetchStats(activePeriod, next);
  }, [periodOffset, activePeriod, fetchStats]);

  const handlePeriodNext = useCallback((): void => {
    if (periodOffset >= 0) return;
    const next = periodOffset + 1;
    setPeriodOffset(next);
    fetchStats(activePeriod, next);
  }, [periodOffset, activePeriod, fetchStats]);

  return {
    activeTab,
    activePeriod,
    activeMacroFilter,
    nutritionStats,
    bodyStats,
    recentEntries,
    isLoading,
    error,
    periodLabel: formatPeriodLabel(activePeriod, periodOffset),
    handleTabChange: setActiveTab,
    handlePeriodChange,
    handleMacroFilterChange: setActiveMacroFilter,
    handlePeriodPrevious,
    handlePeriodNext,
    handleAddWeightEntry: () => router.push('/modal'),
    handleViewAllWeightEntries: () => router.push('/modal'),
  };
}
```

- [ ] **Step 2: Suggest tests**

Suggested test file: `mobile/screens/Statistics/hooks/useStatistics.test.ts`

Test cases to cover:
- `handleTabChange('body')` updates `activeTab` to `'body'`
- `handlePeriodChange('week')` resets `periodOffset` to 0 and sets `activePeriod`
- `handlePeriodPrevious` decrements `periodOffset` by 1
- `handlePeriodNext` does not increment `periodOffset` past 0
- `fetchStats` sets `isLoading: true` during fetch and `false` after completion
- `fetchStats` sets `error` string when service throws

- [ ] **Step 3: Commit**

```bash
git add mobile/screens/Statistics/hooks/useStatistics.ts
git commit -m "feat(statistics): add useStatistics hook"
```

---

### Task 12: NutritionView Component

**Files:**
- Create: `mobile/screens/Statistics/components/NutritionView.tsx`

- [ ] **Step 1: Create component**

```typescript
// mobile/screens/Statistics/components/NutritionView.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { BarChart } from 'react-native-gifted-charts';
import { StatCard } from '@/components/StatCard/StatCard';
import { CalorieTrendChart } from './CalorieTrendChart';
import { MacroSplitChart } from './MacroSplitChart';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';
import type { NutritionStats, MacroFilter } from '@/types/statistics.types';

type NutritionViewProps = {
  stats: NutritionStats;
  activeMacroFilter: MacroFilter;
  onMacroFilterChange: (filter: MacroFilter) => void;
};

const MACRO_FILTERS: Array<{ value: MacroFilter; label: string }> = [
  { value: 'protein', label: 'Protein' },
  { value: 'fat', label: 'Fat' },
  { value: 'carbs', label: 'Carbs' },
];

const MACRO_COLORS: Record<MacroFilter, string> = {
  protein: palette.accent,
  fat: palette.secondary,
  carbs: palette.primary,
};

const CHART_WIDTH = Dimensions.get('window').width - SPACING.LG * 2 - SPACING.MD * 2;

export function NutritionView({
  stats,
  activeMacroFilter,
  onMacroFilterChange,
}: NutritionViewProps): React.JSX.Element {
  const macroBarData = stats.macroTrend.map((item) => ({
    value: item[activeMacroFilter],
    label: item.date.slice(5).replace('-', '/'),
    frontColor: MACRO_COLORS[activeMacroFilter],
  }));

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'] as const;
  const totalMealCalories = mealTypes.reduce(
    (sum, t) => sum + stats.caloriesByMealType[t],
    0,
  );

  return (
    <>
      <View style={styles.statRow}>
        <StatCard label="Avg daily" value={stats.avgDailyCalories} unit="kcal" />
        <StatCard
          label="On target"
          value={`${stats.onTargetDays}/${stats.totalDays}`}
          unit="days"
        />
        <StatCard label="Streak" value={stats.currentStreak} unit="days" />
      </View>

      <CalorieTrendChart
        calorieTrend={stats.calorieTrend}
        avgDailyCalories={stats.avgDailyCalories}
      />

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Macronutrient Trend</Text>
        <View style={styles.filterRow}>
          {MACRO_FILTERS.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[
                styles.filterChip,
                activeMacroFilter === f.value && {
                  backgroundColor: MACRO_COLORS[f.value] + '22',
                  borderColor: MACRO_COLORS[f.value],
                },
              ]}
              onPress={() => onMacroFilterChange(f.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeMacroFilter === f.value && {
                    color: MACRO_COLORS[f.value],
                    fontWeight: FONT_WEIGHT.SEMIBOLD,
                  },
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {macroBarData.length > 0 ? (
          <BarChart
            data={macroBarData}
            width={CHART_WIDTH}
            height={120}
            barWidth={Math.max(10, Math.floor(CHART_WIDTH / Math.max(macroBarData.length * 2, 1)))}
            barBorderRadius={4}
            noOfSections={3}
            yAxisTextStyle={styles.axisText}
            xAxisLabelTextStyle={styles.axisText}
            hideRules
            isAnimated
          />
        ) : (
          <Text style={styles.emptyText}>No data for this period</Text>
        )}
      </View>

      <MacroSplitChart macroSplit={stats.macroSplit} />

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Calories by Meal Type</Text>
        {mealTypes.map((type) => {
          const kcal = stats.caloriesByMealType[type];
          const pct = totalMealCalories > 0 ? Math.round((kcal / totalMealCalories) * 100) : 0;
          return (
            <View key={type} style={styles.mealRow}>
              <Text style={styles.mealLabel}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${pct}%`, backgroundColor: palette.primary },
                  ]}
                />
              </View>
              <Text style={styles.mealValue}>
                {kcal} kcal ({pct}%)
              </Text>
            </View>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    marginHorizontal: SPACING.LG - SPACING.XS,
    marginBottom: SPACING.MD,
  },
  card: {
    backgroundColor: palette.bgCard,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginHorizontal: SPACING.LG,
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textPrimary,
    marginBottom: SPACING.SM,
  },
  filterRow: {
    flexDirection: 'row',
    gap: SPACING.SM,
    marginBottom: SPACING.SM,
  },
  filterChip: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.FULL,
    borderWidth: 1,
    borderColor: palette.border,
  },
  filterChipText: {
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
  },
  axisText: {
    fontSize: 10,
    color: palette.textTertiary,
  },
  emptyText: {
    fontSize: FONT_SIZE.SM,
    color: palette.textTertiary,
    textAlign: 'center',
    paddingVertical: SPACING.MD,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  mealLabel: {
    width: 80,
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: palette.border,
    borderRadius: BORDER_RADIUS.FULL,
    marginHorizontal: SPACING.SM,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.FULL,
  },
  mealValue: {
    width: 110,
    fontSize: FONT_SIZE.XS,
    color: palette.textTertiary,
    textAlign: 'right',
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add mobile/screens/Statistics/components/NutritionView.tsx
git commit -m "feat(statistics): add NutritionView component"
```

---

### Task 13: BodyView Component

**Files:**
- Create: `mobile/screens/Statistics/components/BodyView.tsx`

- [ ] **Step 1: Create component**

```typescript
// mobile/screens/Statistics/components/BodyView.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { StatCard } from '@/components/StatCard/StatCard';
import { BMIScale } from '@/components/BMIScale/BMIScale';
import { WeightTrendChart } from './WeightTrendChart';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';
import type { BodyStats } from '@/types/statistics.types';
import type { WeightEntry } from '@/services/weightLog.service';

type BodyViewProps = {
  stats: BodyStats;
  recentEntries: WeightEntry[];
  onAddEntry: () => void;
  onViewAll: () => void;
};

function formatWeightChange(change: number): string {
  if (change === 0) return '—';
  return `${change > 0 ? '+' : ''}${change} kg`;
}

function formatEntryDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function BodyView({
  stats,
  recentEntries,
  onAddEntry,
  onViewAll,
}: BodyViewProps): React.JSX.Element {
  return (
    <>
      <View style={styles.statRow}>
        <StatCard label="Current" value={stats.currentWeight} unit="kg" />
        <StatCard label="Change" value={formatWeightChange(stats.weightChange)} />
        <StatCard label="Goal" value={`${stats.progressPercent}%`} />
      </View>

      <WeightTrendChart weightTrend={stats.weightTrend} goalWeight={stats.goalWeight} />

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>Weight Log History</Text>
          <Button mode="text" compact onPress={onAddEntry} textColor={palette.primary}>
            + Add Entry
          </Button>
        </View>

        {recentEntries.slice(0, 3).map((entry, index) => {
          const prev = recentEntries[index + 1];
          const delta =
            prev !== undefined
              ? Math.round((entry.weightKg - prev.weightKg) * 10) / 10
              : null;
          return (
            <View key={entry.id} style={styles.entryRow}>
              <Text style={styles.entryDate}>{formatEntryDate(entry.date)}</Text>
              <Text style={styles.entryWeight}>{entry.weightKg} kg</Text>
              {delta !== null ? (
                <Text
                  style={[
                    styles.entryDelta,
                    { color: delta <= 0 ? palette.primary : palette.error },
                  ]}
                >
                  {delta > 0 ? '↑' : '↓'} {Math.abs(delta)} kg
                </Text>
              ) : (
                <Text style={styles.entryDelta}>—</Text>
              )}
            </View>
          );
        })}

        {recentEntries.length === 0 && (
          <Text style={styles.emptyText}>
            No weight entries yet. Tap "+ Add Entry" to start.
          </Text>
        )}

        {recentEntries.length > 3 && (
          <Button mode="text" compact onPress={onViewAll} textColor={palette.accent}>
            View All Entries
          </Button>
        )}
      </View>

      <BMIScale bmi={stats.bmi} category={stats.bmiCategory} />
    </>
  );
}

const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    marginHorizontal: SPACING.LG - SPACING.XS,
    marginBottom: SPACING.MD,
  },
  card: {
    backgroundColor: palette.bgCard,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginHorizontal: SPACING.LG,
    marginBottom: SPACING.MD,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textPrimary,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: palette.borderSubtle,
  },
  entryDate: {
    flex: 1,
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
  },
  entryWeight: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.MEDIUM,
    color: palette.textPrimary,
    marginRight: SPACING.MD,
  },
  entryDelta: {
    fontSize: FONT_SIZE.SM,
    width: 64,
    textAlign: 'right',
  },
  emptyText: {
    fontSize: FONT_SIZE.SM,
    color: palette.textTertiary,
    textAlign: 'center',
    paddingVertical: SPACING.MD,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add mobile/screens/Statistics/components/BodyView.tsx
git commit -m "feat(statistics): add BodyView component"
```

---

### Task 14: Statistics Screen

**Files:**
- Create: `mobile/screens/Statistics/Statistics.tsx`

- [ ] **Step 1: Create screen**

```typescript
// mobile/screens/Statistics/Statistics.tsx
import React from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStatistics } from './hooks/useStatistics';
import { SegmentControl } from '@/components/SegmentControl/SegmentControl';
import { NutritionView } from './components/NutritionView';
import { BodyView } from './components/BodyView';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

const SEGMENT_OPTIONS = [
  { label: 'Nutrition', value: 'nutrition' },
  { label: 'Body', value: 'body' },
];

const PERIOD_OPTIONS = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
] as const;

export function Statistics(): React.JSX.Element {
  const {
    activeTab,
    activePeriod,
    activeMacroFilter,
    nutritionStats,
    bodyStats,
    recentEntries,
    isLoading,
    error,
    periodLabel,
    handleTabChange,
    handlePeriodChange,
    handleMacroFilterChange,
    handlePeriodPrevious,
    handlePeriodNext,
    handleAddWeightEntry,
    handleViewAllWeightEntries,
  } = useStatistics();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>

        <View style={styles.periodNav}>
          <TouchableOpacity onPress={handlePeriodPrevious} style={styles.navArrow}>
            <Ionicons name="chevron-back" size={20} color={palette.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.periodLabel}>{periodLabel}</Text>
          <TouchableOpacity onPress={handlePeriodNext} style={styles.navArrow}>
            <Ionicons name="chevron-forward" size={20} color={palette.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.periodToggle}>
          {PERIOD_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.periodBtn,
                activePeriod === opt.value && styles.periodBtnActive,
              ]}
              onPress={() => handlePeriodChange(opt.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.periodBtnText,
                  activePeriod === opt.value && styles.periodBtnTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <SegmentControl
        options={SEGMENT_OPTIONS}
        activeValue={activeTab}
        onChange={(v) => handleTabChange(v as 'nutrition' | 'body')}
      />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'nutrition' && nutritionStats !== null ? (
            <NutritionView
              stats={nutritionStats}
              activeMacroFilter={activeMacroFilter}
              onMacroFilterChange={handleMacroFilterChange}
            />
          ) : activeTab === 'body' && bodyStats !== null ? (
            <BodyView
              stats={bodyStats}
              recentEntries={recentEntries}
              onAddEntry={handleAddWeightEntry}
              onViewAll={handleViewAllWeightEntries}
            />
          ) : null}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.bgPage,
  },
  header: {
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.LG,
  },
  title: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: FONT_WEIGHT.BOLD,
    color: palette.textPrimary,
    marginBottom: SPACING.MD,
  },
  periodNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.SM,
  },
  navArrow: {
    padding: SPACING.SM,
  },
  periodLabel: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.MEDIUM,
    color: palette.textPrimary,
    marginHorizontal: SPACING.MD,
    minWidth: 160,
    textAlign: 'center',
  },
  periodToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.SM,
  },
  periodBtn: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.FULL,
    borderWidth: 1,
    borderColor: palette.border,
  },
  periodBtnActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  periodBtnText: {
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
  },
  periodBtnTextActive: {
    color: palette.white,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: FONT_SIZE.SM,
    color: palette.error,
    textAlign: 'center',
    paddingHorizontal: SPACING.XL,
  },
  scroll: {
    paddingBottom: SPACING.XXL,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add mobile/screens/Statistics/Statistics.tsx
git commit -m "feat(statistics): add Statistics screen"
```

---

### Task 15: Wire Stats Tab Route

**Files:**
- Modify: `mobile/app/(tabs)/stats.tsx`

- [ ] **Step 1: Replace placeholder with Statistics screen**

Replace the entire file content:

```typescript
// mobile/app/(tabs)/stats.tsx
import { Statistics } from '@/screens/Statistics/Statistics';

export default Statistics;
```

- [ ] **Step 2: Run TypeScript check**

```bash
cd /Users/tarasrospodniuk/IdeaProjects/DietManager/mobile && npx tsc --noEmit
```

Expected: no errors. If there are errors, fix them before proceeding.

- [ ] **Step 3: Commit**

```bash
git add mobile/app/(tabs)/stats.tsx
git commit -m "feat(statistics): wire stats tab route to Statistics screen"
```

---

## Suggested Tests Summary

Per project conventions (`CLAUDE.md`), test files are authored by the developer, not generated. The following tests are suggested:

| File | Suggested test file |
|------|---------------------|
| `weightLog.service.ts` | `mobile/services/weightLog.service.test.ts` |
| `statistics.service.ts` | `mobile/services/statistics.service.test.ts` |
| `useStatistics.ts` | `mobile/screens/Statistics/hooks/useStatistics.test.ts` |
| `BMIScale.tsx` | `mobile/components/BMIScale/BMIScale.ui.test.tsx` |

Key test cases are described in each relevant task above.

## Verification Checklist

After completing all tasks, verify:

- [ ] `npx tsc --noEmit` passes with no errors
- [ ] Statistics tab visible in bottom navigation
- [ ] Nutrition tab: three summary stat cards render
- [ ] Calorie trend bar chart shows (or empty state)
- [ ] Macro trend toggle switches Protein/Fat/Carbs bar chart data
- [ ] Macro split donut chart shows with legend
- [ ] Calories by meal type shows 4 progress bars
- [ ] Body tab: three summary stat cards render
- [ ] Weight trend line chart shows goal line
- [ ] Weight log history shows recent entries (or empty state)
- [ ] BMI scale shows colour bar with marker at correct position
- [ ] Period nav arrows change the period label
- [ ] Week/Month toggle switches the date range
