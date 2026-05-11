import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddWaterDto {
  @ApiProperty({ description: 'Amount in milliliters' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  amountMl: number;
}
