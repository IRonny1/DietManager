import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { SPACING } from '../../constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '../../constants/typography.constants';

interface AppLogoProps {
  style?: ViewStyle;
  horizontal?: boolean;
}

export default function AppLogo({ style, horizontal = false }: AppLogoProps): React.JSX.Element {
  return (
    <View style={[horizontal ? styles.containerRow : styles.containerColumn, style]}>
      <View style={styles.iconCircle}>
        <Text style={styles.leafIcon}>🌿</Text>
      </View>
      <Text style={[styles.appName, horizontal && styles.appNameHorizontal]}>DietManager</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  containerColumn: { alignItems: 'center' },
  containerRow: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leafIcon: { fontSize: 22 },
  appName: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: Colors.textPrimary,
    marginTop: SPACING.XS,
  },
  appNameHorizontal: { marginTop: 0, marginLeft: SPACING.SM },
});
