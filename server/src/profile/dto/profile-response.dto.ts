export interface BasicBodyInfoResponse {
  dateOfBirth: string;
  gender: string;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
}

export interface HealthConditionsResponse {
  allergies: string[];
  intolerances: string[];
  medicalConditions: string[];
  customAllergies: string[];
  customIntolerances: string[];
  customMedicalConditions: string[];
}

export interface DietPreferencesResponse {
  dietType: string;
  cuisinePreferences: string[];
}

export interface GoalsResponse {
  primaryGoal: string;
  activityLevel: string;
}

export interface ProfileData {
  basicBodyInfo: BasicBodyInfoResponse | null;
  healthConditions: HealthConditionsResponse | null;
  dietPreferences: DietPreferencesResponse | null;
  goals: GoalsResponse | null;
  isComplete: boolean;
  completionPercentage: number;
  updatedAt: string;
}

export interface ProfileResponse {
  profile: ProfileData;
}
