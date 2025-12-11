import { Controller, Get, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { AuthGuard } from '../../auth/guards/auth.guard.js';
import { CurrentUserContext } from '@aza8/core-domain';

@Controller()
export class MeController {
  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentUser() currentUser: CurrentUserContext) {
    return currentUser;
  }
}
