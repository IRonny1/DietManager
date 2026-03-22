import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { GENDER_VALUES } from '../constants/profile-steps.constants';

@ValidatorConstraint({ name: 'IsAdult', async: false })
class IsAdultConstraint implements ValidatorConstraintInterface {
  validate(dateOfBirth: string): boolean {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();
    const adjustedAge =
      monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
    return adjustedAge >= 13;
  }

  defaultMessage(): string {
    return 'User must be at least 13 years old';
  }
}

export class BasicBodyInfoDto {
  @IsNotEmpty()
  @IsDateString()
  @Validate(IsAdultConstraint)
  dateOfBirth: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(GENDER_VALUES)
  gender: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(50)
  @Max(300)
  heightCm: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(20)
  @Max(500)
  weightKg: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(20)
  @Max(500)
  targetWeightKg: number;
}
