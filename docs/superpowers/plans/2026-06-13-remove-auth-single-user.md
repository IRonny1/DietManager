# Remove Auth — Single-User Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all authentication infrastructure from both backend and mobile, replacing it with a hardcoded single-user identity so the app works without login.

**Architecture:** A `SingleUserMiddleware` on the backend sets `request.user` on every request, keeping `@CurrentUser()` and all service signatures untouched. The mobile app drops auth screens and routes directly to onboarding or tabs on launch.

**Tech Stack:** NestJS + Prisma (backend), React Native + Expo Router + Zustand (mobile)

---

## File Map

### Backend — New files
- `server/src/common/constants/single-user.constants.ts` — fixed UUID and tenant ID
- `server/src/common/middleware/single-user.middleware.ts` — injects user into every request
- `server/prisma/seed.ts` — upserts the single user row

### Backend — Modified files
- `server/src/app.module.ts` — remove `AuthModule`, apply `SingleUserMiddleware` globally
- `server/src/diary/diary.module.ts` — remove `AuthModule` import
- `server/src/water/water.module.ts` — remove `AuthModule` import
- `server/src/weight/weight.module.ts` — remove `AuthModule` import
- `server/src/profile/profile.module.ts` — remove `AuthModule` import
- `server/src/diary/diary.controller.ts` — remove `@UseGuards` / `@ApiBearerAuth`
- `server/src/water/water.controller.ts` — remove `@UseGuards` / `@ApiBearerAuth`
- `server/src/weight/weight.controller.ts` — remove `@UseGuards` / `@ApiBearerAuth`
- `server/src/profile/profile.controller.ts` — remove `@UseGuards` / `@ApiBearerAuth`
- `server/src/scan/scan.controller.ts` — remove `@UseGuards` / `@ApiBearerAuth`
- `server/package.json` — remove passport packages, add prisma seed config

### Backend — Deleted files
- `server/src/auth/auth.module.ts`
- `server/src/auth/guards/jwt-auth.guard.ts`
- `server/src/auth/strategies/jwt.strategy.ts`
- `server/src/common/types/jwt.types.ts`

### Mobile — Modified files
- `mobile/api/authenticatedFetch.ts` — rewrite as plain fetch wrapper (no token logic)
- `mobile/app/_layout.tsx` — remove auth gate, update initial route
- `mobile/screens/Home/hooks/useHome.ts` — remove `useAuthStore` import
- `mobile/screens/Profile/hooks/useProfile.ts` — remove `useAuthStore`, update return type
- `mobile/screens/Profile/Profile.tsx` — remove logout button, fix display name/email
- `mobile/.env` — remove `EXPO_PUBLIC_AUTH_BASE_URL` and `EXPO_PUBLIC_TENANT_ID`
- `mobile/constants/env.constants.ts` — remove `AUTH_BASE_URL` and `TENANT_ID` exports

### Mobile — Deleted files
- `mobile/app/(auth)/` (entire directory: `_layout.tsx`, `welcome.tsx`, `login.tsx`, `register.tsx`, `forgot-password.tsx`, `forgot-password-sent.tsx`)
- `mobile/app/logout-confirmation.tsx`
- `mobile/stores/useAuthStore.ts`
- `mobile/stores/secureStorage.ts`
- `mobile/services/auth.service.ts`
- `mobile/constants/auth.constants.ts`
- `mobile/hooks/useAuthGate.ts`
- `mobile/types/auth.types.ts`

---

## Task 1: Create single-user constants

**Files:**
- Create: `server/src/common/constants/single-user.constants.ts`

- [ ] **Step 1: Create the constants file**

```ts
export const SINGLE_USER_ID = 'e1a2b3c4-d5e6-7f8a-9b0c-d1e2f3a4b5c6';
export const SINGLE_TENANT_ID = 'a1b2c3d4-1234-4321-abcd-ef0123456789';
```

- [ ] **Step 2: Commit**

```bash
git add server/src/common/constants/single-user.constants.ts
git commit -m "feat(server): add single-user constants"
```

---

## Task 2: Create SingleUserMiddleware

**Files:**
- Create: `server/src/common/middleware/single-user.middleware.ts`

- [ ] **Step 1: Create the middleware**

```ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SINGLE_USER_ID, SINGLE_TENANT_ID } from '../constants/single-user.constants';

@Injectable()
export class SingleUserMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    (req as Request & { user: unknown }).user = {
      userId: SINGLE_USER_ID,
      tenantId: SINGLE_TENANT_ID,
    };
    next();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add server/src/common/middleware/single-user.middleware.ts
git commit -m "feat(server): add SingleUserMiddleware"
```

---

## Task 3: Update AppModule

**Files:**
- Modify: `server/src/app.module.ts`

- [ ] **Step 1: Replace the full file content**

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { ScanModule } from './scan/scan.module';
import { DiaryModule } from './diary/diary.module';
import { WaterModule } from './water/water.module';
import { WeightModule } from './weight/weight.module';
import { SingleUserMiddleware } from './common/middleware/single-user.middleware';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    ProfileModule,
    ScanModule,
    DiaryModule,
    WaterModule,
    WeightModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(SingleUserMiddleware).forRoutes('*');
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add server/src/app.module.ts
git commit -m "feat(server): register SingleUserMiddleware globally, remove AuthModule"
```

---

## Task 4: Update feature modules

**Files:**
- Modify: `server/src/diary/diary.module.ts`
- Modify: `server/src/water/water.module.ts`
- Modify: `server/src/weight/weight.module.ts`
- Modify: `server/src/profile/profile.module.ts`

- [ ] **Step 1: Update `diary.module.ts`**

```ts
import { Module } from '@nestjs/common';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';

@Module({
  controllers: [DiaryController],
  providers: [DiaryService],
})
export class DiaryModule {}
```

- [ ] **Step 2: Update `water.module.ts`**

```ts
import { Module } from '@nestjs/common';
import { WaterController } from './water.controller';
import { WaterService } from './water.service';

@Module({
  controllers: [WaterController],
  providers: [WaterService],
})
export class WaterModule {}
```

- [ ] **Step 3: Update `weight.module.ts`**

```ts
import { Module } from '@nestjs/common';
import { WeightController } from './weight.controller';
import { WeightService } from './weight.service';

@Module({
  controllers: [WeightController],
  providers: [WeightService],
})
export class WeightModule {}
```

- [ ] **Step 4: Update `profile.module.ts`**

```ts
import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
```

- [ ] **Step 5: Commit**

```bash
git add server/src/diary/diary.module.ts server/src/water/water.module.ts server/src/weight/weight.module.ts server/src/profile/profile.module.ts
git commit -m "feat(server): remove AuthModule imports from feature modules"
```

---

## Task 5: Remove guards from controllers

**Files:**
- Modify: `server/src/diary/diary.controller.ts`
- Modify: `server/src/water/water.controller.ts`
- Modify: `server/src/weight/weight.controller.ts`
- Modify: `server/src/profile/profile.controller.ts`
- Modify: `server/src/scan/scan.controller.ts`

- [ ] **Step 1: Update `diary.controller.ts`** — remove `UseGuards`, `ApiBearerAuth`, `JwtAuthGuard`, and `JwtValidatedUser` imports

```ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtValidatedUser } from '../common/types/jwt.types';
import { DiaryService } from './diary.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import type { MealResponseDto } from './dto/meal-response.dto';

@ApiTags('diary')
@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get('today')
  @ApiOperation({ summary: "Get today's meals for the authenticated user" })
  getTodayMeals(
    @CurrentUser() user: JwtValidatedUser,
  ): Promise<MealResponseDto[]> {
    return this.diaryService.getTodayMeals(user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get meals within a date range' })
  @ApiQuery({ name: 'from', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'to', required: false, description: 'YYYY-MM-DD' })
  getMeals(
    @CurrentUser() user: JwtValidatedUser,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<MealResponseDto[]> {
    return this.diaryService.getMeals(user.userId, from ?? '', to ?? '');
  }

  @Post()
  @ApiOperation({ summary: 'Add a meal entry' })
  addMeal(
    @CurrentUser() user: JwtValidatedUser,
    @Body() dto: CreateMealDto,
  ): Promise<MealResponseDto> {
    return this.diaryService.addMeal(user.userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a meal entry' })
  updateMeal(
    @CurrentUser() user: JwtValidatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateMealDto,
  ): Promise<MealResponseDto> {
    return this.diaryService.updateMeal(user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a meal entry' })
  deleteMeal(
    @CurrentUser() user: JwtValidatedUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.diaryService.deleteMeal(user.userId, id);
  }
}
```

- [ ] **Step 2: Update `water.controller.ts`**

```ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtValidatedUser } from '../common/types/jwt.types';
import { WaterService } from './water.service';
import { AddWaterDto } from './dto/add-water.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import type {
  WaterEntryDto,
  WaterLogResponseDto,
} from './dto/water-log-response.dto';

@ApiTags('water')
@Controller('water')
export class WaterController {
  constructor(private readonly waterService: WaterService) {}

  @Get('today')
  @ApiOperation({ summary: "Get today's water log" })
  getTodayLog(
    @CurrentUser() user: JwtValidatedUser,
  ): Promise<WaterLogResponseDto> {
    return this.waterService.getTodayLog(user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add a water entry' })
  addEntry(
    @CurrentUser() user: JwtValidatedUser,
    @Body() dto: AddWaterDto,
  ): Promise<WaterEntryDto> {
    return this.waterService.addEntry(user.userId, dto);
  }

  @Delete('today')
  @ApiOperation({ summary: "Clear today's water log" })
  clearToday(@CurrentUser() user: JwtValidatedUser): Promise<void> {
    return this.waterService.clearToday(user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a water entry by id' })
  deleteEntry(
    @CurrentUser() user: JwtValidatedUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.waterService.deleteEntry(user.userId, id);
  }

  @Get('goal')
  @ApiOperation({ summary: 'Get daily water goal' })
  getGoal(
    @CurrentUser() user: JwtValidatedUser,
  ): Promise<{ goalMl: number }> {
    return this.waterService.getGoal(user.userId);
  }

  @Patch('goal')
  @ApiOperation({ summary: 'Update daily water goal' })
  updateGoal(
    @CurrentUser() user: JwtValidatedUser,
    @Body() dto: UpdateGoalDto,
  ): Promise<void> {
    return this.waterService.updateGoal(user.userId, dto.goalMl);
  }
}
```

- [ ] **Step 3: Update `weight.controller.ts`**

```ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtValidatedUser } from '../common/types/jwt.types';
import { WeightService } from './weight.service';
import { AddWeightDto } from './dto/add-weight.dto';
import type { WeightEntryResponseDto } from './dto/weight-entry-response.dto';

@ApiTags('weight')
@Controller('weight')
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Get()
  @ApiOperation({ summary: 'Get weight entries (optional date range)' })
  @ApiQuery({ name: 'from', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'to', required: false, description: 'YYYY-MM-DD' })
  getEntries(
    @CurrentUser() user: JwtValidatedUser,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<WeightEntryResponseDto[]> {
    return this.weightService.getEntries(user.userId, from, to);
  }

  @Post()
  @ApiOperation({ summary: 'Add a weight entry' })
  addEntry(
    @CurrentUser() user: JwtValidatedUser,
    @Body() dto: AddWeightDto,
  ): Promise<WeightEntryResponseDto> {
    return this.weightService.addEntry(user.userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a weight entry' })
  deleteEntry(
    @CurrentUser() user: JwtValidatedUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.weightService.deleteEntry(user.userId, id);
  }
}
```

- [ ] **Step 4: Update `profile.controller.ts`**

```ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtValidatedUser } from '../common/types/jwt.types';
import { ProfileService } from './profile.service';
import { BasicBodyInfoDto } from './dto/basic-body-info.dto';
import { HealthConditionsDto } from './dto/health-conditions.dto';
import { DietPreferencesDto } from './dto/diet-preferences.dto';
import { GoalsDto } from './dto/goals.dto';
import { ProfileResponse } from './dto/profile-response.dto';
import { InvalidProfileStepException } from '../common/exceptions/domain.exception';
import { VALID_STEP_NAMES } from './constants/profile-steps.constants';

type StepDto =
  | BasicBodyInfoDto
  | HealthConditionsDto
  | DietPreferencesDto
  | GoalsDto;

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get the user profile' })
  getProfile(@CurrentUser() user: JwtValidatedUser): Promise<ProfileResponse> {
    return this.profileService.getProfile(user.userId, user.tenantId);
  }

  @Put('step/:stepName')
  @ApiOperation({ summary: 'Save data for a single profile wizard step' })
  saveStep(
    @Param('stepName') stepName: string,
    @Body() body: unknown,
    @CurrentUser() user: JwtValidatedUser,
  ): Promise<ProfileResponse> {
    if (!VALID_STEP_NAMES.includes(stepName as never)) {
      throw new InvalidProfileStepException(stepName, VALID_STEP_NAMES);
    }
    return this.profileService.saveStep(
      user.userId,
      user.tenantId,
      stepName,
      body as StepDto,
    );
  }

  @Post('complete')
  @ApiOperation({ summary: 'Mark the profile as fully complete' })
  completeProfile(
    @CurrentUser() user: JwtValidatedUser,
  ): Promise<ProfileResponse> {
    return this.profileService.completeProfile(user.userId, user.tenantId);
  }
}
```

- [ ] **Step 5: Update `scan.controller.ts`** — only remove the guard, no `@CurrentUser()` was used

```ts
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ScanService } from './scan.service';
import { AnalyzeFoodDto } from './dto/analyze-food.dto';
import type { FoodScanResultDto } from './dto/food-scan-result.dto';

@ApiTags('scan')
@Controller('scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze a food image and return nutrition data' })
  analyzeFood(@Body() dto: AnalyzeFoodDto): Promise<FoodScanResultDto> {
    return this.scanService.analyzeFood(dto.imageBase64);
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add server/src/diary/diary.controller.ts server/src/water/water.controller.ts server/src/weight/weight.controller.ts server/src/profile/profile.controller.ts server/src/scan/scan.controller.ts
git commit -m "feat(server): remove JwtAuthGuard from all controllers"
```

---

## Task 6: Create DB seed script

**Files:**
- Create: `server/prisma/seed.ts`
- Modify: `server/package.json`

- [ ] **Step 1: Create `seed.ts`**

```ts
import { PrismaClient } from '@prisma/client';
import { SINGLE_USER_ID, SINGLE_TENANT_ID } from '../src/common/constants/single-user.constants';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.user.upsert({
    where: { id: SINGLE_USER_ID },
    update: {},
    create: {
      id: SINGLE_USER_ID,
      externalAuthId: SINGLE_USER_ID,
      email: 'user@dietmanager.local',
    },
  });

  console.log(`Single user seeded: ${SINGLE_USER_ID}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 2: Add seed config to `server/package.json`**

Add the following `"prisma"` key at the top level of `server/package.json` (alongside `"scripts"`, `"dependencies"`, etc.):

```json
"prisma": {
  "seed": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed.ts"
}
```

- [ ] **Step 3: Run the seed**

```bash
cd server && npx prisma db seed
```

Expected output:
```
Single user seeded: e1a2b3c4-d5e6-7f8a-9b0c-d1e2f3a4b5c6
```

- [ ] **Step 4: Commit**

```bash
git add server/prisma/seed.ts server/package.json
git commit -m "feat(server): add single-user DB seed script"
```

---

## Task 7: Delete backend auth files and uninstall packages

**Files:**
- Delete: `server/src/auth/auth.module.ts`
- Delete: `server/src/auth/guards/jwt-auth.guard.ts`
- Delete: `server/src/auth/strategies/jwt.strategy.ts`
- Modify: `server/src/common/types/jwt.types.ts` — remove `JwtPayload` (only used by the deleted strategy); keep `JwtValidatedUser` since controllers and the `@CurrentUser()` decorator still import it

- [ ] **Step 1: Delete the auth directory**

```bash
rm -rf server/src/auth
```

- [ ] **Step 2: Remove `JwtPayload` from `jwt.types.ts`**

Replace the full content of `server/src/common/types/jwt.types.ts` with:

```ts
export interface JwtValidatedUser {
  userId: string;
  tenantId: string;
}
```

- [ ] **Step 3: Uninstall passport packages**

```bash
cd server && npm uninstall @nestjs/passport @nestjs/jwt passport passport-jwt @types/passport-jwt
```

- [ ] **Step 4: Verify the server still builds**

```bash
cd server && npm run build
```

Expected: build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(server): delete auth module and uninstall passport packages"
```

---

## Task 8: Rewrite `authenticatedFetch`

**Files:**
- Modify: `mobile/api/authenticatedFetch.ts`

- [ ] **Step 1: Replace the full file**

```ts
import { API_BASE_URL } from '@/constants/env.constants';

export async function authenticatedFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add mobile/api/authenticatedFetch.ts
git commit -m "feat(mobile): replace authenticatedFetch with plain fetch wrapper"
```

---

## Task 9: Update `_layout.tsx`

**Files:**
- Modify: `mobile/app/_layout.tsx`

- [ ] **Step 1: Replace the full file**

```tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';

import { useColorScheme } from '@/components/useColorScheme';
import { paperTheme } from '@/constants/paperTheme';
import { useHasCompletedOnboarding } from '@/stores/useProfileStore';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const hasCompletedOnboarding = useHasCompletedOnboarding();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (!hasCompletedOnboarding && !inOnboardingGroup) {
      router.replace('/(onboarding)/welcome');
    } else if (hasCompletedOnboarding && inOnboardingGroup) {
      router.replace('/(tabs)');
    }
  }, [hasCompletedOnboarding, segments, router]);

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="profile-completion"
            options={{ headerShown: false, animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="scan-result"
            options={{ title: 'Scan Result', headerBackTitle: 'Scan' }}
          />
          <Stack.Screen
            name="edit-meal"
            options={{ title: 'Edit Meal', headerBackTitle: 'Back' }}
          />
          <Stack.Screen
            name="date-range-picker"
            options={{ title: 'Select Date Range', presentation: 'modal', headerBackTitle: 'Back' }}
          />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen
            name="edit-profile"
            options={{ title: 'Edit Profile', headerShown: false }}
          />
          <Stack.Screen
            name="edit-my-goals"
            options={{ title: 'Edit My Goals', headerShown: false }}
          />
          <Stack.Screen name="water-tracking" options={{ title: 'Water Tracking' }} />
          <Stack.Screen name="weight-log" options={{ title: 'Weight Log' }} />
          <Stack.Screen
            name="log-custom-amount"
            options={{ title: 'Log Custom Amount', presentation: 'modal', headerBackTitle: 'Back' }}
          />
          <Stack.Screen
            name="log-weight"
            options={{ title: 'Log Weight', presentation: 'modal', headerBackTitle: 'Back' }}
          />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add mobile/app/_layout.tsx
git commit -m "feat(mobile): remove auth gate, route directly to onboarding or tabs"
```

---

## Task 10: Update `useHome` hook

**Files:**
- Modify: `mobile/screens/Home/hooks/useHome.ts`

- [ ] **Step 1: Remove `useAuthStore` — replace the import and `userName` derivation**

In `mobile/screens/Home/hooks/useHome.ts`:

Remove this line:
```ts
import { useAuthStore } from '@/stores/useAuthStore';
```

Remove this line inside `useHome`:
```ts
const user = useAuthStore((state) => state.user);
```

Replace the `userName` derivation:
```ts
// before
const userName = user?.email?.split('@')[0] ?? 'Alex';

// after
const userName = 'Alex';
```

- [ ] **Step 2: Commit**

```bash
git add mobile/screens/Home/hooks/useHome.ts
git commit -m "feat(mobile): remove useAuthStore from useHome"
```

---

## Task 11: Update `useProfile` hook

**Files:**
- Modify: `mobile/screens/Profile/hooks/useProfile.ts`

- [ ] **Step 1: Replace the full file**

```ts
import { useCallback } from 'react';

import { useRouter } from 'expo-router';

import { useProfileStore } from '@/stores/useProfileStore';
import { PRIMARY_GOAL_OPTIONS, ACTIVITY_LEVEL_OPTIONS } from '@/constants/profile.constants';
import type { UserProfile } from '@/types/profile.types';

type UseProfileReturn = {
  profile: UserProfile | null;
  avatarInitials: string;
  calorieGoal: number;
  primaryGoal: string;
  activityLevel: string;
  handleEditProfile: () => void;
  handleEditGoals: () => void;
  handleWaterTracking: () => void;
  handleWeightLog: () => void;
};

function getAvatarInitials(profile: UserProfile | null): string {
  if (profile?.firstName && profile?.lastName) {
    return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
  }
  if (profile?.firstName) {
    return profile.firstName[0].toUpperCase();
  }
  return 'U';
}

function getGoalLabel(primaryGoal: string | null | undefined): string {
  if (!primaryGoal) return '—';
  const option = PRIMARY_GOAL_OPTIONS.find((o) => o.value === primaryGoal);
  return option?.label ?? primaryGoal;
}

function getActivityLabel(activityLevel: string | null | undefined): string {
  if (!activityLevel) return '—';
  const option = ACTIVITY_LEVEL_OPTIONS.find((o) => o.value === activityLevel);
  return option?.label ?? activityLevel;
}

export function useProfile(): UseProfileReturn {
  const router = useRouter();
  const profile = useProfileStore((state) => state.profile);

  const avatarInitials = getAvatarInitials(profile);
  const calorieGoal = profile?.calorieGoal ?? 0;
  const primaryGoal = getGoalLabel(profile?.goals?.primaryGoal);
  const activityLevel = getActivityLabel(profile?.goals?.activityLevel);

  const handleEditProfile = useCallback((): void => {
    router.push('/edit-profile');
  }, [router]);

  const handleEditGoals = useCallback((): void => {
    router.push('/edit-my-goals');
  }, [router]);

  const handleWaterTracking = useCallback((): void => {
    // @ts-ignore
    router.push('/water-tracking');
  }, [router]);

  const handleWeightLog = useCallback((): void => {
    // @ts-ignore
    router.push('/weight-log');
  }, [router]);

  return {
    profile,
    avatarInitials,
    calorieGoal,
    primaryGoal,
    activityLevel,
    handleEditProfile,
    handleEditGoals,
    handleWaterTracking,
    handleWeightLog,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add mobile/screens/Profile/hooks/useProfile.ts
git commit -m "feat(mobile): remove useAuthStore from useProfile"
```

---

## Task 12: Update Profile screen

**Files:**
- Modify: `mobile/screens/Profile/Profile.tsx`

- [ ] **Step 1: Replace the full file** — remove `user` from destructuring, remove logout button, remove email display, fix `displayName`

```tsx
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { palette } from '@/constants/Colors';

import { useProfile } from './hooks/useProfile';

export default function ProfileScreen(): React.JSX.Element {
  const {
    profile,
    avatarInitials,
    calorieGoal,
    primaryGoal,
    activityLevel,
    handleEditProfile,
    handleEditGoals,
    handleWaterTracking,
    handleWeightLog,
  } = useProfile();

  const displayName =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : 'My Profile';

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="headlineMedium" style={styles.pageTitle}>
        Profile
      </Text>

      {/* User Card */}
      <View style={styles.card}>
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarInitials}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text variant="titleMedium" style={styles.userName}>
              {displayName}
            </Text>
            <TouchableOpacity onPress={handleEditProfile} style={styles.editLink}>
              <MaterialCommunityIcons name="pencil" size={14} color={palette.primary} />
              <Text variant="bodySmall" style={styles.editLinkText}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* My Goals */}
      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          My Goals
        </Text>
        <TouchableOpacity onPress={handleEditGoals} style={styles.editGoalsLink}>
          <Text variant="bodySmall" style={styles.editGoalsText}>
            Edit
          </Text>
          <MaterialCommunityIcons name="chevron-right" size={16} color={palette.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.goalsCard}>
        <View style={styles.goalStat}>
          <Text variant="titleLarge" style={styles.goalValue}>
            {calorieGoal > 0 ? calorieGoal.toLocaleString() : '—'}
          </Text>
          <Text variant="bodySmall" style={styles.goalLabel}>
            Cal Goal
          </Text>
        </View>
        <View style={styles.goalDivider} />
        <View style={styles.goalStat}>
          <Text variant="titleMedium" style={styles.goalValue}>
            {primaryGoal}
          </Text>
          <Text variant="bodySmall" style={styles.goalLabel}>
            Goal
          </Text>
        </View>
        <View style={styles.goalDivider} />
        <View style={styles.goalStat}>
          <Text variant="titleMedium" style={styles.goalValue}>
            {activityLevel}
          </Text>
          <Text variant="bodySmall" style={styles.goalLabel}>
            Lifestyle
          </Text>
        </View>
      </View>

      {/* Quick Links */}
      <TouchableOpacity style={styles.linkRow} onPress={handleWaterTracking}>
        <View style={styles.linkLeft}>
          <MaterialCommunityIcons name="water" size={20} color={palette.primary} />
          <Text variant="bodyLarge" style={styles.linkText}>
            Water Tracking
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={palette.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkRow} onPress={handleWeightLog}>
        <View style={styles.linkLeft}>
          <MaterialCommunityIcons name="scale" size={20} color={palette.primary} />
          <Text variant="bodyLarge" style={styles.linkText}>
            Weight Log
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={palette.textSecondary} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
    gap: 12,
  },
  pageTitle: {
    color: palette.textPrimary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    backgroundColor: palette.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: palette.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    color: palette.textPrimary,
    fontWeight: '600',
  },
  editLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  editLinkText: {
    color: palette.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sectionTitle: {
    color: palette.textPrimary,
    fontWeight: '600',
  },
  editGoalsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  editGoalsText: {
    color: palette.primary,
  },
  goalsCard: {
    backgroundColor: palette.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  goalValue: {
    color: palette.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
  goalLabel: {
    color: palette.textSecondary,
    textAlign: 'center',
  },
  goalDivider: {
    width: 1,
    height: 40,
    backgroundColor: palette.border,
  },
  linkRow: {
    backgroundColor: palette.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  linkText: {
    color: palette.textPrimary,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add mobile/screens/Profile/Profile.tsx
git commit -m "feat(mobile): remove logout button and user email from Profile screen"
```

---

## Task 13: Delete mobile auth files

**Files:**
- Delete: `mobile/app/(auth)/` (entire directory)
- Delete: `mobile/app/logout-confirmation.tsx`
- Delete: `mobile/stores/useAuthStore.ts`
- Delete: `mobile/stores/secureStorage.ts`
- Delete: `mobile/services/auth.service.ts`
- Delete: `mobile/constants/auth.constants.ts`
- Delete: `mobile/hooks/useAuthGate.ts`
- Delete: `mobile/types/auth.types.ts`

- [ ] **Step 1: Delete all auth-related files**

```bash
rm -rf mobile/app/\(auth\)
rm mobile/app/logout-confirmation.tsx
rm mobile/stores/useAuthStore.ts
rm mobile/stores/secureStorage.ts
rm mobile/services/auth.service.ts
rm mobile/constants/auth.constants.ts
rm mobile/hooks/useAuthGate.ts
rm mobile/types/auth.types.ts
```

- [ ] **Step 2: Verify no remaining imports of deleted files**

```bash
grep -r "useAuthStore\|auth\.service\|secureStorage\|useAuthGate\|auth\.types\|auth\.constants\|logout-confirmation" mobile/app mobile/screens mobile/hooks mobile/stores mobile/services 2>/dev/null
```

Expected: no output (zero matches).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(mobile): delete all auth-related files"
```

---

## Task 14: Clean up env vars

**Files:**
- Modify: `mobile/.env`
- Modify: `mobile/constants/env.constants.ts`

- [ ] **Step 1: Update `mobile/.env`** — remove `AUTH_BASE_URL` and `TENANT_ID` lines

Replace the full file content with:

```
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.9:3001
```

- [ ] **Step 2: Update `mobile/constants/env.constants.ts`**

```ts
export const API_BASE_URL: string =
  process.env['EXPO_PUBLIC_API_BASE_URL'] ?? 'http://localhost:3001';
```

- [ ] **Step 3: Commit**

```bash
git add mobile/.env mobile/constants/env.constants.ts
git commit -m "feat(mobile): remove auth env vars"
```

---

## Task 15: Final verification

- [ ] **Step 1: Start the backend and verify it responds without a token**

```bash
cd server && npm run start:dev
```

In a separate terminal:
```bash
curl -s http://localhost:3001/api/diary/today
```

Expected: a JSON array (empty `[]` or meal entries), **not** a 401 response.

- [ ] **Step 2: Start the mobile app**

```bash
cd mobile && npx expo start
```

Open on device/simulator. Expected:
- App launches directly to onboarding (first run) or home tab (if onboarding already completed in the profile store)
- No login screen appears
- Home screen loads meals without error

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete auth removal — single-user setup"
```
