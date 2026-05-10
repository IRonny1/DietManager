import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useDateRangeStore } from '@/stores/useDateRangeStore';

type UseDateRangePickerReturn = {
  displayMonth: Date;
  startDate: string | null;
  endDate: string | null;
  handleDayPress: (dateStr: string) => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleConfirm: () => void;
  handleCancel: () => void;
  canConfirm: boolean;
};

export function useDateRangePicker(): UseDateRangePickerReturn {
  const router = useRouter();
  const setConfirmedRange = useDateRangeStore((s) => s.setConfirmedRange);

  const [displayMonth, setDisplayMonth] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleDayPress = useCallback(
    (dateStr: string): void => {
      if (!startDate || !!endDate) {
        setStartDate(dateStr);
        setEndDate(null);
      } else if (dateStr < startDate) {
        setEndDate(startDate);
        setStartDate(dateStr);
      } else {
        setEndDate(dateStr);
      }
    },
    [startDate, endDate],
  );

  const handlePrevMonth = useCallback((): void => {
    setDisplayMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback((): void => {
    setDisplayMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }, []);

  const handleConfirm = useCallback((): void => {
    if (!startDate || !endDate) return;
    setConfirmedRange({ from: startDate, to: endDate });
    router.back();
  }, [startDate, endDate, setConfirmedRange, router]);

  const handleCancel = useCallback((): void => {
    router.back();
  }, [router]);

  return {
    displayMonth,
    startDate,
    endDate,
    handleDayPress,
    handlePrevMonth,
    handleNextMonth,
    handleConfirm,
    handleCancel,
    canConfirm: !!startDate && !!endDate,
  };
}
