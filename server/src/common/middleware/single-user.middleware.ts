import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SINGLE_USER_ID, SINGLE_TENANT_ID } from '../constants/single-user.constants';

@Injectable()
export class SingleUserMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    (req as Request & { user: unknown }).user = {
      userId: SINGLE_USER_ID,
      tenantId: SINGLE_TENANT_ID,
    };
    next();
  }
}
