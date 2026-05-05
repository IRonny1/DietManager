# AI Scan — Design Spec
**Date:** 2026-05-05
**Epic:** `docs/epics/04-ai-scan.md`

---

## Overview

Implement the full AI food scanning feature: camera access, food photo capture, OpenAI Vision API analysis (via NestJS backend), scan result display with portion adjustment, and adding meals to the diary.

---

## Backend — NestJS ScanModule

### Endpoint

`POST /scan/analyze` — JWT-protected.

**Request body:**
```json
{ "imageBase64": "<base64-encoded image string>" }
```

**Response (success):**
```json
{
  "name": "Margherita Pizza",
  "category": "Pizza",
  "calories": 800,
  "protein": 32,
  "fat": 28,
  "carbs": 98,
  "portionGrams": 350,
  "confidence": "high",
  "ingredients": ["dough", "tomato sauce", "mozzarella"],
  "recognized": true
}
```

**Response (unrecognized):**
```json
{ "recognized": false }
```

### Files

| File | Purpose |
|------|---------|
| `server/src/scan/scan.module.ts` | NestJS module wiring |
| `server/src/scan/scan.controller.ts` | `POST /scan/analyze` route, JWT guard |
| `server/src/scan/scan.service.ts` | OpenAI client init, `gpt-4o` call, JSON parse |
| `server/src/scan/dto/analyze-food.dto.ts` | `{ imageBase64: string }` with class-validator |
| `server/src/scan/dto/food-scan-result.dto.ts` | Response DTO |

### OpenAI Configuration

- Model: `gpt-4o`
- Image passed as base64 `image_url` in the messages API
- `OPENAI_API_KEY` added to `server/.env` and `configuration.ts`
- `openai` npm package installed in `server/`

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

### Error Handling (server)

- JSON parse failure → throw `BadRequestException` ("Food could not be analyzed")
- `recognized: false` → return the raw `{ recognized: false }` response with HTTP 200; the mobile client handles the UI state
- OpenAI API error → propagate as `InternalServerErrorException`

---

## Mobile Architecture

### Types — `mobile/types/scan.types.ts`

```typescript
export interface FoodScanResult {
  name: string;
  category: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  portionGrams: number;
  confidence: 'high' | 'medium' | 'low';
  ingredients: string[];
  imageUri: string;
}

export interface RecentScan extends FoodScanResult {
  id: string;
  scannedAt: string; // ISO datetime
}
```

### Service — `mobile/services/scan.service.ts`

```typescript
export async function analyzeFood(imageBase64: string, imageUri: string): Promise<FoodScanResult>
```

- Calls `authenticatedFetch('POST', '/scan/analyze', { imageBase64 })`
- Merges `imageUri` (local file URI from `expo-camera`) into the server response before returning
- If response has `recognized: false` → throws `UnrecognizedFoodError` (custom error class in same file)
- If JSON parse fails → throws `UnrecognizedFoodError`
- Network errors propagate as-is

### Store — `mobile/stores/useScanStore.ts`

```typescript
interface ScanState {
  recentScans: RecentScan[];     // last 5, newest first
  currentScan: FoodScanResult | null;
  isScanning: boolean;
  error: string | null;
}
```

Actions: `setCurrentScan`, `setIsScanning`, `addRecentScan` (prepends, caps at 5), `clearError`.

No persistence (Zustand without `persist` middleware).

### Libraries to Install (mobile)

- `expo-camera`
- `expo-image-picker`
- `expo-file-system`

### Screens

#### Scan (`mobile/screens/Scan/`)

States managed by `useScan.ts`:

| State | Screen shown |
|-------|-------------|
| `hasCameraPermission === null` | blank / loading |
| `hasCameraPermission === false` | No Camera Permission |
| `hasCameraPermission === true`, `!isScanning` | Camera viewfinder + recent scans |
| `isScanning === true` | Processing overlay |
| `error === 'unrecognized'` | Food Not Recognized |

`useScan.ts` responsibilities:
- `requestPermission()` via `expo-camera`
- `capturePhoto()`: capture → read as base64 via `expo-file-system` → `analyzeFood()` → store → `router.push('/scan-result')`
- `handleManualEntry()`: `router.push('/edit-meal')`
- Reads `recentScans` and `isScanning` from store

#### ScanResult (`mobile/screens/ScanResult/`)

`useScanResult.ts` responsibilities:
- Reads `currentScan` from store
- Local state: `portionGrams` (initialized from `scan.portionGrams`), `ingredientsExpanded`
- Adjusted macros: `adjusted* = (portionGrams / scan.portionGrams) * scan.*` (recalculated on every step)
- `handlePortionIncrease/Decrease`: step ±10g, min 10g
- `handleAddToDiary()`: calls `diary.service.ts#addMeal()` with adjusted values + `imageUri`, then `router.replace('/(tabs)/scan')`
- `handleEditDetails()`: `router.push('/edit-meal')`
- `handleScanAgain()`: `router.back()`

#### EditMeal (`mobile/screens/EditMeal/`)

Fields: food name, meal type (Breakfast/Lunch/Dinner/Snack), calories, protein, fat, carbs, portion size, ingredients, note.

`useEditMeal.ts` responsibilities:
- Reads `currentScan` from store; if `null`, renders an empty form (manual entry mode)
- `handleSave()`: calls `diary.service.ts#addMeal()` with the form values, then `router.back()` — works correctly whether the user arrived from ScanResult or directly from the Scan screen (manual entry)

### Routes

| File | Type | Purpose |
|------|------|---------|
| `app/(tabs)/scan.tsx` | tab | Renders `<Scan />` screen (stub already exists) |
| `app/scan-result.tsx` | stack route | Renders `<ScanResult />` screen |
| `app/edit-meal.tsx` | stack route | Renders `<EditMeal />` screen |

`app/(tabs)/two.tsx` — delete (already hidden in tab layout).

### Environment

- `ANTHROPIC_API_KEY` removed from `mobile/.env` — AI key lives only on the server
- No new mobile env vars required for this epic

---

## Navigation Flow

```
Scan tab
  └─ capturePhoto() succeeds
       └─ router.push('/scan-result')
            ├─ handleAddToDiary() → router.replace('/(tabs)/scan')
            └─ handleEditDetails() → router.push('/edit-meal')
                 └─ handleSave() → router.back() → back at /scan-result
```

---

## Error Handling Summary

| Scenario | Behavior |
|----------|----------|
| Camera permission denied | "No Camera Permission" screen + "Allow Camera Access" button |
| `recognized: false` from server | "Food Not Recognized" screen + Scan Again / Enter Manually |
| Network error during scan | Error toast + retry; `error` set in store |
| JSON parse failure | Treated as unrecognized |
| OpenAI server error | Error toast + retry |

---

## Files to Create / Modify

### Server (new)
- `server/src/scan/scan.module.ts`
- `server/src/scan/scan.controller.ts`
- `server/src/scan/scan.service.ts`
- `server/src/scan/dto/analyze-food.dto.ts`
- `server/src/scan/dto/food-scan-result.dto.ts`

### Server (modify)
- `server/src/app.module.ts` — import `ScanModule`
- `server/src/config/configuration.ts` — add `openai.apiKey`
- `server/.env` — add `OPENAI_API_KEY`
- `server/package.json` — add `openai` dependency

### Mobile (new)
- `mobile/types/scan.types.ts`
- `mobile/services/scan.service.ts`
- `mobile/stores/useScanStore.ts`
- `mobile/screens/Scan/Scan.tsx`
- `mobile/screens/Scan/hooks/useScan.ts`
- `mobile/screens/Scan/components/CameraView.tsx`
- `mobile/screens/Scan/components/NoCameraPermission.tsx`
- `mobile/screens/Scan/components/ProcessingOverlay.tsx`
- `mobile/screens/Scan/components/FoodNotRecognized.tsx`
- `mobile/screens/Scan/components/RecentScansList.tsx`
- `mobile/screens/ScanResult/ScanResult.tsx`
- `mobile/screens/ScanResult/hooks/useScanResult.ts`
- `mobile/screens/ScanResult/components/PortionStepper.tsx`
- `mobile/screens/ScanResult/components/IngredientsAccordion.tsx`
- `mobile/screens/EditMeal/EditMeal.tsx`
- `mobile/screens/EditMeal/hooks/useEditMeal.ts`
- `mobile/app/scan-result.tsx`
- `mobile/app/edit-meal.tsx`

### Mobile (modify)
- `mobile/app/(tabs)/scan.tsx` — replace stub with `<Scan />`
- `mobile/.env` — remove `ANTHROPIC_API_KEY`

### Mobile (delete)
- `mobile/app/(tabs)/two.tsx`

---

## Tests to Suggest (not implement)

- `scan.service.test.ts` — mock `authenticatedFetch`, test recognized/unrecognized/network-error paths
- `useScan.test.ts` — permission states, capture flow
- `useScanResult.test.ts` — portion adjustment math, add-to-diary call
