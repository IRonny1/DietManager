import type { ProfileStepData } from '@/types/profile.types';

export type WizardStepId =
  | 'basic_body_info'
  | 'health_conditions'
  | 'diet_preferences'
  | 'goals';

export type WizardStepConfig = {
  id: WizardStepId;
  title: string;
  subtitle: string;
  emoji: string;
  index: number;
};

export type WizardDirection = 'forward' | 'backward';

export type StepValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
};

export type BasicBodyInfoFormValues = {
  dateOfBirth: string;
  gender: string;
  height: string;
  weight: string;
  targetWeight: string;
};

export type HealthConditionsFormValues = {
  allergies: string[];
  intolerances: string[];
  medicalConditions: string[];
  customAllergyText: string;
  customIntoleranceText: string;
  customConditionText: string;
};

export type DietPreferencesFormValues = {
  dietType: string;
  cuisinePreferences: string[];
};

export type GoalsFormValues = {
  primaryGoal: string;
  activityLevel: string;
};
