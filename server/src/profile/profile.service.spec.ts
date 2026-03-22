import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  InvalidProfileStepException,
  ProfileIncompleteException,
} from '../common/exceptions/domain.exception';

const mockPrismaService = {
  userProfile: {
    findUnique: jest.fn(),
    upsert: jest.fn(),
  },
};

const BASE_PROFILE = {
  id: 'profile-id',
  userId: 'user-id',
  tenantId: 'tenant-id',
  dateOfBirth: null,
  gender: null,
  heightCm: null,
  weightKg: null,
  targetWeightKg: null,
  allergies: [],
  intolerances: [],
  medicalConditions: [],
  customAllergies: [],
  customIntolerances: [],
  customMedicalConditions: [],
  dietType: null,
  cuisinePreferences: [],
  primaryGoal: null,
  activityLevel: null,
  isComplete: false,
  createdAt: new Date(),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  describe('getProfile', () => {
    it('returns empty profile when no record exists', async () => {
      mockPrismaService.userProfile.findUnique.mockResolvedValue(null);

      const result = await service.getProfile('user-id', 'tenant-id');

      expect(result.profile.basicBodyInfo).toBeNull();
      expect(result.profile.healthConditions).toBeNull();
      expect(result.profile.dietPreferences).toBeNull();
      expect(result.profile.goals).toBeNull();
      expect(result.profile.isComplete).toBe(false);
      expect(result.profile.completionPercentage).toBe(0);
    });

    it('returns partial profile when only some steps are saved', async () => {
      mockPrismaService.userProfile.findUnique.mockResolvedValue({
        ...BASE_PROFILE,
        dateOfBirth: '1990-01-15',
        gender: 'male',
        heightCm: 180,
        weightKg: 85,
        targetWeightKg: 75,
      });

      const result = await service.getProfile('user-id', 'tenant-id');

      expect(result.profile.basicBodyInfo).not.toBeNull();
      expect(result.profile.healthConditions).toBeNull();
      expect(result.profile.completionPercentage).toBe(25);
    });

    it('returns full profile when all steps are saved', async () => {
      mockPrismaService.userProfile.findUnique.mockResolvedValue({
        ...BASE_PROFILE,
        dateOfBirth: '1990-01-15',
        gender: 'male',
        heightCm: 180,
        weightKg: 85,
        targetWeightKg: 75,
        allergies: ['Gluten'],
        dietType: 'mediterranean',
        cuisinePreferences: ['Italian'],
        primaryGoal: 'lose_weight',
        activityLevel: 'moderately_active',
        isComplete: true,
      });

      const result = await service.getProfile('user-id', 'tenant-id');

      expect(result.profile.completionPercentage).toBe(100);
      expect(result.profile.isComplete).toBe(true);
    });
  });

  describe('saveStep', () => {
    it('throws InvalidProfileStepException for unknown step name', async () => {
      await expect(
        service.saveStep('user-id', 'tenant-id', 'unknownStep', {} as never),
      ).rejects.toThrow(InvalidProfileStepException);
    });

    it('saves basicBodyInfo step', async () => {
      const saved = {
        ...BASE_PROFILE,
        dateOfBirth: '1990-01-15',
        gender: 'male',
        heightCm: 180,
        weightKg: 85,
        targetWeightKg: 75,
      };
      mockPrismaService.userProfile.upsert.mockResolvedValue(saved);

      const result = await service.saveStep(
        'user-id',
        'tenant-id',
        'basicBodyInfo',
        {
          dateOfBirth: '1990-01-15',
          gender: 'male',
          heightCm: 180,
          weightKg: 85,
          targetWeightKg: 75,
        } as never,
      );

      expect(mockPrismaService.userProfile.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-id' },
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          create: expect.objectContaining({
            dateOfBirth: '1990-01-15',
            gender: 'male',
          }),
        }),
      );
      expect(result.profile.basicBodyInfo).toEqual({
        dateOfBirth: '1990-01-15',
        gender: 'male',
        heightCm: 180,
        weightKg: 85,
        targetWeightKg: 75,
      });
    });

    it('saves healthConditions step', async () => {
      const saved = {
        ...BASE_PROFILE,
        allergies: ['Gluten'],
        intolerances: ['Lactose'],
      };
      mockPrismaService.userProfile.upsert.mockResolvedValue(saved);

      const result = await service.saveStep(
        'user-id',
        'tenant-id',
        'healthConditions',
        {
          allergies: ['Gluten'],
          intolerances: ['Lactose'],
          medicalConditions: [],
          customAllergies: [],
          customIntolerances: [],
          customMedicalConditions: [],
        } as never,
      );

      expect(result.profile.healthConditions).not.toBeNull();
      expect(result.profile.healthConditions!.allergies).toEqual(['Gluten']);
    });

    it('saves dietPreferences step', async () => {
      const saved = {
        ...BASE_PROFILE,
        dietType: 'keto',
        cuisinePreferences: ['Italian'],
      };
      mockPrismaService.userProfile.upsert.mockResolvedValue(saved);

      const result = await service.saveStep(
        'user-id',
        'tenant-id',
        'dietPreferences',
        {
          dietType: 'keto',
          cuisinePreferences: ['Italian'],
        } as never,
      );

      expect(result.profile.dietPreferences).toEqual({
        dietType: 'keto',
        cuisinePreferences: ['Italian'],
      });
    });

    it('saves goals step', async () => {
      const saved = {
        ...BASE_PROFILE,
        primaryGoal: 'lose_weight',
        activityLevel: 'moderately_active',
      };
      mockPrismaService.userProfile.upsert.mockResolvedValue(saved);

      const result = await service.saveStep('user-id', 'tenant-id', 'goals', {
        primaryGoal: 'lose_weight',
        activityLevel: 'moderately_active',
      } as never);

      expect(result.profile.goals).toEqual({
        primaryGoal: 'lose_weight',
        activityLevel: 'moderately_active',
      });
    });
  });

  describe('calculateCompletionPercentage', () => {
    it('returns 0 for null profile', async () => {
      mockPrismaService.userProfile.findUnique.mockResolvedValue(null);
      const { profile } = await service.getProfile('user-id', 'tenant-id');
      expect(profile.completionPercentage).toBe(0);
    });

    it('returns 25 for 1 of 4 steps filled', async () => {
      mockPrismaService.userProfile.findUnique.mockResolvedValue({
        ...BASE_PROFILE,
        dateOfBirth: '1990-01-15',
        gender: 'male',
        heightCm: 180,
        weightKg: 85,
        targetWeightKg: 75,
      });
      const { profile } = await service.getProfile('user-id', 'tenant-id');
      expect(profile.completionPercentage).toBe(25);
    });

    it('returns 75 for 3 of 4 steps filled (healthConditions inferred from later steps)', async () => {
      mockPrismaService.userProfile.findUnique.mockResolvedValue({
        ...BASE_PROFILE,
        dateOfBirth: '1990-01-15',
        gender: 'male',
        heightCm: 180,
        weightKg: 85,
        targetWeightKg: 75,
        dietType: 'keto',
        cuisinePreferences: [],
        // healthConditions inferred as filled because dietType is set
      });
      const { profile } = await service.getProfile('user-id', 'tenant-id');
      // basicBodyInfo + healthConditions (inferred) + dietPreferences = 3/4 = 75%
      expect(profile.completionPercentage).toBe(75);
    });

    it('returns 100 for all 4 steps filled', async () => {
      mockPrismaService.userProfile.findUnique.mockResolvedValue({
        ...BASE_PROFILE,
        dateOfBirth: '1990-01-15',
        gender: 'male',
        heightCm: 180,
        weightKg: 85,
        targetWeightKg: 75,
        allergies: ['Gluten'],
        dietType: 'keto',
        primaryGoal: 'lose_weight',
        activityLevel: 'moderately_active',
      });
      const { profile } = await service.getProfile('user-id', 'tenant-id');
      expect(profile.completionPercentage).toBe(100);
    });
  });

  describe('completeProfile', () => {
    it('throws ProfileIncompleteException when not all steps are filled', async () => {
      mockPrismaService.userProfile.findUnique.mockResolvedValue({
        ...BASE_PROFILE,
        dateOfBirth: '1990-01-15',
        gender: 'male',
        heightCm: 180,
        weightKg: 85,
        targetWeightKg: 75,
        // missing health, diet, goals
      });

      await expect(
        service.completeProfile('user-id', 'tenant-id'),
      ).rejects.toThrow(ProfileIncompleteException);
    });

    it('marks profile complete when all steps are filled', async () => {
      const fullProfile = {
        ...BASE_PROFILE,
        dateOfBirth: '1990-01-15',
        gender: 'male',
        heightCm: 180,
        weightKg: 85,
        targetWeightKg: 75,
        allergies: ['Gluten'],
        dietType: 'keto',
        primaryGoal: 'lose_weight',
        activityLevel: 'moderately_active',
        isComplete: true,
      };
      mockPrismaService.userProfile.findUnique.mockResolvedValue(fullProfile);
      mockPrismaService.userProfile.upsert.mockResolvedValue(fullProfile);

      const result = await service.completeProfile('user-id', 'tenant-id');

      expect(mockPrismaService.userProfile.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: { isComplete: true },
        }),
      );
      expect(result.profile.isComplete).toBe(true);
    });
  });
});
