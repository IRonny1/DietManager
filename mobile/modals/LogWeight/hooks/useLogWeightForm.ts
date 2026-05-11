import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';

import { addWeightEntry } from '@/services/weightLog.service';

function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

type UseLogWeightFormReturn = {
  date: string;
  weight: string;
  note: string;
  weightError: string;
  isSaving: boolean;
  handleDateChange: (value: string) => void;
  handleWeightChange: (value: string) => void;
  handleNoteChange: (value: string) => void;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
};

export function useLogWeightForm(): UseLogWeightFormReturn {
  const router = useRouter();
  const [date, setDate] = useState(toLocalDateStr(new Date()));
  const [weight, setWeight] = useState('');
  const [note, setNote] = useState('');
  const [weightError, setWeightError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleWeightChange = useCallback((v: string): void => {
    setWeight(v);
    setWeightError('');
  }, []);

  const handleSave = useCallback(async (): Promise<void> => {
    const parsed = parseFloat(weight);
    if (isNaN(parsed) || parsed <= 0) {
      setWeightError('Enter a valid weight');
      return;
    }
    setWeightError('');
    setIsSaving(true);
    try {
      await addWeightEntry({ date, weightKg: parsed, note: note.trim() || undefined });
      router.back();
    } finally {
      setIsSaving(false);
    }
  }, [date, weight, note, router]);

  const handleCancel = useCallback((): void => {
    router.back();
  }, [router]);

  return {
    date,
    weight,
    note,
    weightError,
    isSaving,
    handleDateChange: setDate,
    handleWeightChange,
    handleNoteChange: setNote,
    handleSave,
    handleCancel,
  };
}
