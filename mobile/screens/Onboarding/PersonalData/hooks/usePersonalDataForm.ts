import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Gender } from '../../../../types/onboarding.types';
import { useProfileStore } from '../../../../stores/useProfileStore';

interface PersonalDataValues {
  age: string;
  gender: Gender;
  weightValue: string;
  heightValue: string;
  isMetric: boolean;
}

export function usePersonalDataForm(): {
  values: PersonalDataValues;
  errors: Partial<Record<keyof PersonalDataValues, string>>;
  setField: <K extends keyof PersonalDataValues>(key: K, value: PersonalDataValues[K]) => void;
  onContinue: () => void;
} {
  const router = useRouter();
  const setOnboardingData = useProfileStore((s) => s.setOnboardingData);

  const [values, setValues] = useState<PersonalDataValues>({
    age: '25',
    gender: 'male',
    weightValue: '70',
    heightValue: '175',
    isMetric: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PersonalDataValues, string>>>({});

  function setField<K extends keyof PersonalDataValues>(key: K, value: PersonalDataValues[K]): void {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof PersonalDataValues, string>> = {};
    const age = Number(values.age);
    if (!values.age || isNaN(age) || age < 13 || age > 120) {
      newErrors.age = 'Enter a valid age (13–120)';
    }
    const weight = Number(values.weightValue);
    if (!values.weightValue || isNaN(weight) || weight <= 0) {
      newErrors.weightValue = 'Enter a valid weight';
    }
    const height = Number(values.heightValue);
    if (!values.heightValue || isNaN(height) || height <= 0) {
      newErrors.heightValue = 'Enter a valid height';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function onContinue(): void {
    if (!validate()) return;
    const weightKg = values.isMetric
      ? Number(values.weightValue)
      : Number(values.weightValue) * 0.453592;
    const heightCm = values.isMetric
      ? Number(values.heightValue)
      : Number(values.heightValue) * 2.54;
    setOnboardingData({
      personalData: {
        age: Number(values.age),
        gender: values.gender,
        weightKg: Math.round(weightKg * 10) / 10,
        heightCm: Math.round(heightCm),
      },
    });
    router.push('/(onboarding)/activity-goal');
  }

  return { values, errors, setField, onContinue };
}
