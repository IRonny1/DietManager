import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MEAL_CATEGORIES } from '../constants/meal.constants';

export class CreateMealDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: MEAL_CATEGORIES })
  @IsNotEmpty()
  @IsIn(MEAL_CATEGORIES)
  category: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  calories: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  protein: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  fat: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  carbs: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  portionGrams: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUri?: string;

  @ApiProperty({ description: 'ISO datetime string' })
  @IsNotEmpty()
  @IsString()
  loggedAt: string;

  @ApiProperty({ description: 'YYYY-MM-DD' })
  @IsNotEmpty()
  @IsDateString()
  date: string;
}
