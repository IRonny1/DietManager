import { IsDateString, IsInt, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddWaterDto {
  @ApiProperty({ description: 'Amount in milliliters' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  amountMl: number;

  @ApiProperty({ description: 'YYYY-MM-DD — the local date on the user device' })
  @IsNotEmpty()
  @IsDateString()
  date: string;
}
