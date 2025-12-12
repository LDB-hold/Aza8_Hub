import type { PermissionCode } from './rbac-config.js';

export type TenantStatus = 'ACTIVE' | 'SUSPENDED' | 'DECOMMISSIONED';
export type TenantPlan = 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';

export interface TenantConfig {
  enablePlugins: string[];
  metadata?: Record<string, unknown>;
}

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  status: TenantStatus;
  plan: TenantPlan;
  config: TenantConfig;
  createdAt: Date;
  updatedAt: Date;
}

export type UserStatus = 'ACTIVE' | 'DISABLED' | 'INVITED';

export interface User {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
  authProvider: string;
  authProviderId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const RoleScope = {
  GLOBAL_AZA8: 'GLOBAL_AZA8',
  TENANT: 'TENANT',
  PLUGIN: 'PLUGIN'
} as const;

export type RoleScope = (typeof RoleScope)[keyof typeof RoleScope];

export const BaseRole = {
  AZA8_ADMIN: 'AZA8_ADMIN',
  AZA8_ACCOUNT_MANAGER: 'AZA8_ACCOUNT_MANAGER',
  AZA8_OPERATOR: 'AZA8_OPERATOR',
  TENANT_OWNER: 'TENANT_OWNER',
  TENANT_MANAGER: 'TENANT_MANAGER',
  TENANT_MARKETING: 'TENANT_MARKETING',
  TENANT_SUPPLIER: 'TENANT_SUPPLIER'
} as const;

export type BaseRole = (typeof BaseRole)[keyof typeof BaseRole];

export interface Role {
  id: string;
  scope: RoleScope;
  key: BaseRole;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  permissions?: { permission: Permission }[];
}

export type PermissionScope = 'GLOBAL_AZA8' | 'TENANT' | 'PLUGIN';

export interface Permission {
  id: string;
  key: PermissionCode;
  description?: string;
}

export interface TenantMembership {
  id: string;
  tenantId: string;
  userId: string;
  roleId: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantContext {
  tenantId: string | null;
  tenantSlug: string | null;
  isHubRequest: boolean;
}

export interface CurrentUserContext {
  user: User;
  memberships: TenantMembership[];
  tenantContext: TenantContext;
  roles: BaseRole[];
  permissions: PermissionCode[];
}

export interface PluginDefinition {
  id: string;
  key: string;
  name: string;
  description?: string;
  type: 'DATA' | 'WORKFLOW' | 'INTEGRATION';
}

export interface AuditLog {
  id: string;
  tenantId: string | null;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface TenantScopedQuery {
  tenantId: string;
}

export const HUB_HOST = 'hub.aza8.com.br';

export const isHubHost = (host?: string | null): boolean => {
  if (!host) {
    return false;
  }
  return host === HUB_HOST;
};

export const extractTenantSlugFromHost = (host?: string | null): string | null => {
  if (!host || host === HUB_HOST) {
    return null;
  }
  const [slug] = host.split('.');
  return slug || null;
};

export * from './rbac-config.js';
