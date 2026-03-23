import { ActivityLevel, Gender, PrimaryGoal } from '../types/onboarding.types';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extremely_active: 1.9,
};

const GOAL_ADJUSTMENTS: Record<PrimaryGoal, number> = {
  lose_weight: -500,
  maintain_weight: 0,
  gain_weight: 300,
};

export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') return base + 5;
  if (gender === 'female') return base - 161;
  // 'other': use average of male/female formulas ((base+5) + (base-161)) / 2
  return base - 78;
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

export function calculateCalorieGoal(tdee: number, primaryGoal: PrimaryGoal): number {
  return Math.max(1200, tdee + GOAL_ADJUSTMENTS[primaryGoal]);
}

export interface MacroBreakdown {
  protein: number;
  carbs: number;
  fat: number;
}

export function calculateMacros(calorieGoal: number): MacroBreakdown {
  return {
    protein: Math.round((calorieGoal * 0.4) / 4),
    carbs: Math.round((calorieGoal * 0.3) / 4),
    fat: Math.round((calorieGoal * 0.3) / 9),
  };
}
