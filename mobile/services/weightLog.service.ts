import { authenticatedFetch } from '@/api/authenticatedFetch';
import type { WeightEntry } from '@/types/weightTracking.types';
export type { WeightEntry };

export async function getWeightEntries(
  dateRange?: { from: string; to: string },
): Promise<WeightEntry[]> {
  const params = new URLSearchParams();
  if (dateRange) {
    params.set('from', dateRange.from);
    params.set('to', dateRange.to);
  }
  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await authenticatedFetch(`/api/weight${query}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch weight entries: ${response.status}`);
  }
  return response.json() as Promise<WeightEntry[]>;
}

export async function getLatestWeight(): Promise<WeightEntry | null> {
  const entries = await getWeightEntries();
  return entries.length > 0 ? entries[0] : null;
}

export async function addWeightEntry(
  entry: Omit<WeightEntry, 'id'>,
): Promise<WeightEntry> {
  const response = await authenticatedFetch('/api/weight', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
  if (!response.ok) {
    throw new Error(`Failed to add weight entry: ${response.status}`);
  }
  return response.json() as Promise<WeightEntry>;
}

export async function deleteWeightEntry(id: string): Promise<void> {
  const response = await authenticatedFetch(`/api/weight/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete weight entry: ${response.status}`);
  }
}

export function getWeightChange(sortedEntries: WeightEntry[]): number {
  if (sortedEntries.length < 2) return 0;
  const latest = sortedEntries[0].weightKg;
  const oldest = sortedEntries[sortedEntries.length - 1].weightKg;
  return parseFloat((latest - oldest).toFixed(1));
}

export function getWeightGoal(): number {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useProfileStore } = require('@/stores/useProfileStore');
  return useProfileStore.getState().profile?.basicBodyInfo?.targetWeightKg ?? 0;
}
