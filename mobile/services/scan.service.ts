import { authenticatedFetch } from '@/api/authenticatedFetch';
import type { FoodScanResult } from '@/types/scan.types';

export class UnrecognizedFoodError extends Error {
  constructor() {
    super('Food could not be recognized');
    this.name = 'UnrecognizedFoodError';
  }
}

interface ScanAnalysisResponse {
  name: string;
  category: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  portionGrams: number;
  confidence: 'high' | 'medium' | 'low';
  ingredients: string[];
  recognized: boolean;
}

export async function analyzeFood(
  imageBase64: string,
  imageUri: string,
): Promise<FoodScanResult> {
  const response = await authenticatedFetch('/api/scan/analyze', {
    method: 'POST',
    body: JSON.stringify({ imageBase64 }),
  });

  if (!response.ok) {
    throw new Error(`Scan request failed with status ${response.status}`);
  }

  const data = (await response.json()) as ScanAnalysisResponse;

  if (!data.recognized) {
    throw new UnrecognizedFoodError();
  }

  return {
    name: data.name,
    category: data.category,
    calories: data.calories,
    protein: data.protein,
    fat: data.fat,
    carbs: data.carbs,
    portionGrams: data.portionGrams,
    confidence: data.confidence,
    ingredients: data.ingredients,
    imageUri,
  };
}
