import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserContext } from '@aza8/core-domain';

import { AuthenticatedRequest } from '../interfaces/auth-user.interface.js';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CurrentUserContext => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.userContext) {
      throw new Error('User context missing');
    }
    return request.userContext;
  }
);
