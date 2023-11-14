import { User } from '@prisma/client';
import { Request as ExpressRequest } from 'express';

export type ReqUserInterface = Pick<User, 'email' | 'userId'>;
declare module 'express-serve-static-core' {
  interface Request extends ExpressRequest {
    user?: ReqUserInterface;
  }
}
