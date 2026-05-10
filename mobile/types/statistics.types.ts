export interface NutritionStats {
  avgDailyCalories: number;
  onTargetDays: number;
  totalDays: number;
  currentStreak: number;
  calorieTrend: Array<{ date: string; calories: number }>;
  macroTrend: Array<{ date: string; protein: number; fat: number; carbs: number }>;
  macroSplit: { protein: number; fat: number; carbs: number };
  caloriesByMealType: { breakfast: number; lunch: number; dinner: number; snacks: number };
}

export interface BodyStats {
  currentWeight: number;
  weightChange: number;
  goalWeight: number;
  progressPercent: number;
  weightTrend: Array<{ date: string; weight: number }>;
  bmi: number;
  bmiCategory: 'underweight' | 'normal' | 'overweight' | 'obese';
}

export type StatTab = 'nutrition' | 'body';
export type DatePeriod = 'week' | 'month';
export type MacroFilter = 'protein' | 'fat' | 'carbs';
