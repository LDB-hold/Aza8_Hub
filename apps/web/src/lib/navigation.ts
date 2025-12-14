import { PermissionKey, ToolKey, TOOL_KEYS } from '@aza8/core-domain';
import type { Session } from './auth';
import type { TenantContext } from './tenant';

export type NavItem = {
  key: string;
  label: string;
  description: string;
  href: string;
  icon: string;
  host: 'portal' | 'hub' | 'both';
  requiredPermissions: PermissionKey[];
  hubPermissions?: PermissionKey[];
  toolKey?: ToolKey;
  testId: string;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

type BuildNavigationInput = {
  session: Session;
  tenant: TenantContext;
  installedTools?: ToolKey[];
};

const portalNavigation: NavSection[] = [
  {
    title: 'Visão geral',
    items: [
      {
        key: 'dashboard',
        label: 'Dashboard',
        description: 'Resumo SAP por tenant',
        href: '/dashboard',
        icon: 'space_dashboard',
        host: 'portal',
        requiredPermissions: ['PORTAL_DASHBOARD_VIEW'],
        testId: 'nav-dashboard'
      }
    ]
  },
  {
    title: 'Ferramentas',
    items: [
      {
        key: 'tasks',
        label: 'Tasks',
        description: 'Fluxos e listas',
        href: '/tools/tasks',
        icon: 'checklist',
        host: 'portal',
        requiredPermissions: ['TOOL_TASKS_READ'],
        toolKey: 'tasks',
        testId: 'nav-tasks'
      },
      {
        key: 'files',
        label: 'Files',
        description: 'Arquivos e evidências',
        href: '/tools/files',
        icon: 'folder',
        host: 'portal',
        requiredPermissions: ['TOOL_FILES_READ'],
        toolKey: 'files',
        testId: 'nav-files'
      },
      {
        key: 'requests',
        label: 'Requests',
        description: 'Solicitações do cliente',
        href: '/tools/requests',
        icon: 'assignment',
        host: 'portal',
        requiredPermissions: ['TOOL_REQUESTS_READ'],
        toolKey: 'requests',
        testId: 'nav-requests'
      },
      {
        key: 'reports',
        label: 'Reports',
        description: 'Indicadores e gráficos',
        href: '/tools/reports',
        icon: 'monitoring',
        host: 'portal',
        requiredPermissions: ['TOOL_REPORTS_READ'],
        toolKey: 'reports',
        testId: 'nav-reports'
      }
    ]
  },
  {
    title: 'Equipe',
    items: [
      {
        key: 'team-members',
        label: 'Membros',
        description: 'Gestão de papéis e acessos',
        href: '/team/members',
        icon: 'groups',
        host: 'portal',
        requiredPermissions: ['TENANT_MEMBER_READ'],
        testId: 'nav-team-members'
      },
      {
        key: 'team-invitations',
        label: 'Convites',
        description: 'Convide usuários',
        href: '/team/invitations',
        icon: 'person_add',
        host: 'portal',
        requiredPermissions: ['TENANT_MEMBER_INVITE'],
        testId: 'nav-team-invitations'
      }
    ]
  },
  {
    title: 'Configurações',
    items: [
      {
        key: 'settings-profile',
        label: 'Perfil',
        description: 'Preferências do usuário',
        href: '/settings/profile',
        icon: 'badge',
        host: 'portal',
        requiredPermissions: ['PORTAL_DASHBOARD_VIEW'],
        testId: 'nav-settings-profile'
      },
      {
        key: 'settings-organization',
        label: 'Organização',
        description: 'Dados cadastrais',
        href: '/settings/organization',
        icon: 'business',
        host: 'portal',
        requiredPermissions: ['TENANT_SETTINGS_READ'],
        testId: 'nav-settings-organization'
      },
      {
        key: 'settings-billing',
        label: 'Billing',
        description: 'Plano e faturas',
        href: '/settings/billing',
        icon: 'receipt_long',
        host: 'portal',
        requiredPermissions: ['TENANT_BILLING_READ'],
        testId: 'nav-settings-billing'
      },
      {
        key: 'audit',
        label: 'Audit',
        description: 'Eventos e trilhas',
        href: '/audit',
        icon: 'rule',
        host: 'portal',
        requiredPermissions: ['AUDIT_READ'],
        testId: 'nav-audit'
      }
    ]
  }
];

const hubNavigation: NavSection[] = [
  {
    title: 'Hub',
    items: [
      {
        key: 'hub-dashboard',
        label: 'Hub Dashboard',
        description: 'Panorama multi-tenant',
        href: '/hub/dashboard',
        icon: 'hub',
        host: 'hub',
        requiredPermissions: ['HUB_DASHBOARD_VIEW'],
        testId: 'nav-hub-dashboard'
      },
      {
        key: 'hub-tenants',
        label: 'Tenants',
        description: 'Gestão multiempresa',
        href: '/hub/tenants',
        icon: 'lan',
        host: 'hub',
        requiredPermissions: ['HUB_TENANT_READ'],
        testId: 'nav-hub-tenants'
      },
      {
        key: 'hub-tenants-new',
        label: 'Novo Tenant',
        description: 'Criar tenant',
        href: '/hub/tenants/new',
        icon: 'add_business',
        host: 'hub',
        requiredPermissions: ['HUB_TENANT_WRITE'],
        testId: 'nav-hub-tenants-new'
      },
      {
        key: 'hub-rbac',
        label: 'RBAC',
        description: 'Papéis e permissões',
        href: '/hub/rbac',
        icon: 'admin_panel_settings',
        host: 'hub',
        requiredPermissions: ['HUB_RBAC_VIEW'],
        testId: 'nav-hub-rbac'
      },
      {
        key: 'hub-audit',
        label: 'Audit Hub',
        description: 'Eventos críticos',
        href: '/hub/audit',
        icon: 'rule_settings',
        host: 'hub',
        requiredPermissions: ['HUB_AUDIT_READ'],
        testId: 'nav-hub-audit'
      }
    ]
  }
];

export const NAV_BLUEPRINT: NavSection[] = [...portalNavigation, ...hubNavigation];

const SEEDED_TOOLS: Record<string, ToolKey[]> = {
  alpha: ['tasks', 'files', 'requests', 'reports'],
  beta: ['tasks', 'reports']
};

const DEFAULT_TOOLS: ToolKey[] = ['tasks', 'files', 'requests', 'reports'];

const permissionsForHost = (item: NavItem, isHub: boolean): PermissionKey[] => {
  if (isHub && item.hubPermissions) return item.hubPermissions;
  return item.requiredPermissions;
};

const hasPermissions = (session: Session, permissions: PermissionKey[]) => {
  if (permissions.length === 0) return true;
  return permissions.every((permission) => session.permissions.includes(permission));
};

const isHostAllowed = (item: NavItem, isHub: boolean) => {
  if (item.host === 'both') return true;
  if (item.host === 'hub') return isHub;
  return !isHub;
};

export const flattenNavItems = (sections: NavSection[]): NavItem[] => sections.flatMap((section) => section.items);
export const ALL_NAV_ITEMS = flattenNavItems(NAV_BLUEPRINT);

export function getInstalledTools(tenant: TenantContext): ToolKey[] {
  if (tenant.isHub) return [...TOOL_KEYS];
  if (SEEDED_TOOLS[tenant.tenantKey]) return SEEDED_TOOLS[tenant.tenantKey];
  return DEFAULT_TOOLS;
}

export function buildNavigation({ session, tenant, installedTools }: BuildNavigationInput): NavSection[] {
  const tools = installedTools ?? getInstalledTools(tenant);
  return NAV_BLUEPRINT
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (!isHostAllowed(item, tenant.isHub)) return false;
        const required = permissionsForHost(item, tenant.isHub);
        if (!hasPermissions(session, required)) return false;
        if (item.toolKey && !tools.includes(item.toolKey)) return false;
        return true;
      })
    }))
    .filter((section) => section.items.length > 0);
}

export function findActiveNavItem(pathname: string, items: NavItem[]): NavItem | null {
  const sorted = [...items].sort((a, b) => b.href.length - a.href.length);
  return sorted.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ?? null;
}

export type RouteGuardState =
  | { state: 'ok'; item: NavItem | null }
  | { state: 'forbidden'; reason: 'permissions' | 'host'; item: NavItem | null }
  | { state: 'tool-missing'; item: NavItem | null };

export function evaluateRouteAccess(
  pathname: string,
  {
    session,
    tenant,
    installedTools,
    activeItem
  }: { session: Session; tenant: TenantContext; installedTools: ToolKey[]; activeItem: NavItem | null }
): RouteGuardState {
  if (!activeItem) {
    return { state: 'ok', item: null };
  }

  if (!isHostAllowed(activeItem, tenant.isHub)) {
    return { state: 'forbidden', reason: 'host', item: activeItem };
  }

  const requiredPermissions = permissionsForHost(activeItem, tenant.isHub);
  if (!hasPermissions(session, requiredPermissions)) {
    return { state: 'forbidden', reason: 'permissions', item: activeItem };
  }

  if (activeItem.toolKey && !installedTools.includes(activeItem.toolKey)) {
    return { state: 'tool-missing', item: activeItem };
  }

  return { state: 'ok', item: activeItem };
}
