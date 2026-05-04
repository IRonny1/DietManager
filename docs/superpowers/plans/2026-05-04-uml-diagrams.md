# DietManager UML Diagrams — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create two drawio diagrams — a horizontal layered architecture overview and a grouped screen/navigation flow — covering all 9 epics of the DietManager project.

**Architecture:** Each diagram is written as a mermaid source file (`.mmd`) stored in `docs/diagrams/` and rendered via the `mcp__drawio__open_drawio_mermaid` tool for visual verification. The `.mmd` files are the version-controlled source of truth. Output `.drawio` files are saved from the drawio app after verification.

**Tech Stack:** drawio MCP (`mcp__drawio__open_drawio_mermaid`), mermaid diagram syntax, Write tool.

---

## File Map

| File | Purpose |
|---|---|
| `docs/diagrams/architecture.mmd` | Mermaid source — horizontal layered architecture |
| `docs/diagrams/screen-flow.mmd` | Mermaid source — grouped screen/navigation flow |

---

## Task 1: Create architecture diagram source

**Files:**
- Create: `docs/diagrams/architecture.mmd`

- [ ] **Step 1: Write `docs/diagrams/architecture.mmd`**

Create the file with this exact content:

```
graph LR
    subgraph UI["📱 Mobile UI · Screens"]
        direction TB
        UI_Auth["Auth · Epic 02\nLogin · Register\nForgotPassword · EmailSent"]
        UI_OB["Onboarding · Epic 02\nWelcome · Features · Method\nPersonalData · ActivityGoal\nManualEntry · Result"]
        UI_Home["Home · Epic 03\nHome screen + Empty state"]
        UI_Scan["Scan · Epic 04\nScan · Processing · NoPermission\nFoodNotRecognized · ScanResult · EditMeal"]
        UI_Hist["History · Epic 05\nHistory screen"]
        UI_Stats["Statistics · Epic 06\nStatistics (Nutrition + Body)"]
        UI_Prof["Profile · Epic 07\nProfile · EditProfile · EditMyGoals"]
        UI_WW["Water & Weight · Epic 08\nWaterTracking · WeightLog"]
        UI_Modals["Modals\nDateRangePicker · LogoutConfirmation\nLogCustomAmount · LogWeight"]
    end

    subgraph HK["🪝 Hooks"]
        direction TB
        HK_Auth["Auth Hooks\nuseAuthGate · useLoginForm\nuseRegisterForm · useForgotPasswordForm"]
        HK_Home["useHome"]
        HK_Scan["Scan Hooks\nuseScan · useScanResult · useEditMeal"]
        HK_Hist["History Hooks\nuseHistory · useDateRangePicker"]
        HK_Stats["useStatistics"]
        HK_Prof["Profile Hooks\nuseProfile · useEditProfileForm\nuseEditMyGoalsForm"]
        HK_WW["Water & Weight Hooks\nuseWaterTracking · useWeightLog\nuseLogWeightForm"]
    end

    subgraph SVC["⚙️ Services / Stores"]
        direction TB
        SVC_Calc["calorieCalculator.service\n· Epic 02"]
        SVC_Diary["diary.service\n· Epic 03"]
        SVC_Scan["scan.service\n· Epic 04"]
        SVC_Stats["statistics.service\n· Epic 06"]
        SVC_Water["waterTracking.service\n· Epic 08"]
        SVC_Weight["weightLog.service\n· Epic 08"]
        SVC_Stores["Zustand Stores\nuseAuthStore · useProfileStore\nuseScanStore"]
    end

    ClaudeAPI(["☁️ Claude Vision API\nExternal · Anthropic"])

    subgraph API["🔌 API Layer · Epic 09"]
        direction TB
        API_Client["client.ts\naxios · JWT interceptors\nauto-logout on 401"]
        API_Mods["auth.api · profile.api\ndiary.api\nwaterTracking.api · weightLog.api"]
    end

    subgraph BE["🖥️ Backend · NestJS"]
        direction TB
        BE_Auth["AuthModule\nPOST /api/auth/login\nPOST /api/auth/register"]
        BE_Prof["ProfileModule\nGET · POST /api/profile"]
        BE_Diary["DiaryModule\nCRUD /api/diary"]
        BE_Water["WaterModule\nCRUD /api/water"]
        BE_Weight["WeightModule\nCRUD /api/weight"]
    end

    subgraph DB["🗄️ Database · PostgreSQL + Prisma"]
        direction TB
        DB_User["User · Profile"]
        DB_Meal["MealEntry"]
        DB_Water["WaterEntry · WaterGoal"]
        DB_Weight["WeightEntry"]
    end

    UI --> HK
    HK --> SVC
    SVC_Scan -.->|"Vision API call"| ClaudeAPI
    SVC_Calc --> SVC_Stores
    SVC_Diary --> API
    SVC_Scan --> API
    SVC_Water --> API
    SVC_Weight --> API
    SVC_Stores --> API
    API --> BE
    BE --> DB

    style UI fill:#E8F5E9,stroke:#4CAF50
    style HK fill:#E3F2FD,stroke:#2196F3
    style SVC fill:#FFF3E0,stroke:#FF9800
    style API fill:#FFF9C4,stroke:#FFC107
    style BE fill:#FCE4EC,stroke:#E91E63
    style DB fill:#EDE7F6,stroke:#9C27B0
    style ClaudeAPI fill:#F3E5F5,stroke:#9C27B0,stroke-dasharray: 5 5
```

- [ ] **Step 2: Render the architecture diagram in drawio**

Use the MCP tool:
```
mcp__drawio__open_drawio_mermaid({
  content: "<paste full content of docs/diagrams/architecture.mmd here>"
})
```

- [ ] **Step 3: Verify the diagram renders correctly**

Check that all 6 layer subgraphs are visible (Mobile UI, Hooks, Services/Stores, API Layer, Backend, Database), arrows flow left-to-right, and the Claude Vision API node appears as a dashed external node.

If the diagram renders correctly — save it from drawio as `docs/diagrams/architecture.drawio`.

- [ ] **Step 4: Commit architecture source**

```bash
git add docs/diagrams/architecture.mmd
git commit -m "docs: add architecture diagram mermaid source"
```

---

## Task 2: Create screen flow diagram source

**Files:**
- Create: `docs/diagrams/screen-flow.mmd`

- [ ] **Step 1: Write `docs/diagrams/screen-flow.mmd`**

Create the file with this exact content:

```
graph TD
    Entry(["⚡ App Entry\nuseAuthGate"])

    subgraph AuthGroup["🔐 Auth Group · Epic 02\nLogin · Register · ForgotPassword · EmailSent"]
        Login["Login"]
        Register["Register"]
        ForgotPwd["ForgotPassword"]
        EmailSent["EmailSent\n(check inbox)"]
        ForgotPwd -->|"submit email"| EmailSent
        EmailSent -->|"Back to Login"| Login
        Register -->|"Already have account?"| Login
    end

    subgraph OnboardingGroup["👋 Onboarding · Epic 02\n7 screens"]
        OB_Welcome["Welcome"]
        OB_Features["Features"]
        OB_Method["Method\n(AI Scan / Manual)"]
        OB_Personal["Personal Data"]
        OB_Activity["Activity & Goal"]
        OB_Manual["Manual Entry\n(calorie goals)"]
        OB_Result["Result Modal\n(Your plan is ready)"]
        OB_Welcome --> OB_Features --> OB_Method
        OB_Method -->|"AI Scan"| OB_Personal --> OB_Activity --> OB_Result
        OB_Method -->|"Manual Entry"| OB_Manual --> OB_Result
    end

    subgraph MainTabs["Main Tabs"]
        subgraph HomeTab["🏠 Home · Epic 03"]
            Home["Home\ncalorie ring + meals"]
            HomeEmpty["Home\nempty state"]
        end

        subgraph HistoryTab["📋 History · Epic 05"]
            History["History\ngrouped meal list"]
            DatePicker["DateRangePicker\nmodal"]
            History -->|"Custom chip"| DatePicker
            DatePicker -->|"Confirm"| History
        end

        subgraph ScanTab["📷 Scan · Epic 04"]
            ScanScreen["Scan\ncamera viewfinder"]
            Processing["Processing\nanalyzing food..."]
            NoPermission["No Camera\nPermission"]
            FoodNotFound["Food Not\nRecognized"]
            ScanResult["Scan Result\ncalories + macros"]
            EditMeal["Edit Meal\nfull detail form"]
            ScanScreen -->|"capture"| Processing
            ScanScreen -->|"no permission"| NoPermission
            Processing -->|"recognized"| ScanResult
            Processing -->|"unrecognized"| FoodNotFound
            FoodNotFound -->|"Scan Again"| ScanScreen
            FoodNotFound -->|"Enter Manually"| EditMeal
            ScanResult -->|"Edit Details"| EditMeal
            NoPermission -->|"Enter Manually"| EditMeal
        end

        subgraph StatsTab["📊 Statistics · Epic 06"]
            StatsNutrition["Statistics\nNutrition sub-tab\ncalorie + macro charts"]
            StatsBody["Statistics\nBody sub-tab\nweight + BMI"]
            LogWeightFromStats["LogWeight\nmodal"]
            StatsNutrition <-->|"tab toggle"| StatsBody
            StatsBody -->|"Add Entry"| LogWeightFromStats
            LogWeightFromStats -->|"Save"| StatsBody
        end

        subgraph ProfileTab["👤 Profile · Epic 07 + 08"]
            ProfileScreen["Profile\ngoals + links"]
            EditProfile["Edit Profile\nname · email · body info"]
            EditMyGoals["Edit My Goals\ncalorie goal · activity"]
            LogoutModal["Logout\nConfirmation modal"]
            WaterTracking["Water Tracking\nEpic 08\nprogress ring + log"]
            LogCustomAmt["Log Custom\nAmount modal"]
            WeightLog["Weight Log\nEpic 08\ntrend chart + history"]
            LogWeightModal["Log Weight\nmodal"]
            ProfileScreen -->|"Edit Profile"| EditProfile
            ProfileScreen -->|"Edit My Goals"| EditMyGoals
            ProfileScreen -->|"Log Out"| LogoutModal
            ProfileScreen -->|"Water Tracking"| WaterTracking
            ProfileScreen -->|"Weight Log"| WeightLog
            WaterTracking -->|"Log Custom Amount"| LogCustomAmt
            LogCustomAmt -->|"Log"| WaterTracking
            WeightLog -->|"+ button"| LogWeightModal
            LogWeightModal -->|"Save"| WeightLog
        end
    end

    Entry -->|"not authenticated"| Login
    Entry -->|"authenticated\nonboarding complete"| MainTabs
    Entry -->|"authenticated\nonboarding pending"| OB_Welcome
    Login -->|"success · returning user"| MainTabs
    Login -->|"Forgot password?"| ForgotPwd
    Register -->|"success · first time"| OB_Welcome
    OB_Result -->|"Start Tracking"| MainTabs

    Home -->|"See All"| History
    HomeEmpty -->|"Scan Food CTA"| ScanScreen
    History -->|"tap meal"| EditMeal
    EditMeal -->|"Save"| History
    ScanResult -->|"Add to Diary"| Home
    EditMeal -->|"Save from scan"| Home
    LogoutModal -->|"Log Out confirmed"| Login

    style AuthGroup fill:#BBDEFB,stroke:#1976D2
    style OnboardingGroup fill:#C8E6C9,stroke:#388E3C
    style HomeTab fill:#DCEDC8,stroke:#558B2F
    style HistoryTab fill:#E1BEE7,stroke:#7B1FA2
    style ScanTab fill:#FFE0B2,stroke:#E65100
    style StatsTab fill:#B2EBF2,stroke:#00838F
    style ProfileTab fill:#FCE4EC,stroke:#C62828
```

- [ ] **Step 2: Render the screen flow diagram in drawio**

Use the MCP tool:
```
mcp__drawio__open_drawio_mermaid({
  content: "<paste full content of docs/diagrams/screen-flow.mmd here>"
})
```

- [ ] **Step 3: Verify the diagram renders correctly**

Check that:
- App Entry node is at the top
- Auth Group and Onboarding Group appear as distinct rounded rectangles
- Main Tabs contain 5 sub-groups (Home, History, Scan, Statistics, Profile)
- Water & Weight screens are nested inside the Profile group
- Navigation arrows have labels describing the trigger action

If the diagram renders correctly — save it from drawio as `docs/diagrams/screen-flow.drawio`.

- [ ] **Step 4: Commit screen flow source**

```bash
git add docs/diagrams/screen-flow.mmd
git commit -m "docs: add screen flow diagram mermaid source"
```

---

## Task 3: Commit drawio exports (after saving from app)

**Files:**
- Create: `docs/diagrams/architecture.drawio`
- Create: `docs/diagrams/screen-flow.drawio`

- [ ] **Step 1: Verify both .drawio files exist**

```bash
ls -la docs/diagrams/
```

Expected output: four files — `architecture.mmd`, `architecture.drawio`, `screen-flow.mmd`, `screen-flow.drawio`.

- [ ] **Step 2: Commit drawio exports**

```bash
git add docs/diagrams/architecture.drawio docs/diagrams/screen-flow.drawio
git commit -m "docs: add exported drawio diagram files"
```

---

## Self-Review Notes

- **Spec coverage:** All spec sections covered — 6 swim lanes in architecture, all 9 epic modules represented, grouped screen flow with all 37 Pencil-designed screens accounted for.
- **No placeholders:** All mermaid content is complete and ready to paste.
- **Type consistency:** Node IDs are unique across both diagrams (e.g. `LogWeightFromStats` vs `LogWeightModal` for the two different entry points to the same modal).
- **Scope:** Two tasks produce two independent diagram files. Neither blocks the other.
