import type {
  ActivityLevel,
  DietType,
  Gender,
  PrimaryGoal,
} from '@/types/profile.types';

import type { WizardStepConfig } from '@/screens/ProfileCompletion/types/profileCompletion.types';

export const PROFILE_MOCK_DELAY_MS = 800;

export const WIZARD_STEPS: WizardStepConfig[] = [
  {
    id: 'basic_body_info',
    title: 'About You',
    subtitle: 'Tell us about your body so we can personalize your plan',
    emoji: '📏',
    index: 0,
  },
  {
    id: 'health_conditions',
    title: 'Health & Allergies',
    subtitle: 'Help us keep your meals safe and suitable',
    emoji: '🩺',
    index: 1,
  },
  {
    id: 'diet_preferences',
    title: 'Diet Preferences',
    subtitle: 'What kind of eating style suits you best?',
    emoji: '🥗',
    index: 2,
  },
  {
    id: 'goals',
    title: 'Your Goals',
    subtitle: 'What are you looking to achieve?',
    emoji: '🎯',
    index: 3,
  },
] as const;

export const TOTAL_STEPS = WIZARD_STEPS.length;

export const GENDER_OPTIONS: { value: Gender; label: string; emoji: string }[] =
  [
    { value: 'male', label: 'Male', emoji: '👨' },
    { value: 'female', label: 'Female', emoji: '👩' },
    { value: 'other', label: 'Other', emoji: '🧑' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say', emoji: '🤐' },
  ];

export const ALLERGY_OPTIONS = [
  'Gluten',
  'Dairy',
  'Nuts',
  'Peanuts',
  'Shellfish',
  'Soy',
  'Eggs',
  'Fish',
  'Wheat',
  'Sesame',
] as const;

export const INTOLERANCE_OPTIONS = [
  'Lactose',
  'Fructose',
  'Histamine',
  'Caffeine',
  'Sulfites',
  'FODMAPs',
] as const;

export const MEDICAL_CONDITION_OPTIONS = [
  'Diabetes Type 1',
  'Diabetes Type 2',
  'Hypertension',
  'Heart Disease',
  'Celiac Disease',
  'IBS',
  'PCOS',
  'Thyroid Disorder',
  'Kidney Disease',
  'None',
] as const;

export const DIET_TYPE_OPTIONS: {
  value: DietType;
  label: string;
  emoji: string;
  description: string;
}[] = [
  {
    value: 'no_preference',
    label: 'No Preference',
    emoji: '🍽️',
    description: 'Eat everything',
  },
  {
    value: 'keto',
    label: 'Keto',
    emoji: '🥩',
    description: 'High fat, low carb',
  },
  {
    value: 'vegan',
    label: 'Vegan',
    emoji: '🌱',
    description: 'No animal products',
  },
  {
    value: 'vegetarian',
    label: 'Vegetarian',
    emoji: '🥬',
    description: 'No meat or fish',
  },
  {
    value: 'pescatarian',
    label: 'Pescatarian',
    emoji: '🐟',
    description: 'Fish but no meat',
  },
  {
    value: 'mediterranean',
    label: 'Mediterranean',
    emoji: '🫒',
    description: 'Olive oil, grains, fish',
  },
  {
    value: 'paleo',
    label: 'Paleo',
    emoji: '🦴',
    description: 'Whole foods, no grains',
  },
  {
    value: 'gluten_free',
    label: 'Gluten-Free',
    emoji: '🚫',
    description: 'No gluten-containing foods',
  },
];

export const CUISINE_OPTIONS = [
  'Italian',
  'Asian',
  'Mexican',
  'Indian',
  'American',
  'Middle Eastern',
  'Japanese',
  'Thai',
  'Greek',
  'French',
  'Korean',
  'Vietnamese',
] as const;

export const PRIMARY_GOAL_OPTIONS: {
  value: PrimaryGoal;
  label: string;
  emoji: string;
  description: string;
}[] = [
  {
    value: 'lose_weight',
    label: 'Lose Weight',
    emoji: '⚖️',
    description: 'Reduce body fat',
  },
  {
    value: 'gain_muscle',
    label: 'Gain Muscle',
    emoji: '💪',
    description: 'Build lean mass',
  },
  {
    value: 'maintain_weight',
    label: 'Maintain Weight',
    emoji: '✅',
    description: 'Stay where you are',
  },
  {
    value: 'eat_healthier',
    label: 'Eat Healthier',
    emoji: '🥦',
    description: 'Improve nutrition',
  },
];

export const ACTIVITY_LEVEL_OPTIONS: {
  value: ActivityLevel;
  label: string;
  emoji: string;
  description: string;
}[] = [
  {
    value: 'sedentary',
    label: 'Sedentary',
    emoji: '🛋️',
    description: 'Little or no exercise',
  },
  {
    value: 'lightly_active',
    label: 'Lightly Active',
    emoji: '🚶',
    description: '1–3 days/week',
  },
  {
    value: 'moderately_active',
    label: 'Moderately Active',
    emoji: '🏃',
    description: '3–5 days/week',
  },
  {
    value: 'very_active',
    label: 'Very Active',
    emoji: '🏋️',
    description: '6–7 days/week',
  },
  {
    value: 'extremely_active',
    label: 'Extremely Active',
    emoji: '🔥',
    description: 'Athlete / physical job',
  },
];

export const HEIGHT_LIMITS = {
  metric: { min: 50, max: 300, unit: 'cm' },
  imperial: { minFeet: 1, maxFeet: 9, minInches: 0, maxInches: 11 },
} as const;

export const WEIGHT_LIMITS = {
  metric: { min: 20, max: 500, unit: 'kg' },
  imperial: { min: 44, max: 1100, unit: 'lbs' },
} as const;

export const MIN_AGE = 13;
export const MAX_AGE = 120;

export const PROFILE_VALIDATION_MESSAGES = {
  DATE_OF_BIRTH_REQUIRED: 'Date of birth is required',
  DATE_OF_BIRTH_TOO_YOUNG: `You must be at least ${MIN_AGE} years old`,
  DATE_OF_BIRTH_INVALID: 'Please enter a valid date',
  GENDER_REQUIRED: 'Please select your gender',
  HEIGHT_REQUIRED: 'Height is required',
  HEIGHT_INVALID: 'Please enter a valid height',
  WEIGHT_REQUIRED: 'Weight is required',
  WEIGHT_INVALID: 'Please enter a valid weight',
  TARGET_WEIGHT_REQUIRED: 'Target weight is required',
  TARGET_WEIGHT_INVALID: 'Please enter a valid target weight',
  DIET_TYPE_REQUIRED: 'Please select a diet type',
  PRIMARY_GOAL_REQUIRED: 'Please select your primary goal',
  ACTIVITY_LEVEL_REQUIRED: 'Please select your activity level',
} as const;
