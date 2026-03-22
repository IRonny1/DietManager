import { MD3LightTheme } from 'react-native-paper';

import { palette } from './Colors';

export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.primary,
    onPrimary: palette.white,
  },
};
