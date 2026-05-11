export interface WaterEntry {
  id: string;
  amountMl: number;
  loggedAt: string;  // ISO datetime
  date: string;      // YYYY-MM-DD
}

export interface WaterTrackingState {
  todayTotal: number;
  dailyGoalMl: number;
  entries: WaterEntry[];
}
