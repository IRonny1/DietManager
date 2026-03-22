import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { InvalidProfileStepException } from '../common/exceptions/domain.exception';
import { ProfileResponse } from './dto/profile-response.dto';

const mockProfileService = {
  getProfile: jest.fn(),
  saveStep: jest.fn(),
  completeProfile: jest.fn(),
};

const mockUser = { userId: 'user-id', tenantId: 'tenant-id' };

const emptyProfileResponse: ProfileResponse = {
  profile: {
    basicBodyInfo: null,
    healthConditions: null,
    dietPreferences: null,
    goals: null,
    isComplete: false,
    completionPercentage: 0,
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
};

const fullProfileResponse: ProfileResponse = {
  profile: {
    basicBodyInfo: {
      dateOfBirth: '1990-01-15',
      gender: 'male',
      heightCm: 180,
      weightKg: 85,
      targetWeightKg: 75,
    },
    healthConditions: {
      allergies: ['Gluten'],
      intolerances: [],
      medicalConditions: [],
      customAllergies: [],
      customIntolerances: [],
      customMedicalConditions: [],
    },
    dietPreferences: { dietType: 'keto', cuisinePreferences: ['Italian'] },
    goals: { primaryGoal: 'lose_weight', activityLevel: 'moderately_active' },
    isComplete: true,
    completionPercentage: 100,
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
};

describe('ProfileController', () => {
  let controller: ProfileController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [{ provide: ProfileService, useValue: mockProfileService }],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  describe('getProfile', () => {
    it('calls service.getProfile with userId and tenantId from JWT', async () => {
      mockProfileService.getProfile.mockResolvedValue(emptyProfileResponse);

      const result = await controller.getProfile(mockUser);

      expect(mockProfileService.getProfile).toHaveBeenCalledWith(
        mockUser.userId,
        mockUser.tenantId,
      );
      expect(result).toEqual(emptyProfileResponse);
    });
  });

  describe('saveStep', () => {
    it('calls service.saveStep with correct arguments for basicBodyInfo', async () => {
      mockProfileService.saveStep.mockResolvedValue(emptyProfileResponse);
      const body = {
        dateOfBirth: '1990-01-15',
        gender: 'male',
        heightCm: 180,
        weightKg: 85,
        targetWeightKg: 75,
      };

      await controller.saveStep('basicBodyInfo', body, mockUser);

      expect(mockProfileService.saveStep).toHaveBeenCalledWith(
        mockUser.userId,
        mockUser.tenantId,
        'basicBodyInfo',
        body,
      );
    });

    it('calls service.saveStep for each valid step name', async () => {
      mockProfileService.saveStep.mockResolvedValue(emptyProfileResponse);
      const validSteps = [
        'basicBodyInfo',
        'healthConditions',
        'dietPreferences',
        'goals',
      ];

      for (const stepName of validSteps) {
        await controller.saveStep(stepName, {}, mockUser);
        expect(mockProfileService.saveStep).toHaveBeenCalledWith(
          mockUser.userId,
          mockUser.tenantId,
          stepName,
          {},
        );
      }
    });

    it('throws InvalidProfileStepException for unknown step name', () => {
      expect(() => controller.saveStep('unknownStep', {}, mockUser)).toThrow(
        InvalidProfileStepException,
      );
    });

    it('throws InvalidProfileStepException with valid step names listed', () => {
      expect(() => controller.saveStep('step0', {}, mockUser)).toThrow(
        /basicBodyInfo/,
      );
    });

    it('does NOT call service.saveStep when step name is invalid', () => {
      try {
        void controller.saveStep('invalid', {}, mockUser);
      } catch {
        // expected
      }
      expect(mockProfileService.saveStep).not.toHaveBeenCalled();
    });
  });

  describe('completeProfile', () => {
    it('calls service.completeProfile with userId and tenantId', async () => {
      mockProfileService.completeProfile.mockResolvedValue(fullProfileResponse);

      const result = await controller.completeProfile(mockUser);

      expect(mockProfileService.completeProfile).toHaveBeenCalledWith(
        mockUser.userId,
        mockUser.tenantId,
      );
      expect(result.profile.isComplete).toBe(true);
    });

    it('returns full profile response on success', async () => {
      mockProfileService.completeProfile.mockResolvedValue(fullProfileResponse);

      const result = await controller.completeProfile(mockUser);

      expect(result.profile.completionPercentage).toBe(100);
    });
  });
});
