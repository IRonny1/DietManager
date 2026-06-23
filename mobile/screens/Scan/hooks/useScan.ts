import { useRef, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system/legacy';

import { analyzeFood, UnrecognizedFoodError } from '@/services/scan.service';
import { useScanStore } from '@/stores/useScanStore';
import type { RecentScan } from '@/types/scan.types';

type UseScanReturn = {
  hasCameraPermission: boolean | null;
  recentScans: RecentScan[];
  isScanning: boolean;
  capturedImageUri: string | null;
  error: string | null;
  cameraRef: React.RefObject<CameraView | null>;
  requestPermission: () => Promise<void>;
  capturePhoto: () => Promise<void>;
  handleManualEntry: () => void;
  handleScanAgain: () => void;
};

export function useScan(): UseScanReturn {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);

  const recentScans = useScanStore((s) => s.recentScans);
  const isScanning = useScanStore((s) => s.isScanning);
  const error = useScanStore((s) => s.error);
  const setIsScanning = useScanStore((s) => s.setIsScanning);
  const setCurrentScan = useScanStore((s) => s.setCurrentScan);
  const addRecentScan = useScanStore((s) => s.addRecentScan);
  const setError = useScanStore((s) => s.setError);
  const clearError = useScanStore((s) => s.clearError);

  const hasCameraPermission = permission?.granted ?? null;

  const handleRequestPermission = useCallback(async (): Promise<void> => {
    await requestPermission();
  }, [requestPermission]);

  const capturePhoto = useCallback(async (): Promise<void> => {
    if (!cameraRef.current || isScanning) return;

    setIsScanning(true);
    clearError();

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!photo) throw new Error('Failed to capture photo');

      setCapturedImageUri(photo.uri);

      const base64 = await FileSystem.readAsStringAsync(photo.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const result = await analyzeFood(base64, photo.uri);

      const recentScan: RecentScan = {
        ...result,
        id: Date.now().toString(),
        scannedAt: new Date().toISOString(),
      };
      addRecentScan(recentScan);
      setCurrentScan(result);
      router.push('/scan-result');
    } catch (err) {
      setError('unrecognized');
      setCapturedImageUri(null);
    } finally {
      setIsScanning(false);
    }
  }, [isScanning, setIsScanning, clearError, addRecentScan, setCurrentScan, setError, router]);

  const handleManualEntry = useCallback((): void => {
    setCurrentScan(null);
    router.push('/edit-meal');
  }, [setCurrentScan, router]);

  const handleScanAgain = useCallback((): void => {
    clearError();
    setCapturedImageUri(null);
  }, [clearError]);

  return {
    hasCameraPermission,
    recentScans,
    isScanning,
    capturedImageUri,
    error,
    cameraRef,
    requestPermission: handleRequestPermission,
    capturePhoto,
    handleManualEntry,
    handleScanAgain,
  };
}
