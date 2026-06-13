import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtValidatedUser } from '../types/jwt.types';
import '../types/express.d';

export const CurrentUser = createParamDecorator(
  (
    data: keyof JwtValidatedUser | undefined,
    ctx: ExecutionContext,
  ): JwtValidatedUser | string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user!;
    return data ? user[data] : user;
  },
);
