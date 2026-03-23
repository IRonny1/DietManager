import { MD3LightTheme } from 'react-native-paper';

import { palette } from './Colors';

export const paperTheme = {
  ...MD3LightTheme,
  roundness: 16,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.primary,
    onPrimary: palette.textInverted,
    background: palette.bgPage,
    surface: palette.bgCard,
    onSurface: palette.textPrimary,
    onSurfaceVariant: palette.textSecondary,
    outline: palette.border,
    error: palette.error,
  },
};
