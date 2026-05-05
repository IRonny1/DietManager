import { IsNotEmpty, IsString } from 'class-validator';

export class AnalyzeFoodDto {
  @IsString()
  @IsNotEmpty()
  imageBase64!: string;
}
