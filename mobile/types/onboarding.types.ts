// mobile/types/onboarding.types.ts
export type GoalMethod = 'calculate' | 'manual';

export type Gender = 'male' | 'female' | 'other';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extremely_active';

export type PrimaryGoal = 'lose_weight' | 'maintain_weight' | 'gain_weight';

export interface PersonalData {
  age: number;
  gender: Gender;
  weightKg: number;
  heightCm: number;
}

export interface ActivityGoalData {
  activityLevel: ActivityLevel;
  primaryGoal: PrimaryGoal;
}

export interface OnboardingData {
  goalMethod: GoalMethod | null;
  personalData: PersonalData | null;
  activityGoal: ActivityGoalData | null;
  calorieGoal: number | null;
}

export interface MacroBreakdown {
  protein: number;
  carbs: number;
  fat: number;
}
