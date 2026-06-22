import { useState, useCallback } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { addMeal, updateMeal } from '@/services/diary.service';
import { useScanStore } from '@/stores/useScanStore';
import type { MealEntry } from '@/types/diary.types';

function getMealCategory(): MealEntry['category'] {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'Breakfast';
  if (hour >= 11 && hour < 15) return 'Lunch';
  if (hour >= 15 && hour < 21) return 'Dinner';
  return 'Snack';
}

type UseEditMealReturn = {
  name: string;
  setName: (v: string) => void;
  mealType: MealEntry['category'];
  setMealType: (v: MealEntry['category']) => void;
  calories: string;
  setCalories: (v: string) => void;
  protein: string;
  setProtein: (v: string) => void;
  fat: string;
  setFat: (v: string) => void;
  carbs: string;
  setCarbs: (v: string) => void;
  portionGrams: string;
  setPortionGrams: (v: string) => void;
  ingredients: string;
  setIngredients: (v: string) => void;
  note: string;
  setNote: (v: string) => void;
  isSaving: boolean;
  handleSave: () => Promise<void>;
};

export function useEditMeal(): UseEditMealReturn {
  const router = useRouter();
  const params = useLocalSearchParams<{
    mealId?: string;
    name?: string;
    category?: string;
    calories?: string;
    protein?: string;
    fat?: string;
    carbs?: string;
    portionGrams?: string;
    loggedAt?: string;
    date?: string;
  }>();
  const currentScan = useScanStore((s) => s.currentScan);

  const isEditing = Boolean(params.mealId);

  const [name, setName] = useState(params.name ?? currentScan?.name ?? '');
  const [mealType, setMealType] = useState<MealEntry['category']>(
    (params.category as MealEntry['category']) ?? getMealCategory(),
  );
  const [calories, setCalories] = useState(params.calories ?? currentScan?.calories?.toString() ?? '');
  const [protein, setProtein] = useState(params.protein ?? currentScan?.protein?.toString() ?? '');
  const [fat, setFat] = useState(params.fat ?? currentScan?.fat?.toString() ?? '');
  const [carbs, setCarbs] = useState(params.carbs ?? currentScan?.carbs?.toString() ?? '');
  const [portionGrams, setPortionGrams] = useState(params.portionGrams ?? currentScan?.portionGrams?.toString() ?? '100');
  const [ingredients, setIngredients] = useState(currentScan?.ingredients?.join(', ') ?? '');
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async (): Promise<void> => {
    setIsSaving(true);
    try {
      if (isEditing && params.mealId) {
        await updateMeal(params.mealId, {
          name: name.trim() || 'Unknown Food',
          category: mealType,
          calories: parseFloat(calories) || 0,
          protein: parseFloat(protein) || 0,
          fat: parseFloat(fat) || 0,
          carbs: parseFloat(carbs) || 0,
          portionGrams: parseFloat(portionGrams) || 100,
          loggedAt: params.loggedAt,
          date: params.date,
        });
      } else {
        await addMeal({
          name: name.trim() || 'Unknown Food',
          category: mealType,
          calories: parseFloat(calories) || 0,
          protein: parseFloat(protein) || 0,
          fat: parseFloat(fat) || 0,
          carbs: parseFloat(carbs) || 0,
          portionGrams: parseFloat(portionGrams) || 100,
          imageUri: currentScan?.imageUri,
          loggedAt: new Date().toISOString(),
          date: new Date().toISOString().split('T')[0],
        });
      }
      router.back();
    } finally {
      setIsSaving(false);
    }
  }, [isEditing, params.mealId, params.loggedAt, params.date, name, mealType, calories, protein, fat, carbs, portionGrams, currentScan, router]);

  return {
    name, setName,
    mealType, setMealType,
    calories, setCalories,
    protein, setProtein,
    fat, setFat,
    carbs, setCarbs,
    portionGrams, setPortionGrams,
    ingredients, setIngredients,
    note, setNote,
    isSaving,
    handleSave,
  };
}
