// Modelos que recebem tenantId automaticamente via PrismaService.
// Mantenha esta lista sincronizada com docs/tenancy.md para garantir consistência.
export const TENANT_SCOPED_MODELS = [
  'Membership',
  'ToolInstall',
  'Invite',
  'AuditLog',
  'Task',
  'FileItem',
  'RequestItem'
] as const;

export type TenantScopedModelName = (typeof TENANT_SCOPED_MODELS)[number];
