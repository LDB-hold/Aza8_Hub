// TODO: Mirror this list in docs/tenancy.md so model classifications stay aligned with enforcement.
export const TENANT_SCOPED_MODELS = [
  'TenantMembership',
  'TenantPlugin',
  'AuditLog'
] as const;

export type TenantScopedModelName = (typeof TENANT_SCOPED_MODELS)[number];
