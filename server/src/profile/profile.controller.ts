import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtValidatedUser } from '../common/types/jwt.types';
import { ProfileService } from './profile.service';
import { BasicBodyInfoDto } from './dto/basic-body-info.dto';
import { HealthConditionsDto } from './dto/health-conditions.dto';
import { DietPreferencesDto } from './dto/diet-preferences.dto';
import { GoalsDto } from './dto/goals.dto';
import { ProfileResponse } from './dto/profile-response.dto';
import { InvalidProfileStepException } from '../common/exceptions/domain.exception';
import { VALID_STEP_NAMES } from './constants/profile-steps.constants';

type StepDto =
  | BasicBodyInfoDto
  | HealthConditionsDto
  | DietPreferencesDto
  | GoalsDto;

@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  getProfile(@CurrentUser() user: JwtValidatedUser): Promise<ProfileResponse> {
    return this.profileService.getProfile(user.userId, user.tenantId);
  }

  @Put('step/:stepName')
  @ApiOperation({ summary: 'Save data for a single profile wizard step' })
  saveStep(
    @Param('stepName') stepName: string,
    @Body() body: unknown,
    @CurrentUser() user: JwtValidatedUser,
  ): Promise<ProfileResponse> {
    if (!VALID_STEP_NAMES.includes(stepName as never)) {
      throw new InvalidProfileStepException(stepName, VALID_STEP_NAMES);
    }
    return this.profileService.saveStep(
      user.userId,
      user.tenantId,
      stepName,
      body as StepDto,
    );
  }

  @Post('complete')
  @ApiOperation({ summary: 'Mark the profile as fully complete' })
  completeProfile(
    @CurrentUser() user: JwtValidatedUser,
  ): Promise<ProfileResponse> {
    return this.profileService.completeProfile(user.userId, user.tenantId);
  }
}
