# Epic 05 — Meal History

**Depends on:** Epic 01 (Design Foundation), Epic 03 (Home Dashboard — needs `diary.service.ts`)

## Goal

Implement the History tab with a searchable, filterable list of logged meals grouped by date.

## Design Reference (Pencil frames)

| Frame Name | ID |
|---|---|
| History | `XqC7h` |
| Date Range Picker Modal | `xhTSD` |

Use `mcp__pencil__get_screenshot({ filePath: "diet-manager.pen", nodeId: "XqC7h" })` to view the design.

## Screen Layout

```
Meal History             ← H1

[🔍 Search meals...]     ← search bar

[Today] [This Week] [This Month] [Custom]   ← filter chips

─── Today, Mar 19 ───────────────────────
┌──────────────────────────────────────┐
│  Oatmeal with Berries                │
│  220 kcal · P: 10g · F: 8g · C: 54g │
│  8:38 AM                             │
└──────────────────────────────────────┘
┌──────────────────────────────────────┐
│  Grilled Chicken Salad               │
│  528 kcal · P: 42g · F: 18g · C: 32g│
│  12:45 PM                            │
└──────────────────────────────────────┘

─── Yesterday, Mar 18 ───────────────────
┌──────────────────────────────────────┐
│  Avocado Toast                       │
│  ...                                 │
└──────────────────────────────────────┘

[Tab Bar]
```

Tapping a meal → navigates to Edit Meal screen (from Epic 04).

## Date Range Picker Modal

Triggered by tapping "Custom" filter chip.

Layout:
```
[← ]  March 2026  [→]     ← month navigation

Mo Tu We Th Fr Sa Su
                    1  2
 3   4   5   6   7  8  9
10  11  12 [13] [14]...

[Start date] ──── [End date]

[Cancel]  [Confirm]
```

Create: `mobile/modals/DateRangePicker/DateRangePicker.tsx`
Create: `mobile/modals/DateRangePicker/hooks/useDateRangePicker.ts`

The modal is presented as a bottom sheet or full modal. Use `router.push('/date-range-picker')` or React Native Paper's `Modal` component.

## Data Layer

Reuses `diary.service.ts` from Epic 03. Add this function if not yet implemented:

```typescript
// Already defined in Epic 03:
export function getMeals(dateRange: { from: string; to: string }): Promise<MealEntry[]>
```

Date range presets (computed in hook):
- **Today:** `{ from: today, to: today }`
- **This Week:** `{ from: startOfWeek, to: today }`
- **This Month:** `{ from: startOfMonth, to: today }`
- **Custom:** user-selected range from DateRangePicker modal

## History Hook (`mobile/screens/History/hooks/useHistory.ts`)

```typescript
type DateFilter = 'today' | 'week' | 'month' | 'custom';

function useHistory(): {
  groupedMeals: Array<{ dateLabel: string; meals: MealEntry[] }>;
  searchQuery: string;
  activeFilter: DateFilter;
  customDateRange: { from: string; to: string } | null;
  isLoading: boolean;
  handleSearchChange: (query: string) => void;
  handleFilterChange: (filter: DateFilter) => void;
  handleCustomDateConfirm: (range: { from: string; to: string }) => void;
  handleMealPress: (meal: MealEntry) => void;  // navigate to Edit Meal
  handleOpenDatePicker: () => void;
}
```

### Grouping Logic

Group meals by date, sorted descending (newest first):

```typescript
function groupMealsByDate(meals: MealEntry[]): Array<{ dateLabel: string; meals: MealEntry[] }> {
  // dateLabel: "Today, Mar 19" / "Yesterday, Mar 18" / "Mar 17, 2026"
}
```

### Search Filtering

Filter by meal name (case-insensitive substring match). Applied client-side after fetching.

## Meal History Row Component

Create: `mobile/components/MealHistoryRow/MealHistoryRow.tsx`

Horizontal layout:
- Left: food image thumbnail (or placeholder icon)
- Center: meal name (bold), macro summary (small gray), time (small gray)
- Right: calorie count (medium, semi-bold)

Props:
```typescript
type MealHistoryRowProps = {
  meal: MealEntry;
  onPress: () => void;
};
```

## Date Section Header Component

Create: `mobile/components/DateSectionHeader/DateSectionHeader.tsx`

Simple horizontal divider with date label:
```
─── Today, Mar 19 ──────────────────────
```

Props:
```typescript
type DateSectionHeaderProps = {
  label: string;
};
```

## Screen Component (`mobile/screens/History/History.tsx`)

```tsx
function History() {
  const { groupedMeals, searchQuery, activeFilter, isLoading,
          handleSearchChange, handleFilterChange, handleMealPress,
          handleOpenDatePicker } = useHistory();

  return (
    <View>
      <Text>Meal History</Text>
      <SearchBar value={searchQuery} onChangeText={handleSearchChange} />
      <DateFilterChips active={activeFilter} onChange={handleFilterChange}
                       onCustomPress={handleOpenDatePicker} />
      <FlatList
        data={groupedMeals}
        renderItem={({ item }) => (
          <>
            <DateSectionHeader label={item.dateLabel} />
            {item.meals.map(meal => (
              <MealHistoryRow key={meal.id} meal={meal} onPress={() => handleMealPress(meal)} />
            ))}
          </>
        )}
      />
    </View>
  );
}
```

## Navigation

Update `app/(tabs)/history.tsx` (currently may not exist — create it):
```tsx
// app/(tabs)/history.tsx
import History from '../../screens/History/History';
export default History;
```

Ensure `app/(tabs)/_layout.tsx` includes the history tab.

When tapping a meal, navigate to the Edit Meal screen (from Epic 04):
```typescript
router.push({ pathname: '/edit-meal', params: { mealId: meal.id } });
```

## Files to Create / Modify

```
# New screen
mobile/screens/History/History.tsx
mobile/screens/History/hooks/useHistory.ts

# New components
mobile/components/MealHistoryRow/MealHistoryRow.tsx
mobile/components/DateSectionHeader/DateSectionHeader.tsx

# New modal
mobile/modals/DateRangePicker/DateRangePicker.tsx
mobile/modals/DateRangePicker/hooks/useDateRangePicker.ts
mobile/app/date-range-picker.tsx   ← modal route

# New/modify routes
mobile/app/(tabs)/history.tsx      ← create if not exists
mobile/app/(tabs)/_layout.tsx      ← add history tab if missing
```

## Tests to Suggest

- `useHistory.test.ts` — date range calculation for each filter, grouping logic, search filtering
- `useDateRangePicker.test.ts` — date selection, range validation
- `MealHistoryRow.ui.test.tsx` — renders meal name, calories, macros, time

## Verification

1. "Today" filter shows only today's meals
2. "This Week" / "This Month" filters work correctly
3. "Custom" opens date picker modal → selecting range filters the list
4. Search input filters by meal name in real time
5. Tapping a meal opens Edit Meal screen
6. Meals are grouped by date with section headers
7. Newest dates appear first
8. `npx tsc --noEmit` passes
