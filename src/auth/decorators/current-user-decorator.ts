import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express-serve-static-core';
import { ReqUserInterface } from 'src/types/express';

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext): ReqUserInterface | undefined => {
    return context.switchToHttp().getRequest<Request>()?.user;
  },
);
