import { AuthCallbackDto } from './dto/auth-callback.dto.js';
import { AuthService } from './auth.service.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    callback(payload: AuthCallbackDto): Promise<{
        token: string;
    }>;
}
