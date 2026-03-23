# Claude Instructions for DietManager

## Project Context

**App:** AI-powered calorie tracker (React Native / Expo)

**Design source of truth:** `diet-manager.pen` (Pencil file in project root)
- All UI must match this file exactly — use `mcp__pencil__get_screenshot` to verify screens
- 37 screens designed across auth, onboarding, home, scan, history, statistics, profile, and tracking features

**Tech stack:**
- Mobile: React Native + Expo Router (file-based routing) + React Native Paper + Zustand
- Backend: NestJS + Prisma ORM + PostgreSQL + JWT auth

**Epic docs:** `docs/epics/` — one file per major feature, implemented in separate Claude sessions
- `01-design-foundation.md` — colors, typography, spacing tokens (prerequisite)
- `02-auth-onboarding.md` — login, register, forgot password, onboarding wizard
- `03-home-dashboard.md` — calorie ring, macros, today's meals
- `04-ai-scan.md` — camera, Claude Vision API, scan result, edit meal
- `05-meal-history.md` — filterable meal history with date picker
- `06-statistics.md` — nutrition + body stats with charts
- `07-profile-goals.md` — profile redesign, edit profile, edit goals
- `08-water-weight-tracking.md` — water intake and weight log screens
- `09-backend-integration.md` — wire all mocked services to NestJS API

**Chart library:** `react-native-gifted-charts` (decided in Epic 06)

**API key:** `ANTHROPIC_API_KEY` stored in `mobile/.env` — never hardcode

## Architecture & Organization

### Folder Structure
```
├── api/          API client code and endpoint definitions
├── assets/       Static assets (images, fonts, etc.)
├── components/   Reusable ReactNative components
├── config/       Application configuration files
├── constants/    Application-wide constants and enums
├── hocs/         Higher-order components
├── hooks/        Custom React hooks
├── modals/       Modal components
├── screens/      Page-level components (route components)
├── services/     Business logic and external service integrations
└── types/        TypeScript type definitions and interfaces
```

Each feature or screen follows this structure:
```
├── ComponentName
│   ├── components/       sub-components specific to this feature
│   ├── constants/        constants specific to this feature
│   ├── hocs/             higher-order components specific to this feature
│   ├── hooks/
│   │   ├── useComponentName.ts
│   │   └── useComponentName.test.ts
│   ├── services/         business logic specific to this feature
│   ├── types/            types/interfaces specific to this feature
│   ├── ComponentName.tsx
│   └── ComponentName.ui.test.tsx
```

## TypeScript Standards
- Explicit return types required for all functions
- No `any` types without justification (`any` is allowed only in test files)
- Shared types must be defined in the `types/` folder as interfaces

## React Best Practices
- Functional components only — no class components
- No missing `key` props in lists
- No `useEffect` without dependency arrays
- Custom hooks from `hooks/` folder for reusable logic

## Component Structure
- Max 200 lines per component
- Single responsibility: rendering UI only — no business logic
- Accept data via props; handle user actions via a dedicated custom hook
- Keep UI and logic separated

## Ideal Component Pattern
```tsx
import React from 'react';
import { Box } from '@ui-library';
import withMappedProps from '../../hocs/withMappedProps';

type ComponentNameProps = { /* props definition */ };

function ComponentName(props: ComponentNameProps) {
    const { /* handleOnChange, handleOnClick, etc. */ } = useComponentNameActions(props);

    return (
        <Box>
            {/* JSX markup */}
        </Box>
    );
}

export default withMappedProps(ComponentName);
```

## Hooks
- Encapsulate reusable logic; live in `hooks/`
- Manage state and side effects only — no JSX, no business logic
- Business logic belongs in `services/`

## Services
- Pure functions only — no React code, no UI logic
- One responsibility per file (e.g., `user.service.ts`, `auth.service.ts`)
- Live in `services/`

## Naming Conventions
| Type | Convention |
|------|------------|
| Components | PascalCase, `.tsx` |
| Hooks | camelCase, starts with `use` |
| HOCs | camelCase, starts with `with` |
| Constants | UPPER_SNAKE_CASE |
| Types/Interfaces | PascalCase, `.type.ts` or `.interface.ts` |
| Services | camelCase, ends with `.service.ts` |
| Constants files | camelCase, ends with `.constants.ts` |
| React test files | same name + `.ui.test.tsx` |
| Non-React test files | same name + `.test.ts` |

## Styling
- Flag inline styles longer than three lines

## Code Quality
- Follow SOLID principles
- Extract duplicate code into hooks or utilities

## Testing
- New services must have corresponding tests
- New hooks must have unit tests
- Do not implement tests on behalf of the author — suggest them instead

## Security — Always Flag
- Hardcoded credentials, API keys, or tokens
- Direct `localStorage`/`sessionStorage` usage without validation
- Unvalidated user input in API calls
- Missing input sanitization

## What NOT to Flag
- Comments in complex logic
- File length for configuration files
- Multiple exports from index files
- Dev dependencies in `package.json`
- Console statements in development config files
