import { JwtService } from '@nestjs/jwt';
import { CurrentUserContext, TenantContext } from '@aza8/core-domain';
import { PrismaService } from '../database/prisma.service.js';
import { AppConfigService } from '../config/app-config.service.js';
import { RbacService } from '../rbac/rbac.service.js';
import { AuthCallbackDto } from './dto/auth-callback.dto.js';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    private readonly rbacService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: AppConfigService, rbacService: RbacService);
    handleCallback(payload: AuthCallbackDto): Promise<{
        token: string;
    }>;
    validateToken(token: string, tenantContext: TenantContext): Promise<CurrentUserContext>;
    private issueToken;
    private ensureTenant;
    private ensureHubTenant;
    private ensureMembership;
    private toDomainUser;
}
