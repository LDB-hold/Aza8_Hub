import { AuthenticatedRequest } from '../../auth/interfaces.js';
export declare class MeController {
    me(req: AuthenticatedRequest): import("@aza8/core-domain").CurrentUserContext | undefined;
}
