import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const;

export class UpdateMealDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(CATEGORIES)
  category?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  calories?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  protein?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fat?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  carbs?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  portionGrams?: number;

  @IsOptional()
  @IsString()
  imageUri?: string;

  @IsOptional()
  @IsString()
  loggedAt?: string;

  @IsOptional()
  @IsString()
  date?: string;
}
