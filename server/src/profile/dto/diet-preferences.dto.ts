import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { DIET_TYPE_VALUES } from '../constants/profile-steps.constants';

export class DietPreferencesDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(DIET_TYPE_VALUES)
  dietType: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cuisinePreferences: string[] = [];
}
