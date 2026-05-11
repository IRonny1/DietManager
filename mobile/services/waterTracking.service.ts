import { authenticatedFetch } from '@/api/authenticatedFetch';
import type { WaterEntry } from '@/types/waterTracking.types';

export async function getTodayWaterLog(): Promise<{
  entries: WaterEntry[];
  total: number;
  goal: number;
}> {
  const response = await authenticatedFetch('/api/water/today');
  if (!response.ok) {
    throw new Error(`Failed to fetch water log: ${response.status}`);
  }
  return response.json() as Promise<{ entries: WaterEntry[]; total: number; goal: number }>;
}

function localDateStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export async function addWaterEntry(amountMl: number): Promise<WaterEntry> {
  const response = await authenticatedFetch('/api/water', {
    method: 'POST',
    body: JSON.stringify({ amountMl, date: localDateStr() }),
  });
  if (!response.ok) {
    throw new Error(`Failed to add water entry: ${response.status}`);
  }
  return response.json() as Promise<WaterEntry>;
}

export async function deleteWaterEntry(id: string): Promise<void> {
  const response = await authenticatedFetch(`/api/water/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete water entry: ${response.status}`);
  }
}

export async function clearTodayLog(): Promise<void> {
  const response = await authenticatedFetch('/api/water/today', {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to clear today's water log: ${response.status}`);
  }
}

export async function updateDailyGoal(goalMl: number): Promise<void> {
  const response = await authenticatedFetch('/api/water/goal', {
    method: 'PATCH',
    body: JSON.stringify({ goalMl }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update water goal: ${response.status}`);
  }
}
