import React from 'react';
import { StyleSheet } from 'react-native';

import Animated, { FadeIn, FadeOut, SlideInLeft, SlideInRight } from 'react-native-reanimated';

import type { WizardDirection } from '../types/profileCompletion.types';

type WizardStepContainerProps = {
  children: React.ReactNode;
  direction: WizardDirection;
  stepKey: string;
};

export default function WizardStepContainer({
  children,
  direction,
  stepKey,
}: WizardStepContainerProps): React.JSX.Element {
  const entering =
    direction === 'forward'
      ? SlideInRight.duration(300).withInitialValues({ originX: 300 })
      : SlideInLeft.duration(300).withInitialValues({ originX: -300 });

  return (
    <Animated.View
      key={stepKey}
      entering={entering.springify().damping(20)}
      exiting={FadeOut.duration(150)}
      style={styles.container}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
