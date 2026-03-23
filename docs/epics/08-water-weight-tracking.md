# Epic 08 — Water & Weight Tracking

**Depends on:** Epic 01 (Design Foundation), Epic 07 (Profile & Goals — navigation entry points)

## Goal

Implement the Water Tracking and Weight Log screens, both accessible from the Profile tab.

## Design Reference (Pencil frames)

| Frame Name | ID |
|---|---|
| Water Tracking | `hatkL` |
| Water Tracking / Log Custom Amount | `kBPgo` |
| Weight Log | `RO2a9` |
| Weight Log / Log Weight | `fnJl2` |

Use `mcp__pencil__get_screenshot({ filePath: "diet-manager.pen", nodeId: "<ID>" })` to view each frame.

---

## Water Tracking

### Screen Layout (`screens/WaterTracking/WaterTracking.tsx`)

```
← Water Tracking

┌─────────────────────────────┐
│         1,200               │  ← large circular progress
│           ml                │
│    of 2,000 ml today        │
│  [████████░░░░░░░░░░░░░░░] │  ← progress bar
└─────────────────────────────┘

[+200 ml]  [+350 ml]  [+500 ml]  ← quick-add buttons (green outline)

⊕ Log Custom Amount              ← text link

─── Today's Log ─────────────────────── Clear All
💧  500 ml      8:30 AM    🗑
💧  350 ml      7:15 AM    🗑
💧  350 ml      6:00 AM    🗑

Daily Goal    2,000 ml    Edit →
```

### Log Custom Amount Modal

```
Log Custom Amount

Amount (ml)
[____300____]

[Cancel]  [Log]
```

### Types (`mobile/types/waterTracking.types.ts`)

```typescript
export interface WaterEntry {
  id: string;
  amountMl: number;
  loggedAt: string;   // ISO datetime
  date: string;       // YYYY-MM-DD
}

export interface WaterTrackingState {
  todayTotal: number;
  dailyGoalMl: number;
  entries: WaterEntry[];
}
```

### Service (`mobile/services/waterTracking.service.ts`)

```typescript
let entries: WaterEntry[] = [];
let dailyGoalMl = 2000;

export function getTodayWaterLog(): Promise<{ entries: WaterEntry[]; total: number; goal: number }>
export function addWaterEntry(amountMl: number): Promise<WaterEntry>
export function deleteWaterEntry(id: string): Promise<void>
export function clearTodayLog(): Promise<void>
export function updateDailyGoal(goalMl: number): Promise<void>
```

### Hook (`mobile/screens/WaterTracking/hooks/useWaterTracking.ts`)

```typescript
function useWaterTracking(): {
  todayTotal: number;
  dailyGoalMl: number;
  progressPercent: number;
  entries: WaterEntry[];
  isLoading: boolean;
  handleQuickAdd: (amountMl: number) => Promise<void>;
  handleLogCustomAmount: () => void;    // opens modal
  handleDeleteEntry: (id: string) => Promise<void>;
  handleClearAll: () => Promise<void>;
  handleEditGoal: () => void;
}
```

### Circular Progress Component

Create: `mobile/components/CircularProgress/CircularProgress.tsx`

Similar to CalorieRing (Epic 03) but shows water amount and uses a blue color.

Props:
```typescript
type CircularProgressProps = {
  value: number;      // current amount
  max: number;        // goal amount
  unit: string;       // "ml"
  size?: number;
  color?: string;     // default blue
};
```

Can potentially reuse/generalize the CalorieRing component — if so, refactor CalorieRing into a generic `CircularProgress` and update Home to use it.

### Log Custom Amount Modal

Create: `mobile/modals/LogCustomAmount/LogCustomAmount.tsx`

Simple bottom sheet or dialog with a numeric input. Presented as a modal route or via `useState`.

---

## Weight Log

### Screen Layout (`screens/WeightLog/WeightLog.tsx`)

```
← Weight Log            [+]    ← + opens Log Weight modal

┌──────────┬────────────┬──────────┐
│ Current  │  Change    │  Goal    │
│  72.4    │   -5.6     │  68.0   │
│   kg     │  kg total  │   kg    │
└──────────┴────────────┴──────────┘

─── Weight Trend ────────────────────── Mar 2026
[Line chart with green fill under curve]
[1W]  [1M]  [3M]  [All]   ← time range toggle

─── Log History ──────────────────────
Today        72.4 kg    ↓ 0.3 kg  🗑
Yesterday    72.7 kg    ↓ 0.1 kg  🗑
Mar 20       72.8 kg    ↑ 0.2 kg  🗑
```

### Log Weight Modal

Triggered by "+" button in header.

```
Log Weight

Date    [Today, Mar 22  ▾]    ← date selector

Weight
[72.4]  kg                    ← numeric input

Note (optional)
[________________________]

[Cancel]   [Save]
```

### Types

Reuse `WeightEntry` from `mobile/types/weightTracking.types.ts`:

```typescript
export interface WeightEntry {
  id: string;
  date: string;       // YYYY-MM-DD
  weightKg: number;
  note?: string;
}
```

### Service (`mobile/services/weightLog.service.ts`)

Full implementation (replaces stub from Epic 06 if that was created):

```typescript
let entries: WeightEntry[] = [];

export function getWeightEntries(dateRange?: { from: string; to: string }): Promise<WeightEntry[]>
export function getLatestWeight(): Promise<WeightEntry | null>
export function addWeightEntry(entry: Omit<WeightEntry, 'id'>): Promise<WeightEntry>
export function deleteWeightEntry(id: string): Promise<void>

// Derived calculations
export function getWeightChange(entries: WeightEntry[]): number  // total kg change
export function getWeightGoal(): number  // from profile store
```

### Hook (`mobile/screens/WeightLog/hooks/useWeightLog.ts`)

```typescript
type TimeRange = '1W' | '1M' | '3M' | 'All';

function useWeightLog(): {
  currentWeight: number | null;
  weightChange: number;
  goalWeight: number;
  recentEntries: WeightEntry[];
  chartData: Array<{ date: string; weight: number }>;
  activeTimeRange: TimeRange;
  isLoading: boolean;
  handleTimeRangeChange: (range: TimeRange) => void;
  handleAddEntry: () => void;         // opens Log Weight modal
  handleDeleteEntry: (id: string) => Promise<void>;
}
```

### Log Weight Modal

Create: `mobile/modals/LogWeight/LogWeight.tsx`
Create: `mobile/modals/LogWeight/hooks/useLogWeightForm.ts`

Fields: date (date picker), weight (numeric), note (text).
On save: calls `weightLog.service.ts#addWeightEntry()`.

### Weight Trend Chart

Reuse `WeightTrendChart` component from Epic 06 if already built.
Otherwise create: `mobile/screens/WeightLog/components/WeightTrendChart.tsx`

Line chart with:
- Green line + semi-transparent fill
- Goal weight horizontal dashed line
- Time range toggle below chart

---

## Navigation Routes

Create:
- `mobile/app/water-tracking.tsx` ← full-screen route (not a modal)
- `mobile/app/weight-log.tsx` ← full-screen route

Modal routes:
- `mobile/app/log-custom-amount.tsx`
- `mobile/app/log-weight.tsx`

Profile screen (Epic 07) links navigate to these routes.

---

## Files to Create

```
# Types
mobile/types/waterTracking.types.ts
mobile/types/weightTracking.types.ts   (or weight-log.types.ts)

# Services
mobile/services/waterTracking.service.ts
mobile/services/weightLog.service.ts   ← full impl (replaces Epic 06 stub)

# Water Tracking
mobile/screens/WaterTracking/WaterTracking.tsx
mobile/screens/WaterTracking/hooks/useWaterTracking.ts
mobile/app/water-tracking.tsx

# Weight Log
mobile/screens/WeightLog/WeightLog.tsx
mobile/screens/WeightLog/hooks/useWeightLog.ts
mobile/screens/WeightLog/components/WeightTrendChart.tsx
mobile/app/weight-log.tsx

# Components
mobile/components/CircularProgress/CircularProgress.tsx

# Modals
mobile/modals/LogCustomAmount/LogCustomAmount.tsx
mobile/modals/LogWeight/LogWeight.tsx
mobile/modals/LogWeight/hooks/useLogWeightForm.ts
mobile/app/log-custom-amount.tsx
mobile/app/log-weight.tsx
```

## Tests to Suggest

- `waterTracking.service.test.ts` — add entry, delete, clear, goal update
- `weightLog.service.test.ts` — CRUD, weight change calculation
- `useWaterTracking.test.ts` — progress percent, quick add amounts
- `useWeightLog.test.ts` — time range filtering, chart data transformation
- `useLogWeightForm.test.ts` — form validation

## Verification

1. Screenshot comparison for all 4 Pencil frames vs running app
2. Water Tracking: quick add buttons update total and progress ring/bar
3. Custom amount modal: valid number → logged; empty/negative → validation error
4. Clear All removes all entries for today
5. Weight Log: adding entry → appears in history and chart
6. Time range toggle filters chart data correctly
7. Delta indicators (↑/↓) are correct based on previous entry
8. Both screens accessible from Profile tab
9. `npx tsc --noEmit` passes
