import { useState } from 'react';
import { useRouter } from 'expo-router';
import { GoalMethod } from '../../../../types/onboarding.types';
import { useProfileStore } from '../../../../stores/useProfileStore';

export function useMethodForm(): {
  selected: GoalMethod;
  setSelected: (v: GoalMethod) => void;
  onNext: () => void;
} {
  const [selected, setSelected] = useState<GoalMethod>('calculate');
  const setOnboardingData = useProfileStore((s) => s.setOnboardingData);
  const router = useRouter();

  function onNext(): void {
    setOnboardingData({ goalMethod: selected });
    if (selected === 'calculate') {
      router.push('/(onboarding)/personal-data');
    } else {
      router.push('/(onboarding)/manual-entry');
    }
  }

  return { selected, setSelected, onNext };
}
