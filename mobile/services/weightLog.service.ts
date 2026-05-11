import type { WeightEntry } from '@/types/weightTracking.types';
export type { WeightEntry };

let entries: WeightEntry[] = [
  { id: '1', date: '2026-05-08', weightKg: 75.5 },
  { id: '2', date: '2026-05-04', weightKg: 75.7 },
  { id: '3', date: '2026-04-30', weightKg: 76.0 },
  { id: '4', date: '2026-04-26', weightKg: 76.3 },
  { id: '5', date: '2026-04-22', weightKg: 76.5 },
];

export function getWeightEntries(
  dateRange?: { from: string; to: string },
): Promise<WeightEntry[]> {
  const filtered = dateRange
    ? entries.filter((e) => e.date >= dateRange.from && e.date <= dateRange.to)
    : entries;
  return Promise.resolve([...filtered].sort((a, b) => b.date.localeCompare(a.date)));
}

export function getLatestWeight(): Promise<WeightEntry | null> {
  if (entries.length === 0) return Promise.resolve(null);
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  return Promise.resolve(sorted[0]);
}

export function addWeightEntry(entry: Omit<WeightEntry, 'id'>): Promise<WeightEntry> {
  const newEntry: WeightEntry = { ...entry, id: Date.now().toString() };
  entries = [newEntry, ...entries];
  return Promise.resolve(newEntry);
}

export function deleteWeightEntry(id: string): Promise<void> {
  entries = entries.filter((e) => e.id !== id);
  return Promise.resolve();
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
