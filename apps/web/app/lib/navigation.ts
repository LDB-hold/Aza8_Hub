import { PermissionKey, ToolKey } from '@aza8/core-domain';

export type NavItem = {
  label: string;
  path: string;
  requiredPermissions: PermissionKey[];
  description: string;
  area: 'hub' | 'portal';
  toolKey?: ToolKey;
};

const hubNav: NavItem[] = [
  { label: 'Dashboard', path: '/hub/dashboard', requiredPermissions: ['HUB_DASHBOARD_VIEW'], description: 'Visão geral do hub', area: 'hub' },
  { label: 'Tenants', path: '/hub/tenants', requiredPermissions: ['HUB_TENANT_READ'], description: 'Lista tenants', area: 'hub' },
  { label: 'Novo Tenant', path: '/hub/tenants/new', requiredPermissions: ['HUB_TENANT_WRITE'], description: 'Criar tenant', area: 'hub' },
  { label: 'RBAC Roles', path: '/hub/rbac/roles', requiredPermissions: ['HUB_RBAC_VIEW'], description: 'Roles do hub', area: 'hub' },
  { label: 'RBAC Permissions', path: '/hub/rbac/permissions', requiredPermissions: ['HUB_RBAC_VIEW'], description: 'Permissões do hub', area: 'hub' },
  { label: 'Audit', path: '/hub/audit', requiredPermissions: ['HUB_AUDIT_READ'], description: 'Auditoria hub', area: 'hub' }
];

const portalNav: NavItem[] = [
  { label: 'Dashboard', path: '/app/dashboard', requiredPermissions: ['PORTAL_DASHBOARD_VIEW'], description: 'Visão do tenant', area: 'portal' },
  { label: 'Tools', path: '/app/tools', requiredPermissions: ['PORTAL_DASHBOARD_VIEW'], description: 'Lista de ferramentas', area: 'portal' },
  { label: 'Tasks', path: '/app/tools/tasks', requiredPermissions: ['TOOL_TASKS_READ'], description: 'Tasks da equipe', area: 'portal', toolKey: 'tasks' },
  { label: 'Files', path: '/app/tools/files', requiredPermissions: ['TOOL_FILES_READ'], description: 'Arquivos', area: 'portal', toolKey: 'files' },
  { label: 'Requests', path: '/app/tools/requests', requiredPermissions: ['TOOL_REQUESTS_READ'], description: 'Solicitações', area: 'portal', toolKey: 'requests' },
  { label: 'Reports', path: '/app/tools/reports', requiredPermissions: ['TOOL_REPORTS_READ'], description: 'Relatórios', area: 'portal', toolKey: 'reports' },
  { label: 'Members', path: '/app/team/members', requiredPermissions: ['TENANT_MEMBER_READ'], description: 'Membros do tenant', area: 'portal' },
  { label: 'Invitations', path: '/app/team/invitations', requiredPermissions: ['TENANT_MEMBER_INVITE'], description: 'Convites', area: 'portal' },
  { label: 'Profile', path: '/app/settings/profile', requiredPermissions: ['PORTAL_DASHBOARD_VIEW'], description: 'Perfil', area: 'portal' },
  { label: 'Organization', path: '/app/settings/organization', requiredPermissions: ['TENANT_SETTINGS_READ'], description: 'Organização', area: 'portal' },
  { label: 'Billing', path: '/app/settings/billing', requiredPermissions: ['TENANT_BILLING_READ'], description: 'Billing', area: 'portal' },
  { label: 'Audit', path: '/app/audit', requiredPermissions: ['AUDIT_READ'], description: 'Auditoria', area: 'portal' }
];

export const navConfig: NavItem[] = [...hubNav, ...portalNav];

export const toolEnabledForTenant = (tenantSlug: string | null, toolKey?: ToolKey) => {
  if (!toolKey) return true;
  if (!tenantSlug) return true;
  if (tenantSlug === 'beta') {
    return toolKey === 'tasks' || toolKey === 'reports';
  }
  return true;
};

export function filterNav(area: 'hub' | 'portal', permissions: PermissionKey[], tenantSlug: string | null) {
  return navConfig.filter((item) => {
    if (item.area !== area) return false;
    const hasPerms = item.requiredPermissions.every((perm) => permissions.includes(perm));
    if (!hasPerms) return false;
    if (!toolEnabledForTenant(tenantSlug, item.toolKey)) return false;
    return true;
  });
}
