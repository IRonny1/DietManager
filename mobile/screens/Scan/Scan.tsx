import React from 'react';
import { View, StyleSheet } from 'react-native';

import { useScan } from './hooks/useScan';
import { ScanCamera } from './components/ScanCamera';
import { NoCameraPermission } from './components/NoCameraPermission';
import { ProcessingOverlay } from './components/ProcessingOverlay';
import { FoodNotRecognized } from './components/FoodNotRecognized';
import { RecentScansList } from './components/RecentScansList';
import { palette } from '@/constants/Colors';

export function Scan(): React.JSX.Element {
  const {
    hasCameraPermission,
    recentScans,
    isScanning,
    capturedImageUri,
    error,
    cameraRef,
    requestPermission,
    capturePhoto,
    handleManualEntry,
    handleScanAgain,
  } = useScan();

  if (hasCameraPermission === false) {
    return (
      <NoCameraPermission
        onRequestPermission={requestPermission}
        onManualEntry={handleManualEntry}
      />
    );
  }

  if (error === 'unrecognized') {
    return (
      <FoodNotRecognized
        onScanAgain={handleScanAgain}
        onManualEntry={handleManualEntry}
      />
    );
  }

  return (
    <View style={styles.container}>
      {hasCameraPermission === true && (
        <ScanCamera cameraRef={cameraRef} onCapture={capturePhoto} isScanning={isScanning} />
      )}
      <RecentScansList scans={recentScans} />
      {isScanning && capturedImageUri !== null && (
        <ProcessingOverlay imageUri={capturedImageUri} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.bgDark },
});
