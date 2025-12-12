import type { PermissionKey, RoleKey, RoleScope, ToolKey } from './rbac-config.js';
import { rolePermissionsMap, ROLES, PERMISSIONS, TOOL_KEYS } from './rbac-config.js';

export type { PermissionKey, RoleKey, RoleScope, ToolKey };
export { rolePermissionsMap, ROLES, PERMISSIONS, TOOL_KEYS };

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  type: 'HUB' | 'PORTAL';
  createdAt: Date;
}

export interface Membership {
  id: string;
  tenantId: string;
  userId: string;
  roleKey: RoleKey;
}

export interface TenantContext {
  tenantId: string | null;
  tenantSlug: string | null;
  isHubRequest: boolean;
}

export interface CurrentUserContext {
  user: User;
  membership: Membership | null;
  tenantContext: TenantContext;
  role: RoleKey | null;
  permissions: PermissionKey[];
}

export const HUB_HOST = 'hub.aza8.com.br';

export const isHubHost = (host?: string | null): boolean => {
  if (!host) return false;
  return host.split(':')[0] === HUB_HOST || host.startsWith('hub.');
};

export const extractTenantSlugFromHost = (host?: string | null): string | null => {
  if (!host) return null;
  const normalized = host.split(':')[0];
  if (normalized === HUB_HOST || normalized.startsWith('hub.')) {
    return null;
  }
  const [slug] = normalized.split('.');
  return slug || null;
};

export const getPermissionsForRole = (role?: RoleKey | null): PermissionKey[] => {
  if (!role) return [];
  return rolePermissionsMap[role] ?? [];
};

export const isToolKey = (tool: string): tool is ToolKey => {
  return (TOOL_KEYS as readonly string[]).includes(tool);
};
