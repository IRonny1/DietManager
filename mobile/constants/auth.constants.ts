export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
export const PASSWORD_NUMBER_REGEX = /\d/;
export const PASSWORD_SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  PASSWORD_UPPERCASE: 'Password must contain at least one uppercase letter',
  PASSWORD_NUMBER: 'Password must contain at least one number',
  PASSWORD_SPECIAL_CHAR: 'Password must contain at least one special character',
  CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password',
  CONFIRM_PASSWORD_MISMATCH: 'Passwords do not match',
} as const;
