import { useCallback, useState } from 'react';

import { useRouter } from 'expo-router';

import { TOTAL_STEPS } from '@/constants/profile.constants';
import { useProfileStore } from '@/stores/useProfileStore';
import type { ProfileStepData } from '@/types/profile.types';

import type { WizardDirection } from '../types/profileCompletion.types';

type UseProfileWizardReturn = {
  currentStep: number;
  direction: WizardDirection;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSaving: boolean;
  isComplete: boolean;
  goNext: (stepData: ProfileStepData) => Promise<void>;
  goBack: () => void;
  skip: () => void;
};

export function useProfileWizard(): UseProfileWizardReturn {
  const router = useRouter();
  const currentStep = useProfileStore((state) => state.currentStep);
  const isSaving = useProfileStore((state) => state.isSaving);
  const nextStep = useProfileStore((state) => state.nextStep);
  const prevStep = useProfileStore((state) => state.prevStep);
  const saveStepData = useProfileStore((state) => state.saveStepData);

  const [direction, setDirection] = useState<WizardDirection>('forward');
  const [isComplete, setIsComplete] = useState(false);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOTAL_STEPS - 1;

  const goNext = useCallback(
    async (stepData: ProfileStepData): Promise<void> => {
      await saveStepData(currentStep, stepData);
      setDirection('forward');

      if (isLastStep) {
        setIsComplete(true);
      } else {
        nextStep();
      }
    },
    [currentStep, isLastStep, nextStep, saveStepData],
  );

  const goBack = useCallback((): void => {
    setDirection('backward');
    prevStep();
  }, [prevStep]);

  const skip = useCallback((): void => {
    router.replace('/(tabs)');
  }, [router]);

  return {
    currentStep,
    direction,
    isFirstStep,
    isLastStep,
    isSaving,
    isComplete,
    goNext,
    goBack,
    skip,
  };
}
