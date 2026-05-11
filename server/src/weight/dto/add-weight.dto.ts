import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddWeightDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(20)
  @Max(500)
  weightKg: number;

  @ApiProperty({ description: 'YYYY-MM-DD' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}
