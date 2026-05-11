import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGoalDto {
  @ApiProperty({ description: 'Daily goal in milliliters' })
  @IsNotEmpty()
  @IsInt()
  @Min(100)
  goalMl: number;
}
