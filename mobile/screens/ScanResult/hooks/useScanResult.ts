import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';

import { addMeal } from '@/services/diary.service';
import { useScanStore } from '@/stores/useScanStore';
import type { FoodScanResult } from '@/types/scan.types';

function getMealCategory(): 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'Breakfast';
  if (hour >= 11 && hour < 15) return 'Lunch';
  if (hour >= 15 && hour < 21) return 'Dinner';
  return 'Snack';
}

type UseScanResultReturn = {
  scan: FoodScanResult | null;
  portionGrams: number;
  adjustedCalories: number;
  adjustedProtein: number;
  adjustedFat: number;
  adjustedCarbs: number;
  ingredientsExpanded: boolean;
  handlePortionIncrease: () => void;
  handlePortionDecrease: () => void;
  handleIngredientsToggle: () => void;
  handleAddToDiary: () => Promise<void>;
  handleEditDetails: () => void;
  handleScanAgain: () => void;
};

export function useScanResult(): UseScanResultReturn {
  const router = useRouter();
  const scan = useScanStore((s) => s.currentScan);

  const [portionGrams, setPortionGrams] = useState<number>(scan?.portionGrams ?? 100);
  const [ingredientsExpanded, setIngredientsExpanded] = useState(false);

  const scale = portionGrams / (scan?.portionGrams ?? 1);
  const adjustedCalories = Math.round((scan?.calories ?? 0) * scale);
  const adjustedProtein = Math.round((scan?.protein ?? 0) * scale * 10) / 10;
  const adjustedFat = Math.round((scan?.fat ?? 0) * scale * 10) / 10;
  const adjustedCarbs = Math.round((scan?.carbs ?? 0) * scale * 10) / 10;

  const handlePortionIncrease = useCallback((): void => {
    setPortionGrams((p) => p + 10);
  }, []);

  const handlePortionDecrease = useCallback((): void => {
    setPortionGrams((p) => Math.max(10, p - 10));
  }, []);

  const handleIngredientsToggle = useCallback((): void => {
    setIngredientsExpanded((e) => !e);
  }, []);

  const handleAddToDiary = useCallback(async (): Promise<void> => {
    if (!scan) return;
    await addMeal({
      name: scan.name,
      category: getMealCategory(),
      calories: adjustedCalories,
      protein: adjustedProtein,
      fat: adjustedFat,
      carbs: adjustedCarbs,
      portionGrams,
      imageUri: scan.imageUri,
      loggedAt: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
    });
    router.replace('/(tabs)/scan');
  }, [scan, adjustedCalories, adjustedProtein, adjustedFat, adjustedCarbs, portionGrams, router]);

  const handleEditDetails = useCallback((): void => {
    router.push('/edit-meal');
  }, [router]);

  const handleScanAgain = useCallback((): void => {
    router.back();
  }, [router]);

  return {
    scan,
    portionGrams,
    adjustedCalories,
    adjustedProtein,
    adjustedFat,
    adjustedCarbs,
    ingredientsExpanded,
    handlePortionIncrease,
    handlePortionDecrease,
    handleIngredientsToggle,
    handleAddToDiary,
    handleEditDetails,
    handleScanAgain,
  };
}
