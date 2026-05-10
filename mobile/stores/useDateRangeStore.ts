import { create } from 'zustand';

interface DateRangeStoreState {
  confirmedRange: { from: string; to: string } | null;
  setConfirmedRange: (range: { from: string; to: string } | null) => void;
}

export const useDateRangeStore = create<DateRangeStoreState>((set) => ({
  confirmedRange: null,
  setConfirmedRange: (range) => set({ confirmedRange: range }),
}));
