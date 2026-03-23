export interface MealEntry {
  id: string;
  name: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  calories: number;
  protein: number;   // grams
  fat: number;       // grams
  carbs: number;     // grams
  portionGrams: number;
  imageUri?: string;
  loggedAt: string;  // ISO datetime string, e.g. "2026-03-23T08:30:00Z"
  date: string;      // YYYY-MM-DD, e.g. "2026-03-23"
}

export interface DailyLog {
  date: string;          // YYYY-MM-DD
  meals: MealEntry[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  calorieGoal: number;
}
