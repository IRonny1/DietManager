import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const;

export class UpdateMealDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: CATEGORIES })
  @IsOptional()
  @IsIn(CATEGORIES)
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  calories?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  protein?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  fat?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  carbs?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  portionGrams?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUri?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  loggedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  date?: string;
}
