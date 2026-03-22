import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import {
  ACTIVITY_LEVEL_VALUES,
  PRIMARY_GOAL_VALUES,
} from '../constants/profile-steps.constants';

export class GoalsDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(PRIMARY_GOAL_VALUES)
  primaryGoal: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(ACTIVITY_LEVEL_VALUES)
  activityLevel: string;
}
