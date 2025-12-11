import { Body, Controller, Post } from '@nestjs/common';

import { AuthCallbackDto } from './dto/auth-callback.dto.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('callback')
  callback(@Body() payload: AuthCallbackDto) {
    return this.authService.handleCallback(payload);
  }
}
