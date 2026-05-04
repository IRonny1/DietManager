# Design Spec — DietManager UML Diagrams

**Date:** 2026-05-04  
**Scope:** Two drawio diagrams covering the full 9-epic project — architecture overview and screen/navigation flow.

---

## Goal

Produce two `.drawio` files that give any developer a complete picture of the DietManager system at a glance:

1. `docs/diagrams/architecture.drawio` — how the technical layers relate across the full stack
2. `docs/diagrams/screen-flow.drawio` — how users navigate between all screens

---

## Diagram 1 — Architecture Overview

### Format

Drawio diagram using **horizontal swim lanes** (left → right). Six lanes in order:

1. Mobile UI (Screens)
2. Hooks
3. Services / Stores
4. API Layer
5. Backend (NestJS)
6. Database

### Color Coding by Epic

| Epic | Color |
|---|---|
| 01 Design Foundation | Gray |
| 02 Auth & Onboarding | Blue (`#DAE8FC`) |
| 03 Home Dashboard | Green (`#D5E8D4`) |
| 04 AI Scan | Orange (`#FFE6CC`) |
| 05 Meal History | Purple (`#E1D5E7`) |
| 06 Statistics | Teal (`#DAF0EE`) |
| 07 Profile & Goals | Pink (`#F8CECC`) |
| 08 Water & Weight | Cyan (`#CCE5FF`) |
| 09 Backend Integration | Yellow (`#FFF2CC`) |

### Lane Contents

**Lane 1 — Mobile UI (Screens)**

Grouped sub-clusters by feature:

- Auth (Epic 02): `Login`, `Register`, `ForgotPassword`, `EmailSent`
- Onboarding (Epic 02): `Welcome`, `Features`, `Method`, `PersonalData`, `ActivityGoal`, `ManualEntry`, `Result`
- Home (Epic 03): `Home`
- Scan (Epic 04): `Scan`, `ScanResult`, `EditMeal`
- History (Epic 05): `History`
- Statistics (Epic 06): `Statistics`
- Profile (Epic 07): `Profile`, `EditProfile`, `EditMyGoals`
- Water & Weight (Epic 08): `WaterTracking`, `WeightLog`
- Modals: `DateRangePicker`, `LogoutConfirmation`, `LogCustomAmount`, `LogWeight`

**Lane 2 — Hooks**

One box per screen hook, connected upward to its screen:

`useAuthGate`, `useLoginForm`, `useRegisterForm`, `useForgotPasswordForm`, `useHome`, `useScan`, `useScanResult`, `useEditMeal`, `useHistory`, `useDateRangePicker`, `useStatistics`, `useProfile`, `useEditProfileForm`, `useEditMyGoalsForm`, `useWaterTracking`, `useWeightLog`, `useLogWeightForm`

**Lane 3 — Services / Stores**

Services:
- `calorieCalculator.service` (Epic 02)
- `diary.service` (Epic 03)
- `scan.service` (Epic 04)
- `statistics.service` (Epic 06)
- `waterTracking.service` (Epic 08)
- `weightLog.service` (Epic 08)

Zustand Stores:
- `useAuthStore`
- `useProfileStore`
- `useScanStore`

**Lane 4 — API Layer (Epic 09)**

- `client.ts` (axios + JWT interceptors + auto-logout on 401)
- `auth.api`
- `profile.api`
- `diary.api`
- `waterTracking.api`
- `weightLog.api`

**Lane 5 — Backend (NestJS)**

Each module shown as a paired box (Controller + Service):

- `AuthModule` (login, register)
- `ProfileModule` (get/save profile, complete onboarding)
- `DiaryModule` (CRUD meals, date range query)
- `WaterModule` (log/delete entries, goal CRUD)
- `WeightModule` (log/delete entries)

**Lane 6 — Database**

PostgreSQL via Prisma ORM. Models:
- `User`
- `Profile`
- `MealEntry`
- `WaterEntry`
- `WaterGoal`
- `WeightEntry`

### Key Dependency Arrows

- Screens → Hooks (each screen calls its hook)
- Hooks → Services/Stores (hooks call services for data, read/write stores)
- Services → API Layer (Epic 09 replaces in-memory with API calls)
- API Layer → Backend modules (HTTP calls to NestJS controllers)
- Backend Services → Database (Prisma queries)
- `scan.service` → Claude Vision API (external, shown as a separate node outside the lanes)

---

## Diagram 2 — Screen / Navigation Flow

### Format

Drawio diagram using a **top-down tree** layout. Groups are rounded rectangles with a bold header. Navigation arrows are labeled with the trigger action.

### Structure

```
App Entry (useAuthGate)
│
├── [Auth Group — Epic 02]  4 screens
│     Login · Register · ForgotPassword · EmailSent
│     • Login → Home (returning user)
│     • Register → Onboarding (first time)
│     • ForgotPassword → EmailSent → Login
│
├── [Onboarding Group — Epic 02]  7 screens
│     Welcome → Features → Method → PersonalData
│     → ActivityGoal → ManualEntry (if manual) → Result
│     • Result "Start Tracking" → Main Tabs
│
└── [Main Tabs]
      │
      ├── [Home — Epic 03]
      │     Home (full state) · Home (empty state)
      │     • "See All" → History Tab
      │     • Empty state "Scan Food" → Scan Tab
      │
      ├── [History — Epic 05]
      │     History
      │     • "Custom" chip → DateRangePicker modal
      │     • Tap meal → EditMeal screen
      │
      ├── [Scan — Epic 04]
      │     Scan · Processing · NoPermission · FoodNotRecognized · ScanResult
      │     • "Edit Details" → EditMeal screen
      │     • "Add to Diary" → Home
      │     • "Enter Manually" → EditMeal screen
      │
      ├── [Statistics — Epic 06]
      │     Statistics (Nutrition sub-tab · Body sub-tab)
      │     • "Add Entry" → LogWeight modal
      │     • "View All Entries" → WeightLog screen
      │
      └── [Profile — Epic 07]
            Profile
            • "Edit Profile" → EditProfile screen
            • "Edit My Goals" → EditMyGoals screen
            • "Log Out" → LogoutConfirmation modal → Auth/Login
            • "Water Tracking" → WaterTracking screen
            • "Weight Log" → WeightLog screen

            [WaterTracking — Epic 08]
              WaterTracking
              • "Log Custom Amount" → LogCustomAmount modal

            [WeightLog — Epic 08]
              WeightLog
              • "+" button → LogWeight modal
```

---

## Output Files

```
docs/diagrams/architecture.drawio
docs/diagrams/screen-flow.drawio
```

---

## Implementation Notes

- Use the `mcp__drawio__open_drawio_mermaid` or `mcp__drawio__open_drawio_xml` tool to create each diagram
- The drawio XML for swim lanes uses `<mxCell>` with `style="swimlane"` and a parent container cell
- Each epic group within a lane is a sub-container with the epic's color as background
- Arrow labels should be short (e.g. "calls", "reads/writes", "HTTP", "Prisma query")
- The Claude Vision API node in the architecture diagram is outside the swim lanes — place it above/beside Lane 3 with a dashed border
