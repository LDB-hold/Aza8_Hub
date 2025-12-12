import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { PrismaService } from '../../database/prisma.service.js';
import { TenantContextService } from '../../tenancy/tenant-context.service.js';
import { AuthGuard } from '../../auth/auth.guard.js';
import { PermissionsGuard } from '../../rbac/rbac.guard.js';
import { RequirePermissions } from '../../rbac/rbac.decorator.js';
import { TaskStatus } from '@prisma/client';

class TaskCreateDto {
  @IsString()
  @MinLength(1)
  title!: string;
}

class TaskUpdateDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}

@Controller('portal/tools/tasks')
@UseGuards(AuthGuard)
export class PortalTasksController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService
  ) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('TOOL_TASKS_READ')
  async list() {
    const context = this.tenantContext.getContext();
    return this.prisma.task.findMany({
      where: { tenantId: context.tenantId ?? undefined },
      orderBy: { createdAt: 'desc' }
    });
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('TOOL_TASKS_WRITE')
  async create(@Body() dto: TaskCreateDto) {
    const context = this.tenantContext.getContext();
    return this.prisma.task.create({
      data: {
        id: randomUUID(),
        tenantId: context.tenantId as string,
        title: dto.title,
        status: TaskStatus.OPEN
      }
    });
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('TOOL_TASKS_WRITE')
  async update(@Param('id') id: string, @Body() dto: TaskUpdateDto) {
    const context = this.tenantContext.getContext();
    return this.prisma.task.update({
      where: { id, tenantId: context.tenantId ?? undefined },
      data: {
        ...(dto.title ? { title: dto.title } : {}),
        ...(dto.status ? { status: dto.status } : {})
      }
    });
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('TOOL_TASKS_WRITE')
  async remove(@Param('id') id: string) {
    const context = this.tenantContext.getContext();
    await this.prisma.task.delete({ where: { id, tenantId: context.tenantId ?? undefined } });
    return { success: true };
  }
}
