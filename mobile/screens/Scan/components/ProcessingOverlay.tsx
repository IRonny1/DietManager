import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { palette } from '@/constants/Colors';
import { SPACING } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';

type Props = { imageUri: string };

export function ProcessingOverlay({ imageUri }: Props): React.JSX.Element {
  return (
    <View style={styles.overlay}>
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      <View style={styles.scrim}>
        <ActivityIndicator size="large" color={palette.white} style={styles.spinner} />
        <Text style={styles.text}>Analyzing your food...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 10 },
  image: { flex: 1 },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  spinner: { marginBottom: SPACING.LG },
  text: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.white,
  },
});
