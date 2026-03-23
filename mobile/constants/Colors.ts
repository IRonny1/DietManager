export const palette = {
  // Brand
  primary: '#4CAF50',
  primaryLight: '#E8F5E9',
  primaryDark: '#388E3C',
  secondary: '#FF9800',
  secondaryLight: '#FFF3E0',
  accent: '#2196F3',
  error: '#F44336',

  // Backgrounds
  bgPage: '#FFFFFF',
  bgCard: '#F4F4F5',
  bgDark: '#000000',
  bgMuted: '#27272A',

  // Text
  textPrimary: '#000000',
  textSecondary: '#71717A',
  textTertiary: '#A1A1AA',
  textDisabled: '#D4D4D8',
  textInverted: '#FFFFFF',

  // Borders
  border: '#E5E5E5',
  borderStrong: '#E4E4E7',
  borderSubtle: '#F4F4F5',
  /** @deprecated use `border` — kept as alias until components are migrated */
  divider: '#E5E5E5',

  // Macros
  carbs: '#4CAF50',
  fat: '#FF9800',
  protein: '#2196F3',

  // Utility
  white: '#FFFFFF',
  black: '#000000',
} as const;

const ColorSchemes = {
  light: {
    text: palette.textPrimary,
    background: palette.bgPage,
    surface: palette.bgCard,
    tint: palette.primary,
    accent: palette.accent,
    error: palette.error,
    secondary: palette.secondary,
    tabIconDefault: palette.textTertiary,
    tabIconSelected: palette.primary,
  },
  dark: {
    text: palette.textInverted,
    background: palette.bgDark,
    surface: palette.bgMuted,
    tint: palette.primaryLight,
    accent: palette.accent,
    error: palette.error,
    secondary: palette.secondaryLight,
    tabIconDefault: palette.textTertiary,
    tabIconSelected: palette.textInverted,
  },
} as const;

export default ColorSchemes;

export const Colors = palette;
