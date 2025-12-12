import { Body, Controller, Get, Post, Res, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthenticatedRequest } from './interfaces.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() payload: LoginDto, @Res({ passthrough: true }) res: Response) {
    const userContext = await this.authService.login(payload);
    this.setSessionCookie(res, userContext.user.id);
    return userContext;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('session', { path: '/' });
    return { success: true };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Req() req: Request & AuthenticatedRequest, @Res({ passthrough: true }) _res: Response) {
    if (!req.userContext) {
      throw new UnauthorizedException('Missing session');
    }
    return req.userContext;
  }

  private setSessionCookie(res: Response, userId: string) {
    res.cookie('session', userId, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    });
  }
}
