import type { WaterEntry } from '@/types/waterTracking.types';

let entries: WaterEntry[] = [];
let dailyGoalMl = 2000;

function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayWaterLog(): Promise<{
  entries: WaterEntry[];
  total: number;
  goal: number;
}> {
  const today = toLocalDateStr(new Date());
  const todayEntries = entries
    .filter((e) => e.date === today)
    .sort((a, b) => b.loggedAt.localeCompare(a.loggedAt));
  const total = todayEntries.reduce((sum, e) => sum + e.amountMl, 0);
  return Promise.resolve({ entries: todayEntries, total, goal: dailyGoalMl });
}

export function addWaterEntry(amountMl: number): Promise<WaterEntry> {
  const now = new Date();
  const entry: WaterEntry = {
    id: Date.now().toString(),
    amountMl,
    loggedAt: now.toISOString(),
    date: toLocalDateStr(now),
  };
  entries = [entry, ...entries];
  return Promise.resolve(entry);
}

export function deleteWaterEntry(id: string): Promise<void> {
  entries = entries.filter((e) => e.id !== id);
  return Promise.resolve();
}

export function clearTodayLog(): Promise<void> {
  const today = toLocalDateStr(new Date());
  entries = entries.filter((e) => e.date !== today);
  return Promise.resolve();
}

export function updateDailyGoal(goalMl: number): Promise<void> {
  dailyGoalMl = goalMl;
  return Promise.resolve();
}
