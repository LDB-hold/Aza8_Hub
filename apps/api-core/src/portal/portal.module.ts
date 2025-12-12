import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { RbacModule } from '../rbac/rbac.module.js';
import { PortalTasksController } from './tools/tasks.controller.js';
import { PortalFilesController } from './tools/files.controller.js';
import { PortalRequestsController } from './tools/requests.controller.js';
import { PortalReportsController } from './tools/reports.controller.js';
import { PortalMembersController } from './team/members.controller.js';
import { PortalInvitesController } from './team/invites.controller.js';
import { PortalAuditController } from './audit.controller.js';

@Module({
  imports: [AuthModule, RbacModule],
  controllers: [
    PortalTasksController,
    PortalFilesController,
    PortalRequestsController,
    PortalReportsController,
    PortalMembersController,
    PortalInvitesController,
    PortalAuditController
  ]
})
export class PortalModule {}
