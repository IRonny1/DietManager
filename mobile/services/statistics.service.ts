// mobile/services/statistics.service.ts
import type { MealEntry } from '@/types/diary.types';
import type { NutritionStats, BodyStats } from '@/types/statistics.types';
import { getMeals } from '@/services/diary.service';
import { getWeightEntries } from '@/services/weightLog.service';

// These constants are mocked until Epic 09 wires real profile data.
const MOCK_CALORIE_GOAL = 2000;
const MOCK_GOAL_WEIGHT_KG = 72;
const MOCK_HEIGHT_CM = 175;

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function getBMICategory(bmi: number): BodyStats['bmiCategory'] {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

export function calculateMacroSplit(
  meals: MealEntry[],
): NutritionStats['macroSplit'] {
  const totals = meals.reduce(
    (acc, m) => ({ protein: acc.protein + m.protein, fat: acc.fat + m.fat, carbs: acc.carbs + m.carbs }),
    { protein: 0, fat: 0, carbs: 0 },
  );
  const total = totals.protein + totals.fat + totals.carbs;
  if (total === 0) return { protein: 0, fat: 0, carbs: 0 };
  return {
    protein: Math.round((totals.protein / total) * 100),
    fat: Math.round((totals.fat / total) * 100),
    carbs: Math.round((totals.carbs / total) * 100),
  };
}

export function calculateStreak(
  calorieTrend: Array<{ date: string; calories: number }>,
  calorieGoal: number,
): number {
  if (calorieTrend.length === 0) return 0;
  const sorted = [...calorieTrend].sort((a, b) => b.date.localeCompare(a.date));
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  let expectedDate = today;
  for (const day of sorted) {
    if (day.date !== expectedDate) break;
    if (day.calories >= calorieGoal * 0.8 && day.calories <= calorieGoal * 1.2) {
      streak++;
      const d = new Date(expectedDate + 'T00:00:00');
      d.setDate(d.getDate() - 1);
      expectedDate = d.toISOString().split('T')[0];
    } else {
      break;
    }
  }
  return streak;
}

export async function getNutritionStats(
  dateRange: { from: string; to: string },
): Promise<NutritionStats> {
  const meals = await getMeals(dateRange);

  const byDate = new Map<string, MealEntry[]>();
  for (const meal of meals) {
    if (!byDate.has(meal.date)) byDate.set(meal.date, []);
    byDate.get(meal.date)!.push(meal);
  }

  const calorieTrend = Array.from(byDate.entries()).map(([date, dayMeals]) => ({
    date,
    calories: dayMeals.reduce((sum, m) => sum + m.calories, 0),
  }));

  const macroTrend = Array.from(byDate.entries()).map(([date, dayMeals]) => ({
    date,
    protein: dayMeals.reduce((sum, m) => sum + m.protein, 0),
    fat: dayMeals.reduce((sum, m) => sum + m.fat, 0),
    carbs: dayMeals.reduce((sum, m) => sum + m.carbs, 0),
  }));

  const totalCalories = calorieTrend.reduce((sum, d) => sum + d.calories, 0);
  const totalDays = calorieTrend.length || 1;
  const avgDailyCalories = Math.round(totalCalories / totalDays);

  const onTargetDays = calorieTrend.filter(
    (d) => d.calories >= MOCK_CALORIE_GOAL * 0.8 && d.calories <= MOCK_CALORIE_GOAL * 1.2,
  ).length;

  const caloriesByMealType = { breakfast: 0, lunch: 0, dinner: 0, snacks: 0 };
  for (const meal of meals) {
    const cat = meal.category.toLowerCase();
    if (cat === 'breakfast') caloriesByMealType.breakfast += meal.calories;
    else if (cat === 'lunch') caloriesByMealType.lunch += meal.calories;
    else if (cat === 'dinner') caloriesByMealType.dinner += meal.calories;
    else caloriesByMealType.snacks += meal.calories;
  }

  return {
    avgDailyCalories,
    onTargetDays,
    totalDays,
    currentStreak: calculateStreak(calorieTrend, MOCK_CALORIE_GOAL),
    calorieTrend,
    macroTrend,
    macroSplit: calculateMacroSplit(meals),
    caloriesByMealType,
  };
}

export async function getBodyStats(
  dateRange: { from: string; to: string },
): Promise<BodyStats> {
  const [rangeEntries, allEntries] = await Promise.all([
    getWeightEntries(dateRange),
    getWeightEntries(),
  ]);

  const currentWeight = rangeEntries.length > 0 ? rangeEntries[0].weightKg : 0;
  const oldestWeight =
    allEntries.length > 0 ? allEntries[allEntries.length - 1].weightKg : currentWeight;
  const weightChange = Math.round((currentWeight - oldestWeight) * 10) / 10;

  const goalWeight = MOCK_GOAL_WEIGHT_KG;
  const totalToLose = oldestWeight - goalWeight;
  const progressPercent =
    totalToLose <= 0
      ? 100
      : Math.min(100, Math.round(((oldestWeight - currentWeight) / totalToLose) * 100));

  const weightTrend = [...rangeEntries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(({ date, weightKg }) => ({ date, weight: weightKg }));

  const bmi = calculateBMI(currentWeight > 0 ? currentWeight : 70, MOCK_HEIGHT_CM);

  return {
    currentWeight,
    weightChange,
    goalWeight,
    progressPercent,
    weightTrend,
    bmi,
    bmiCategory: getBMICategory(bmi),
  };
}
