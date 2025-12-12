import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { IsString, MinLength } from 'class-validator';
import { PrismaService } from '../../database/prisma.service.js';
import { AuthGuard } from '../../auth/auth.guard.js';
import { PermissionsGuard } from '../../rbac/rbac.guard.js';
import { RequirePermissions } from '../../rbac/rbac.decorator.js';
import { TenantContextService } from '../../tenancy/tenant-context.service.js';

class FileCreateDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(1)
  contentText!: string;
}

@Controller('portal/tools/files')
@UseGuards(AuthGuard)
export class PortalFilesController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService
  ) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('TOOL_FILES_READ')
  async list() {
    const context = this.tenantContext.getContext();
    return this.prisma.fileItem.findMany({
      where: { tenantId: context.tenantId ?? undefined },
      orderBy: { createdAt: 'desc' }
    });
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('TOOL_FILES_WRITE')
  async create(@Body() dto: FileCreateDto) {
    const context = this.tenantContext.getContext();
    return this.prisma.fileItem.create({
      data: {
        id: randomUUID(),
        tenantId: context.tenantId as string,
        name: dto.name,
        contentText: dto.contentText
      }
    });
  }

  @Get(':id/download')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('TOOL_FILES_READ')
  async download(@Param('id') id: string, @Res() res: Response) {
    const context = this.tenantContext.getContext();
    const file = await this.prisma.fileItem.findUnique({ where: { id, tenantId: context.tenantId ?? undefined } });
    if (!file) {
      res.status(404).send('Not found');
      return;
    }
    res.setHeader('Content-Type', 'text/plain');
    res.send(file.contentText);
  }
}
