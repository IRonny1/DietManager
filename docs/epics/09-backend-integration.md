# Epic 09 — Backend Integration

**Depends on:** All previous epics (01–08). This epic wires every mocked service to the real NestJS backend.

## Goal

Replace all in-memory mocked services with real API calls to the NestJS backend. Add all missing backend endpoints. Connect mobile auth to real JWT tokens.

## Current Backend State (`server/`)

- NestJS with Prisma ORM + PostgreSQL
- AuthModule: login/register endpoints exist (structure)
- ProfileModule: GET/POST profile endpoints (structure)
- NOT connected to mobile — mobile uses mocked services

## Mobile API Layer

### API Client (`mobile/api/client.ts`)

```typescript
import axios from 'axios';
import { ENV } from '../config/env';
import { useAuthStore } from '../stores/useAuthStore';

const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT token to every request
apiClient.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

Install: `npm install axios`

### API Modules

Create one API file per domain in `mobile/api/`:

```
mobile/api/
  client.ts
  auth.api.ts
  profile.api.ts
  diary.api.ts
  waterTracking.api.ts
  weightLog.api.ts
  scan.api.ts
```

Each API file wraps `apiClient` and returns typed responses:

```typescript
// mobile/api/auth.api.ts
export async function loginApi(data: LoginRequest): Promise<AuthResponse>
export async function registerApi(data: RegisterRequest): Promise<AuthResponse>

// mobile/api/profile.api.ts
export async function getProfileApi(): Promise<UserProfile>
export async function saveProfileStepApi(step: string, data: unknown): Promise<UserProfile>
export async function completeProfileApi(): Promise<UserProfile>

// mobile/api/diary.api.ts
export async function getTodayMealsApi(): Promise<MealEntry[]>
export async function getMealsApi(dateRange: { from: string; to: string }): Promise<MealEntry[]>
export async function addMealApi(meal: Omit<MealEntry, 'id'>): Promise<MealEntry>
export async function updateMealApi(id: string, updates: Partial<MealEntry>): Promise<MealEntry>
export async function deleteMealApi(id: string): Promise<void>

// mobile/api/waterTracking.api.ts
export async function getTodayWaterLogApi(): Promise<{ entries: WaterEntry[]; total: number; goal: number }>
export async function addWaterEntryApi(amountMl: number): Promise<WaterEntry>
export async function deleteWaterEntryApi(id: string): Promise<void>
export async function clearTodayWaterLogApi(): Promise<void>
export async function updateWaterGoalApi(goalMl: number): Promise<void>

// mobile/api/weightLog.api.ts
export async function getWeightEntriesApi(dateRange?: { from: string; to: string }): Promise<WeightEntry[]>
export async function addWeightEntryApi(entry: Omit<WeightEntry, 'id'>): Promise<WeightEntry>
export async function deleteWeightEntryApi(id: string): Promise<void>
```

### Update Services

Replace in-memory implementations with API calls:

```typescript
// mobile/services/auth.service.ts — replace mock
import { loginApi, registerApi } from '../api/auth.api';
export const login = loginApi;
export const register = registerApi;
```

Same pattern for all services. Services become thin wrappers or are removed in favor of direct API calls from stores/hooks.

## Backend: Missing Endpoints

### Prisma Schema (`server/prisma/schema.prisma`)

Add missing models:

```prisma
model MealEntry {
  id           String   @id @default(cuid())
  userId       String
  name         String
  category     String
  calories     Float
  protein      Float
  fat          Float
  carbs        Float
  portionGrams Float
  imageUri     String?
  loggedAt     DateTime
  date         String    // YYYY-MM-DD index
  createdAt    DateTime  @default(now())
  user         User      @relation(fields: [userId], references: [id])
}

model WaterEntry {
  id        String   @id @default(cuid())
  userId    String
  amountMl  Int
  loggedAt  DateTime
  date      String
  user      User     @relation(fields: [userId], references: [id])
}

model WeightEntry {
  id        String   @id @default(cuid())
  userId    String
  weightKg  Float
  date      String
  note      String?
  user      User     @relation(fields: [userId], references: [id])
}

model WaterGoal {
  id        String @id @default(cuid())
  userId    String @unique
  goalMl    Int    @default(2000)
  user      User   @relation(fields: [userId], references: [id])
}
```

Run: `npx prisma migrate dev --name add-tracking-models`

### New NestJS Modules

Create the following modules following the existing AuthModule/ProfileModule pattern:

**DiaryModule** (`server/src/diary/`)
```
diary.module.ts
diary.controller.ts    ← REST endpoints
diary.service.ts       ← business logic
dto/
  create-meal.dto.ts
  update-meal.dto.ts
  meal-response.dto.ts
```

Endpoints:
- `GET /api/diary?date=YYYY-MM-DD` → today's meals
- `GET /api/diary?from=&to=` → date range
- `POST /api/diary` → add meal
- `PATCH /api/diary/:id` → update meal
- `DELETE /api/diary/:id` → delete meal

**WaterModule** (`server/src/water/`)
```
water.module.ts
water.controller.ts
water.service.ts
dto/
  add-water.dto.ts
  water-log-response.dto.ts
```

Endpoints:
- `GET /api/water/today` → today's log + total
- `POST /api/water` → add entry
- `DELETE /api/water/:id` → delete entry
- `DELETE /api/water/today` → clear today
- `GET /api/water/goal` → get daily goal
- `PATCH /api/water/goal` → update goal

**WeightModule** (`server/src/weight/`)
```
weight.module.ts
weight.controller.ts
weight.service.ts
dto/
  add-weight.dto.ts
  weight-entry-response.dto.ts
```

Endpoints:
- `GET /api/weight` → all entries (optional date range query params)
- `POST /api/weight` → add entry
- `DELETE /api/weight/:id` → delete entry

All endpoints protected by `JwtAuthGuard` (already implemented in AuthModule).

### Swagger Documentation

Add `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiBearerAuth` decorators to all new controllers.

## Environment Configuration

### Mobile (`mobile/.env`)

```
ANTHROPIC_API_KEY=sk-ant-...
API_BASE_URL=http://localhost:3000
```

Add `mobile/.env` to `.gitignore`.

### Server (`server/.env`)

```
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_EXPIRY=7d
```

## Testing Backend Endpoints

Before wiring mobile → API, verify with:
```bash
# Auth
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234!","firstName":"Test","lastName":"User"}'

# Then login to get token, use token for protected routes
```

Or use Swagger UI at `http://localhost:3000/api/docs`.

## Migration Strategy

Do NOT replace all mocks at once. Migrate one service at a time:

1. Auth (login/register) — simplest, already has backend structure
2. Profile — already has backend structure
3. Diary (meals) — core tracking feature
4. Water tracking
5. Weight log

Test each integration before moving to the next.

## Files to Create / Modify

```
# Mobile
mobile/api/client.ts
mobile/api/auth.api.ts
mobile/api/profile.api.ts
mobile/api/diary.api.ts
mobile/api/waterTracking.api.ts
mobile/api/weightLog.api.ts
mobile/config/env.ts              ← already created in Epic 04, verify
mobile/.env                       ← new, gitignored

# Update services to use APIs
mobile/services/auth.service.ts
mobile/services/profile.service.ts
mobile/services/diary.service.ts
mobile/services/waterTracking.service.ts
mobile/services/weightLog.service.ts

# Backend
server/prisma/schema.prisma
server/src/diary/          ← new module
server/src/water/          ← new module
server/src/weight/         ← new module
server/src/app.module.ts   ← register new modules
server/.env
```

## Tests to Suggest

- `auth.api.test.ts` — mock axios, test request format + error handling
- `diary.api.test.ts` — mock axios, test CRUD operations
- Integration tests for NestJS controllers (use Jest + supertest, following existing server test patterns)

## Verification

1. Start server: `cd server && npm run start:dev`
2. Start mobile: `cd mobile && npx expo start`
3. Register new user → token stored in `useAuthStore`
4. Profile wizard saves to database (verify in Prisma Studio: `npx prisma studio`)
5. Log a meal → appears in Home dashboard AND persists after app restart
6. Water tracking entries persist
7. Weight log entries persist
8. Logout → token cleared → redirect to Welcome
9. 401 response from any endpoint → auto-logout
