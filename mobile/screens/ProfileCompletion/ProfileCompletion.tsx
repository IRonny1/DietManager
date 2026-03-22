import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Text } from 'react-native-paper';

import { palette } from '@/constants/Colors';
import { WIZARD_STEPS } from '@/constants/profile.constants';
import { useProfileStore } from '@/stores/useProfileStore';

import BasicBodyInfoStep from './components/BasicBodyInfoStep';
import CompletionSuccessView from './components/CompletionSuccessView';
import DietPreferencesStep from './components/DietPreferencesStep';
import GoalsStep from './components/GoalsStep';
import HealthConditionsStep from './components/HealthConditionsStep';
import WizardProgressBar from './components/WizardProgressBar';
import WizardStepContainer from './components/WizardStepContainer';
import { useProfileWizard } from './hooks/useProfileWizard';

export default function ProfileCompletionScreen(): React.JSX.Element {
  const {
    currentStep,
    direction,
    isFirstStep,
    isLastStep,
    isSaving,
    isComplete,
    goNext,
    goBack,
    skip,
  } = useProfileWizard();

  const loadProfile = useProfileStore((state) => state.loadProfile);
  const isLoading = useProfileStore((state) => state.isLoading);

  const stepSubmitRef = useRef<(() => Promise<void>) | null>(null);

  const registerSubmit = useCallback((fn: () => Promise<void>): void => {
    stepSubmitRef.current = fn;
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleNext = useCallback(async (): Promise<void> => {
    if (stepSubmitRef.current) {
      await stepSubmitRef.current();
    }
  }, []);

  const currentStepConfig = WIZARD_STEPS[currentStep];

  if (isComplete) {
    return <CompletionSuccessView />;
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="bodyLarge" style={styles.loadingText}>
          Loading your profile...
        </Text>
      </View>
    );
  }

  const renderStep = (): React.JSX.Element => {
    switch (currentStep) {
      case 0:
        return (
          <BasicBodyInfoStep
            onNext={goNext}
            onRegisterSubmit={registerSubmit}
          />
        );
      case 1:
        return (
          <HealthConditionsStep
            onNext={goNext}
            onRegisterSubmit={registerSubmit}
          />
        );
      case 2:
        return (
          <DietPreferencesStep
            onNext={goNext}
            onRegisterSubmit={registerSubmit}
          />
        );
      case 3:
        return (
          <GoalsStep
            onNext={goNext}
            onRegisterSubmit={registerSubmit}
          />
        );
      default:
        return <View />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.stepEmoji}>{currentStepConfig.emoji}</Text>
          <Text variant="headlineSmall" style={styles.stepTitle}>
            {currentStepConfig.title}
          </Text>
          <Text variant="bodyMedium" style={styles.stepSubtitle}>
            {currentStepConfig.subtitle}
          </Text>
        </View>
        <Button
          mode="text"
          onPress={skip}
          textColor={palette.white}
          style={styles.skipButton}
          compact
        >
          Skip
        </Button>
      </View>

      {/* Progress Bar */}
      <WizardProgressBar currentStep={currentStep} />

      {/* Step Content */}
      <View style={styles.stepContent}>
        <WizardStepContainer
          direction={direction}
          stepKey={`step-${currentStep}`}
        >
          {renderStep()}
        </WizardStepContainer>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        {!isFirstStep ? (
          <Button
            mode="text"
            onPress={goBack}
            textColor={palette.white}
            disabled={isSaving}
            style={styles.backButton}
          >
            Back
          </Button>
        ) : (
          <View style={styles.backPlaceholder} />
        )}

        <Button
          mode="contained"
          onPress={handleNext}
          loading={isSaving}
          disabled={isSaving}
          buttonColor={palette.primary}
          style={styles.nextButton}
          contentStyle={styles.nextButtonContent}
          labelStyle={styles.nextButtonLabel}
        >
          {isLastStep ? 'Complete' : 'Next'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.white,
  },
  loadingText: {
    color: palette.textSecondary,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 32,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  stepEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  stepTitle: {
    color: palette.textPrimary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stepSubtitle: {
    color: palette.textSecondary,
    lineHeight: 20,
  },
  skipButton: {
    marginTop: 4,
  },
  stepContent: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  backButton: {
    minWidth: 80,
  },
  backPlaceholder: {
    minWidth: 80,
  },
  nextButton: {
    borderRadius: 12,
    minWidth: 120,
  },
  nextButtonContent: {
    paddingVertical: 6,
  },
  nextButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
