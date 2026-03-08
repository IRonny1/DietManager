export const palette = {
  primary: '#4CAF50',
  primaryLight: '#81C784',
  primaryDark: '#388E3C',
  secondary: '#FF9800',
  secondaryLight: '#FFB74D',
  accent: '#2196F3',
  error: '#F44336',
  surface: '#FFFFFF',
  backgroundLight: '#F5F5F5',
  textPrimary: '#212121',
  textSecondary: '#757575',
  divider: '#BDBDBD',
  white: '#FFFFFF',
  black: '#000000',
} as const;

const Colors = {
  light: {
    text: palette.textPrimary,
    background: palette.backgroundLight,
    surface: palette.surface,
    tint: palette.primary,
    accent: palette.accent,
    error: palette.error,
    secondary: palette.secondary,
    tabIconDefault: '#ccc',
    tabIconSelected: palette.primary,
  },
  dark: {
    text: palette.white,
    background: palette.black,
    surface: '#1E1E1E',
    tint: palette.primaryLight,
    accent: palette.accent,
    error: palette.error,
    secondary: palette.secondaryLight,
    tabIconDefault: '#ccc',
    tabIconSelected: palette.white,
  },
} as const;

export default Colors;
