import { authenticatedFetch } from '@/api/authenticatedFetch';
import type { MealEntry } from '@/types/diary.types';

export async function getTodayMeals(): Promise<MealEntry[]> {
  const response = await authenticatedFetch('/api/diary/today');

  if (!response.ok) {
    throw new Error(`Failed to fetch today's meals: ${response.status}`);
  }

  return response.json() as Promise<MealEntry[]>;
}

export async function getMeals(dateRange: { from: string; to: string }): Promise<MealEntry[]> {
  const params = new URLSearchParams({ from: dateRange.from, to: dateRange.to });
  const response = await authenticatedFetch(`/api/diary?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch meals: ${response.status}`);
  }

  return response.json() as Promise<MealEntry[]>;
}

export async function addMeal(meal: Omit<MealEntry, 'id'>): Promise<MealEntry> {
  const response = await authenticatedFetch('/api/diary', {
    method: 'POST',
    body: JSON.stringify(meal),
  });

  if (!response.ok) {
    throw new Error(`Failed to add meal: ${response.status}`);
  }

  return response.json() as Promise<MealEntry>;
}

export async function updateMeal(id: string, updates: Partial<MealEntry>): Promise<MealEntry> {
  const response = await authenticatedFetch(`/api/diary/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update meal: ${response.status}`);
  }

  return response.json() as Promise<MealEntry>;
}

export async function deleteMeal(id: string): Promise<void> {
  const response = await authenticatedFetch(`/api/diary/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete meal: ${response.status}`);
  }
}
