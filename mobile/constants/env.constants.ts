export const AUTH_BASE_URL: string =
  process.env['EXPO_PUBLIC_AUTH_BASE_URL'] ?? 'http://localhost:3000';

export const API_BASE_URL: string =
  process.env['EXPO_PUBLIC_API_BASE_URL'] ?? 'http://localhost:3001';

export const TENANT_ID: string =
  process.env['EXPO_PUBLIC_TENANT_ID'] ?? 'a1b2c3d4-1234-4321-abcd-ef0123456789';
