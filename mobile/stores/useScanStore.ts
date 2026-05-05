import { create } from 'zustand';
import type { FoodScanResult, RecentScan } from '@/types/scan.types';

const MAX_RECENT_SCANS = 5;

type ScanState = {
  recentScans: RecentScan[];
  currentScan: FoodScanResult | null;
  isScanning: boolean;
  error: string | null;
};

type ScanActions = {
  setCurrentScan: (scan: FoodScanResult | null) => void;
  setIsScanning: (loading: boolean) => void;
  addRecentScan: (scan: RecentScan) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
};

type ScanStore = ScanState & ScanActions;

const initialState: ScanState = {
  recentScans: [],
  currentScan: null,
  isScanning: false,
  error: null,
};

export const useScanStore = create<ScanStore>((set) => ({
  ...initialState,
  setCurrentScan: (scan) => set({ currentScan: scan }),
  setIsScanning: (loading) => set({ isScanning: loading }),
  addRecentScan: (scan) =>
    set((state) => ({
      recentScans: [scan, ...state.recentScans].slice(0, MAX_RECENT_SCANS),
    })),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
