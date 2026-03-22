export interface JwtPayload {
  sub: string;
  tenantId: string;
  type: 'access';
}

export interface JwtValidatedUser {
  userId: string;
  tenantId: string;
}
