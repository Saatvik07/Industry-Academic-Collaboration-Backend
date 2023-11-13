import { User } from '@prisma/client';
import { Request as ExpressRequest } from 'express';

declare module 'express-serve-static-core' {
  interface Request extends ExpressRequest {
    user?: Pick<User, 'email' | 'userId'>;
  }
}
