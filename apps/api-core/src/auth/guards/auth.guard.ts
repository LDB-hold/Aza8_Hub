import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Request } from 'express';

import { TenantContextService } from '../../tenancy/tenant-context.service.js';
import { AuthService } from '../auth.service.js';
import { AuthenticatedRequest } from '../interfaces/auth-user.interface.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly tenantContext: TenantContextService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest & Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing credentials');
    }

    const userContext = await this.authService.validateToken(token, this.tenantContext.getContext());
    request.userContext = userContext;
    return true;
  }

  private extractToken(request: Request): string | null {
    const header = request.headers['authorization'];
    if (typeof header === 'string' && header.startsWith('Bearer ')) {
      return header.substring(7);
    }

    const cookieToken = (request as AuthenticatedRequest & { cookies?: Record<string, string> }).cookies?.aza8_token;
    return cookieToken ?? null;
  }
}
