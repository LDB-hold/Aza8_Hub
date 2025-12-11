import { IncomingMessage } from 'http';
import { CurrentUserContext } from '@aza8/core-domain';

export interface AuthenticatedRequest extends IncomingMessage {
  userContext?: CurrentUserContext;
}
