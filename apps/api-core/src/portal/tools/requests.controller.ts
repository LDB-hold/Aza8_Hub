import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { RequestStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import { AuthGuard } from '../../auth/auth.guard.js';
import { PermissionsGuard } from '../../rbac/rbac.guard.js';
import { RequirePermissions } from '../../rbac/rbac.decorator.js';
import { AuthenticatedRequest } from '../../auth/interfaces.js';
import { TenantContextService } from '../../tenancy/tenant-context.service.js';

class RequestCreateDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  @MinLength(1)
  description!: string;
}

class RequestDecisionDto {
  @IsOptional()
  @IsString()
  note?: string;
}

@Controller('portal/tools/requests')
@UseGuards(AuthGuard)
export class PortalRequestsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService
  ) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('TOOL_REQUESTS_READ')
  async list() {
    const context = this.tenantContext.getContext();
    return this.prisma.requestItem.findMany({
      where: { tenantId: context.tenantId ?? undefined },
      orderBy: { createdAt: 'desc' }
    });
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('TOOL_REQUESTS_CREATE')
  async create(@Body() dto: RequestCreateDto, @Req() req: AuthenticatedRequest) {
    const context = this.tenantContext.getContext();
    return this.prisma.requestItem.create({
      data: {
        id: randomUUID(),
        title: dto.title,
        description: dto.description,
        status: RequestStatus.OPEN,
        createdByUserId: req.userContext?.user.id ?? '',
        tenantId: context.tenantId as string
      }
    });
  }

  @Post(':id/approve')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('TOOL_REQUESTS_APPROVE')
  async approve(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Body() _dto: RequestDecisionDto) {
    const context = this.tenantContext.getContext();
    return this.prisma.requestItem.update({
      where: { id, tenantId: context.tenantId ?? undefined },
      data: {
        status: RequestStatus.APPROVED,
        decidedByUserId: req.userContext?.user.id ?? undefined
      }
    });
  }

  @Post(':id/reject')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('TOOL_REQUESTS_APPROVE')
  async reject(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Body() _dto: RequestDecisionDto) {
    const context = this.tenantContext.getContext();
    return this.prisma.requestItem.update({
      where: { id, tenantId: context.tenantId ?? undefined },
      data: {
        status: RequestStatus.REJECTED,
        decidedByUserId: req.userContext?.user.id ?? undefined
      }
    });
  }
}
