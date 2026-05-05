import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView } from 'expo-camera';
import { palette } from '@/constants/Colors';

type Props = {
  cameraRef: React.RefObject<CameraView>;
  onCapture: () => Promise<void>;
  isScanning: boolean;
};

export function ScanCamera({ cameraRef, onCapture, isScanning }: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <View style={styles.guides}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </CameraView>
      <View style={styles.captureRow}>
        <TouchableOpacity
          style={[styles.captureButton, isScanning && styles.disabled]}
          onPress={onCapture}
          disabled={isScanning}
          activeOpacity={0.8}
        >
          <View style={styles.captureInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const CORNER = 24;
const THICKNESS = 3;

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  guides: { flex: 1, margin: 48 },
  corner: { position: 'absolute', width: CORNER, height: CORNER, borderColor: palette.white },
  topLeft: { top: 0, left: 0, borderTopWidth: THICKNESS, borderLeftWidth: THICKNESS },
  topRight: { top: 0, right: 0, borderTopWidth: THICKNESS, borderRightWidth: THICKNESS },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: THICKNESS, borderLeftWidth: THICKNESS },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: THICKNESS, borderRightWidth: THICKNESS },
  captureRow: {
    height: 100,
    backgroundColor: palette.bgDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: palette.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: { opacity: 0.5 },
  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: palette.white,
    borderWidth: 2,
    borderColor: palette.bgDark,
  },
});
