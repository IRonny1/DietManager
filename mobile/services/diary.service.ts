import type { MealEntry } from '@/types/diary.types';

let meals: MealEntry[] = [
  {
    id: '1',
    name: 'Oatmeal with Berries',
    category: 'Breakfast',
    calories: 320,
    protein: 12,
    fat: 6,
    carbs: 58,
    portionGrams: 300,
    loggedAt: new Date().toISOString().replace(/T\d{2}:\d{2}.*/, 'T08:30:00.000Z'),
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    category: 'Lunch',
    calories: 528,
    protein: 48,
    fat: 22,
    carbs: 30,
    portionGrams: 450,
    loggedAt: new Date().toISOString().replace(/T\d{2}:\d{2}.*/, 'T12:45:00.000Z'),
    date: new Date().toISOString().split('T')[0],
  },
];

let nextId = 3;

export async function getTodayMeals(): Promise<MealEntry[]> {
  const today = new Date().toISOString().split('T')[0];
  return meals.filter((m) => m.date === today);
}

export async function getMeals(dateRange: { from: string; to: string }): Promise<MealEntry[]> {
  return meals.filter((m) => m.date >= dateRange.from && m.date <= dateRange.to);
}

export async function addMeal(meal: Omit<MealEntry, 'id'>): Promise<MealEntry> {
  const newMeal: MealEntry = { ...meal, id: String(nextId++) };
  meals = [...meals, newMeal];
  return newMeal;
}

export async function updateMeal(id: string, updates: Partial<MealEntry>): Promise<MealEntry> {
  const index = meals.findIndex((m) => m.id === id);
  if (index === -1) throw new Error(`Meal ${id} not found`);
  const updated = { ...meals[index], ...updates };
  meals = meals.map((m) => (m.id === id ? updated : m));
  return updated;
}

export async function deleteMeal(id: string): Promise<void> {
  meals = meals.filter((m) => m.id !== id);
}
