import { Request } from 'express';
import { CurrentUserContext } from '@aza8/core-domain';

export interface AuthenticatedRequest extends Request {
  userContext?: CurrentUserContext;
}
