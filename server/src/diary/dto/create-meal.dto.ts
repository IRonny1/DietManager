import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const;

export class CreateMealDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsIn(CATEGORIES)
  category: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  calories: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  protein: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  fat: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  carbs: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  portionGrams: number;

  @IsOptional()
  @IsString()
  imageUri?: string;

  @IsNotEmpty()
  @IsString()
  loggedAt: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;
}
