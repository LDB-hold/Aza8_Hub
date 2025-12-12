import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedRequest } from './interfaces.js';
import { AuthService } from './auth.service.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const session = this.extractSession(request.headers.cookie);

    if (!session?.userId) {
      throw new UnauthorizedException('Missing session');
    }

    const userContext = await this.authService.buildUserContext(session.userId);
    request.userContext = userContext;
    return true;
  }

  private extractSession(cookieHeader?: string): { userId: string } | null {
    if (!cookieHeader) return null;
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((part) => {
        const [key, ...rest] = part.trim().split('=');
        return [key, rest.join('=')];
      })
    );
    if (!cookies.session) return null;
    return { userId: decodeURIComponent(cookies.session) };
  }
}
