import * as SecureStore from 'expo-secure-store';
import type { StateStorage } from 'zustand/middleware';

export const secureStorage: StateStorage = {
  getItem: (name: string): Promise<string | null> =>
    SecureStore.getItemAsync(name),

  setItem: (name: string, value: string): Promise<void> =>
    SecureStore.setItemAsync(name, value),

  removeItem: (name: string): Promise<void> =>
    SecureStore.deleteItemAsync(name),
};
