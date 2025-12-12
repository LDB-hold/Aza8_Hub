import { CurrentUserContext } from '@aza8/core-domain';
import { Request } from 'express';
export type SessionCookie = {
    userId: string;
};
export type AuthenticatedRequest = Request & {
    userContext?: CurrentUserContext;
};
