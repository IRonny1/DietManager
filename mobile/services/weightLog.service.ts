export interface WeightEntry {
  id: string;
  date: string;      // YYYY-MM-DD
  weightKg: number;
  note?: string;
}

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

export function addWeightEntry(entry: Omit<WeightEntry, 'id'>): Promise<WeightEntry> {
  const newEntry: WeightEntry = { ...entry, id: Date.now().toString() };
  entries = [newEntry, ...entries];
  return Promise.resolve(newEntry);
}

export function deleteWeightEntry(id: string): Promise<void> {
  entries = entries.filter((e) => e.id !== id);
  return Promise.resolve();
}
