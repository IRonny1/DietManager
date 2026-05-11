export interface MealResponseDto {
  id: string;
  name: string;
  category: string | null;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  portionGrams: number;
  imageUri: string | null;
  loggedAt: string;
  date: string;
}
