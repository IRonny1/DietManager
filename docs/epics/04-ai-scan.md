# Epic 04 — AI Scan

**Depends on:** Epic 01 (Design Foundation), Epic 03 (Home Dashboard — needs `diary.service.ts`)

## Goal

Implement the full AI food scanning feature: camera access, food photo capture, Claude Vision API analysis, scan result display with portion adjustment, and adding meals to the diary.

## Design Reference (Pencil frames)

| Frame Name | ID |
|---|---|
| AI Scan / Initial Screen | `bLi6t` |
| AI Scan | `0s6Y7` |
| AI Scan / Processing | `cCJZG` |
| AI Scan / No Camera Permission | `huzew` |
| AI Scan / Food Not Recognized | `wrwXu` |
| Scan Result | `3GYLn` |
| Scan Result / Scan Again | `rp1dv` |
| Scan Result / Ingredients Expanded | `I00zy` |
| Edit Meal | `Ha1fD` |

Use `mcp__pencil__get_screenshot({ filePath: "diet-manager.pen", nodeId: "<ID>" })` to view each frame.

## Screen Flow

```
Tab: SCAN
  │
  ├─ [Initial Screen]  ← first time / after onboarding
  │   "Scan Food"
  │   [Camera viewfinder area with corner guides]
  │   [Capture FAB button]
  │   Recent Scans list
  │
  ├─ [No Camera Permission]
  │   Illustration + explanation
  │   [Allow Camera Access button]
  │   [Enter Manually link]
  │
  ├─ [Processing]  ← after capture
  │   Food photo preview
  │   Spinning indicator / animated dots
  │   "Analyzing your food..."
  │
  ├─ [Food Not Recognized]
  │   Illustration
  │   "We couldn't identify this food"
  │   [Scan Again button]
  │   [Enter Manually link]
  │
  └─ [Scan Result]
      Food photo
      "High Confidence" badge
      Food name (editable via pencil icon)
      Category chip
      Calorie number (large, green)
      Protein / Fat / Carbs row
      Portion Size stepper (- 250g +)
      Ingredients accordion (collapsed / expanded)
      [Add to Diary button]
      [Edit Details button]  → Edit Meal screen
```

## Data Types (`mobile/types/scan.types.ts`)

```typescript
export interface FoodScanResult {
  name: string;
  category: string;         // e.g. "Pizza", "Salad", "Fruit"
  calories: number;         // per portionGrams
  protein: number;          // grams
  fat: number;              // grams
  carbs: number;            // grams
  portionGrams: number;     // default portion size
  confidence: 'high' | 'medium' | 'low';
  ingredients: string[];
  imageUri: string;         // local file URI
}

export interface RecentScan extends FoodScanResult {
  id: string;
  scannedAt: string;        // ISO datetime
}
```

## Scan Service (`mobile/services/scan.service.ts`)

```typescript
export async function analyzeFood(imageBase64: string): Promise<FoodScanResult>
```

Calls Claude Vision API:
- Model: `claude-opus-4-6` (or `claude-sonnet-4-6` for cost/speed tradeoff)
- Pass image as base64 in the messages API
- System prompt instructs Claude to return structured JSON

### System Prompt

```
You are a nutrition expert. Analyze the food in the image and return a JSON object with:
{
  "name": "Food name",
  "category": "Food category",
  "calories": number,
  "protein": number,
  "fat": number,
  "carbs": number,
  "portionGrams": number,
  "confidence": "high" | "medium" | "low",
  "ingredients": ["ingredient1", "ingredient2"],
  "recognized": true | false
}

If you cannot identify the food, return { "recognized": false }.
Base nutrition values on a standard portion size for the identified food.
All values must be numbers (not strings). Return ONLY the JSON object, no other text.
```

### Error Handling

- If Claude returns `{ "recognized": false }` → show "Food Not Recognized" screen
- If API call fails (network error) → show error toast + retry button
- If JSON parse fails → treat as unrecognized

### API Key

Store the Anthropic API key in `.env` as `ANTHROPIC_API_KEY`. Access via `expo-constants` or a config service. **Never hardcode the key.**

Create `mobile/config/env.ts`:
```typescript
export const ENV = {
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ?? '',
  API_BASE_URL: process.env.API_BASE_URL ?? 'http://localhost:3000',
};
```

## Scan Store (`mobile/stores/useScanStore.ts`)

```typescript
interface ScanState {
  recentScans: RecentScan[];
  currentScan: FoodScanResult | null;
  isScanning: boolean;
  error: string | null;
}

// Actions
addRecentScan(scan: FoodScanResult): void
setCurrentScan(scan: FoodScanResult | null): void
setIsScanning(loading: boolean): void
clearError(): void
```

## Camera Hook (`mobile/screens/Scan/hooks/useScan.ts`)

```typescript
function useScan(): {
  hasCameraPermission: boolean | null;
  recentScans: RecentScan[];
  isScanning: boolean;
  requestPermission: () => Promise<void>;
  capturePhoto: () => Promise<void>;  // triggers camera capture → analyze → navigate
  handleManualEntry: () => void;
}
```

Libraries:
- `expo-camera` — camera preview + capture
- `expo-image-picker` — photo library fallback
- `expo-file-system` — read image as base64

## Scan Result Hook (`mobile/screens/ScanResult/hooks/useScanResult.ts`)

```typescript
function useScanResult(): {
  scan: FoodScanResult;
  portionGrams: number;
  adjustedCalories: number;   // recalculated when portion changes
  adjustedProtein: number;
  adjustedFat: number;
  adjustedCarbs: number;
  ingredientsExpanded: boolean;
  handlePortionIncrease: () => void;
  handlePortionDecrease: () => void;
  handleIngredientsToggle: () => void;
  handleAddToDiary: () => Promise<void>;  // calls diary.service.ts#addMeal()
  handleEditDetails: () => void;           // navigates to Edit Meal
  handleScanAgain: () => void;             // navigates back to Scan
  handleSave: () => void;                  // header Save button
}
```

Portion adjustment: all macro values scale linearly with portion size change.

## Edit Meal Screen (`mobile/screens/EditMeal/`)

Screen for manually editing scan result details before saving. Shown when user taps "Edit Details".

Fields (from Pencil design):
- Food name (text input)
- Meal type selector: Breakfast / Lunch / Dinner / Snack
- Nutritional info: Calories, Protein (g), Fat (g), Carbs (g)
- Portion size stepper
- Ingredients (text area)
- Additional Details: Saturated Fat, Fiber, Sugar, Sodium
- Note text area
- [Delete button] (if editing existing meal)
- [Save Changes button]

Create:
- `mobile/screens/EditMeal/EditMeal.tsx`
- `mobile/screens/EditMeal/hooks/useEditMeal.ts`
- `mobile/app/edit-meal.tsx` ← modal/stack route

## Navigation Updates

Rename `app/(tabs)/two.tsx` → `app/(tabs)/scan.tsx`

Update `app/(tabs)/_layout.tsx` to register the scan tab.

Route for Scan Result: `app/scan-result.tsx` (modal stack, not a tab)

Navigation flow:
```
router.push('/scan-result') after successful scan
router.push('/edit-meal') from scan result
```

Pass scan data via Zustand store (not route params for large objects).

## Files to Create / Modify

```
# New types
mobile/types/scan.types.ts

# New service
mobile/services/scan.service.ts

# New store
mobile/stores/useScanStore.ts

# New config
mobile/config/env.ts

# New screens
mobile/screens/Scan/Scan.tsx
mobile/screens/Scan/hooks/useScan.ts
mobile/screens/ScanResult/ScanResult.tsx
mobile/screens/ScanResult/hooks/useScanResult.ts
mobile/screens/EditMeal/EditMeal.tsx
mobile/screens/EditMeal/hooks/useEditMeal.ts

# New routes
mobile/app/(tabs)/scan.tsx       ← rename from two.tsx
mobile/app/scan-result.tsx
mobile/app/edit-meal.tsx

# Modify
mobile/app/(tabs)/_layout.tsx
```

## Tests to Suggest

- `scan.service.test.ts` — mock Claude API response, test JSON parsing, test unrecognized food handling
- `useScan.test.ts` — permission handling, capture flow
- `useScanResult.test.ts` — portion adjustment math, add-to-diary flow

## Verification

1. Camera permission → "No Camera Permission" screen shown
2. Capture photo → "Processing" screen → "Scan Result" screen with correct data
3. Unrecognized food → "Food Not Recognized" screen
4. Portion stepper adjusts calories/macros proportionally
5. "Add to Diary" → meal appears in Home dashboard
6. "Edit Details" → Edit Meal screen opens, save returns to Scan
7. Recent scans list updates after each scan
8. `npx tsc --noEmit` passes
