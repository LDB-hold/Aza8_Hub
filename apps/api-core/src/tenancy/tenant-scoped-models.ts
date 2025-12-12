// Modelos que recebem tenantId automaticamente via PrismaService.
// Mantenha esta lista sincronizada com docs/tenancy.md para garantir consistência.
export const TENANT_SCOPED_MODELS = [
  'TenantMembership',
  'TenantPlugin',
  'AuditLog'
] as const;

export type TenantScopedModelName = (typeof TENANT_SCOPED_MODELS)[number];
