import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard.js';
import { AuthenticatedRequest } from '../../auth/interfaces.js';

@Controller()
export class MeController {
  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() req: AuthenticatedRequest) {
    return req.userContext;
  }
}
