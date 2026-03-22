import { IsArray, IsOptional, IsString } from 'class-validator';

export class HealthConditionsDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergies: string[] = [];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  intolerances: string[] = [];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medicalConditions: string[] = [];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  customAllergies: string[] = [];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  customIntolerances: string[] = [];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  customMedicalConditions: string[] = [];
}
