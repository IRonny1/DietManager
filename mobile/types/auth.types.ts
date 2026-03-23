export type User = {
  id: string;
  email: string;
  tenantId: string;
  emailVerified: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export type AuthError = {
  message: string;
  field?: string;
};

export type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

export type AuthActions = {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  clearError: () => void;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
};
