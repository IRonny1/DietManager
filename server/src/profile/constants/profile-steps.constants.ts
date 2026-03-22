export const GENDER_VALUES = [
  'male',
  'female',
  'other',
  'prefer_not_to_say',
] as const;

export const DIET_TYPE_VALUES = [
  'no_preference',
  'keto',
  'vegan',
  'vegetarian',
  'pescatarian',
  'mediterranean',
  'paleo',
  'gluten_free',
] as const;

export const PRIMARY_GOAL_VALUES = [
  'lose_weight',
  'gain_muscle',
  'maintain_weight',
  'eat_healthier',
] as const;

export const ACTIVITY_LEVEL_VALUES = [
  'sedentary',
  'lightly_active',
  'moderately_active',
  'very_active',
  'extremely_active',
] as const;

/**
 * Registry of known profile step names.
 * Each entry maps a step name to the UserProfile fields it populates.
 * Adding a new step only requires adding a new entry here + a DTO + schema columns.
 */
export const PROFILE_STEPS = {
  basicBodyInfo: [
    'dateOfBirth',
    'gender',
    'heightCm',
    'weightKg',
    'targetWeightKg',
  ],
  healthConditions: [
    'allergies',
    'intolerances',
    'medicalConditions',
    'customAllergies',
    'customIntolerances',
    'customMedicalConditions',
  ],
  dietPreferences: ['dietType', 'cuisinePreferences'],
  goals: ['primaryGoal', 'activityLevel'],
} as const;

export type ProfileStepName = keyof typeof PROFILE_STEPS;
export const VALID_STEP_NAMES = Object.keys(PROFILE_STEPS) as ProfileStepName[];
