export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type MeasurementSystem = 'metric' | 'imperial';

export type DietType =
  | 'no_preference'
  | 'keto'
  | 'vegan'
  | 'vegetarian'
  | 'pescatarian'
  | 'mediterranean'
  | 'paleo'
  | 'gluten_free';

export type PrimaryGoal =
  | 'lose_weight'
  | 'gain_muscle'
  | 'maintain_weight'
  | 'eat_healthier';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extremely_active';

export type BasicBodyInfo = {
  dateOfBirth: string;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
};

export type HealthConditions = {
  allergies: string[];
  intolerances: string[];
  medicalConditions: string[];
  customAllergies: string[];
  customIntolerances: string[];
  customMedicalConditions: string[];
};

export type DietPreferences = {
  dietType: DietType;
  cuisinePreferences: string[];
};

export type Goals = {
  primaryGoal: PrimaryGoal;
  activityLevel: ActivityLevel;
};

export type UserProfile = {
  basicBodyInfo: BasicBodyInfo | null;
  healthConditions: HealthConditions | null;
  dietPreferences: DietPreferences | null;
  goals: Goals | null;
  isComplete: boolean;
  completionPercentage: number;
  updatedAt: string;
};

export type ProfileStepData =
  | BasicBodyInfo
  | HealthConditions
  | DietPreferences
  | Goals;

export type SaveProfileStepRequest = {
  step: number;
  data: ProfileStepData;
};

export type ProfileResponse = {
  profile: UserProfile;
};
