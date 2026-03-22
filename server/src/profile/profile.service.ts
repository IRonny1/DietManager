import { Injectable } from '@nestjs/common';
import { UserProfile } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  InvalidProfileStepException,
  ProfileIncompleteException,
} from '../common/exceptions/domain.exception';
import { BasicBodyInfoDto } from './dto/basic-body-info.dto';
import { HealthConditionsDto } from './dto/health-conditions.dto';
import { DietPreferencesDto } from './dto/diet-preferences.dto';
import { GoalsDto } from './dto/goals.dto';
import { ProfileData, ProfileResponse } from './dto/profile-response.dto';
import {
  ProfileStepName,
  VALID_STEP_NAMES,
} from './constants/profile-steps.constants';

type StepDto =
  | BasicBodyInfoDto
  | HealthConditionsDto
  | DietPreferencesDto
  | GoalsDto;

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(
    userId: string,
    _tenantId: string,
  ): Promise<ProfileResponse> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    return { profile: this.toProfileResponse(profile) };
  }

  async saveStep(
    userId: string,
    tenantId: string,
    stepName: string,
    data: StepDto,
  ): Promise<ProfileResponse> {
    if (!VALID_STEP_NAMES.includes(stepName as ProfileStepName)) {
      throw new InvalidProfileStepException(stepName, VALID_STEP_NAMES);
    }

    const updateData = this.buildStepUpdateData(
      stepName as ProfileStepName,
      data,
    );

    const profile = await this.prisma.userProfile.upsert({
      where: { userId },
      create: { userId, tenantId, ...updateData },
      update: updateData,
    });

    return { profile: this.toProfileResponse(profile) };
  }

  async completeProfile(
    userId: string,
    tenantId: string,
  ): Promise<ProfileResponse> {
    const existing = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (this.calculateCompletionPercentage(existing) < 100) {
      throw new ProfileIncompleteException();
    }

    const profile = await this.prisma.userProfile.upsert({
      where: { userId },
      create: { userId, tenantId, isComplete: true },
      update: { isComplete: true },
    });

    return { profile: this.toProfileResponse(profile) };
  }

  private buildStepUpdateData(
    stepName: ProfileStepName,
    data: StepDto,
  ): Partial<UserProfile> {
    switch (stepName) {
      case 'basicBodyInfo': {
        const d = data as BasicBodyInfoDto;
        return {
          dateOfBirth: d.dateOfBirth,
          gender: d.gender,
          heightCm: d.heightCm,
          weightKg: d.weightKg,
          targetWeightKg: d.targetWeightKg,
        };
      }
      case 'healthConditions': {
        const d = data as HealthConditionsDto;
        return {
          allergies: d.allergies,
          intolerances: d.intolerances,
          medicalConditions: d.medicalConditions,
          customAllergies: d.customAllergies,
          customIntolerances: d.customIntolerances,
          customMedicalConditions: d.customMedicalConditions,
        };
      }
      case 'dietPreferences': {
        const d = data as DietPreferencesDto;
        return {
          dietType: d.dietType,
          cuisinePreferences: d.cuisinePreferences,
        };
      }
      case 'goals': {
        const d = data as GoalsDto;
        return {
          primaryGoal: d.primaryGoal,
          activityLevel: d.activityLevel,
        };
      }
    }
  }

  /**
   * Returns what percentage of the 4 wizard steps have been completed.
   *
   * - basicBodyInfo: all 5 required fields must be non-null
   * - healthConditions: the wizard is sequential, so health is "filled" once
   *   the user has submitted it. Since all fields are optional arrays (defaulting
   *   to []), we infer it was submitted if the profile row exists AND either arrays
   *   have entries OR a later step was also saved (proving the user progressed past it).
   * - dietPreferences: dietType field is required and non-null when saved
   * - goals: primaryGoal and activityLevel are required and non-null when saved
   */
  private calculateCompletionPercentage(profile: UserProfile | null): number {
    if (!profile) return 0;

    const filled = [
      this.isBasicBodyInfoFilled(profile),
      this.isHealthConditionsFilled(profile),
      this.isDietPreferencesFilled(profile),
      this.isGoalsFilled(profile),
    ].filter(Boolean).length;

    return Math.round((filled / 4) * 100);
  }

  private isBasicBodyInfoFilled(profile: UserProfile): boolean {
    return (
      profile.dateOfBirth !== null &&
      profile.gender !== null &&
      profile.heightCm !== null &&
      profile.weightKg !== null &&
      profile.targetWeightKg !== null
    );
  }

  /**
   * Health conditions step fields are all optional arrays (user may have no allergies etc.).
   * We consider this step "filled" if any array has entries OR if a later step has been
   * saved (meaning the user progressed past step 1 in the sequential wizard flow).
   */
  private isHealthConditionsFilled(profile: UserProfile): boolean {
    const hasAnyEntry =
      profile.allergies.length > 0 ||
      profile.intolerances.length > 0 ||
      profile.medicalConditions.length > 0 ||
      profile.customAllergies.length > 0 ||
      profile.customIntolerances.length > 0 ||
      profile.customMedicalConditions.length > 0;

    const laterStepSaved =
      this.isDietPreferencesFilled(profile) || this.isGoalsFilled(profile);

    return hasAnyEntry || laterStepSaved;
  }

  private isDietPreferencesFilled(profile: UserProfile): boolean {
    return profile.dietType !== null;
  }

  private isGoalsFilled(profile: UserProfile): boolean {
    return profile.primaryGoal !== null && profile.activityLevel !== null;
  }

  private toProfileResponse(profile: UserProfile | null): ProfileData {
    if (!profile) {
      return {
        basicBodyInfo: null,
        healthConditions: null,
        dietPreferences: null,
        goals: null,
        isComplete: false,
        completionPercentage: 0,
        updatedAt: new Date().toISOString(),
      };
    }

    return {
      basicBodyInfo: this.isBasicBodyInfoFilled(profile)
        ? {
            dateOfBirth: profile.dateOfBirth!,
            gender: profile.gender!,
            heightCm: profile.heightCm!,
            weightKg: profile.weightKg!,
            targetWeightKg: profile.targetWeightKg!,
          }
        : null,
      healthConditions: this.isHealthConditionsFilled(profile)
        ? {
            allergies: profile.allergies,
            intolerances: profile.intolerances,
            medicalConditions: profile.medicalConditions,
            customAllergies: profile.customAllergies,
            customIntolerances: profile.customIntolerances,
            customMedicalConditions: profile.customMedicalConditions,
          }
        : null,
      dietPreferences: this.isDietPreferencesFilled(profile)
        ? {
            dietType: profile.dietType!,
            cuisinePreferences: profile.cuisinePreferences,
          }
        : null,
      goals: this.isGoalsFilled(profile)
        ? {
            primaryGoal: profile.primaryGoal!,
            activityLevel: profile.activityLevel!,
          }
        : null,
      isComplete: profile.isComplete,
      completionPercentage: this.calculateCompletionPercentage(profile),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }
}
