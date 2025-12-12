import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthenticatedRequest } from './interfaces.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(payload: LoginDto, res: Response): Promise<import("@aza8/core-domain").CurrentUserContext>;
    logout(res: Response): Promise<{
        success: boolean;
    }>;
    me(req: Request & AuthenticatedRequest, _res: Response): Promise<import("@aza8/core-domain").CurrentUserContext>;
    private setSessionCookie;
}
