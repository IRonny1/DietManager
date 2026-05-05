export interface FoodScanResult {
  name: string;
  category: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  portionGrams: number;
  confidence: 'high' | 'medium' | 'low';
  ingredients: string[];
  imageUri: string;
}

export interface RecentScan extends FoodScanResult {
  id: string;
  scannedAt: string;
}
