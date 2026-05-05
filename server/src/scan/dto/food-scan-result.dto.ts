export class FoodScanResultDto {
  name!: string;
  category!: string;
  calories!: number;
  protein!: number;
  fat!: number;
  carbs!: number;
  portionGrams!: number;
  confidence!: 'high' | 'medium' | 'low';
  ingredients!: string[];
  recognized!: boolean;
}
