import { PrismaClient, RequestStatus, TaskStatus, RoleScope } from '@prisma/client';

const prisma = new PrismaClient();

const TENANTS = [
  { id: 'tenant_alpha', slug: 'alpha', name: 'Tenant Alpha' },
  { id: 'tenant_beta', slug: 'beta', name: 'Tenant Beta' }
];

const TOOLS = [
  { key: 'tasks', name: 'Tasks' },
  { key: 'files', name: 'Files' },
  { key: 'requests', name: 'Requests' },
  { key: 'reports', name: 'Reports' }
];

const USERS = [
  { id: 'user_aza8_admin', email: 'aza8_admin@aza8.com', name: 'Aza8 Admin', type: 'HUB' as const },
  { id: 'user_aza8_support', email: 'aza8_support@aza8.com', name: 'Aza8 Support', type: 'HUB' as const },
  { id: 'user_owner_alpha', email: 'owner.alpha@client.com', name: 'Owner Alpha', type: 'PORTAL' as const },
  { id: 'user_manager_alpha', email: 'manager.alpha@client.com', name: 'Manager Alpha', type: 'PORTAL' as const },
  { id: 'user_member_alpha', email: 'member.alpha@client.com', name: 'Member Alpha', type: 'PORTAL' as const },
  { id: 'user_supplier_alpha', email: 'supplier.alpha@client.com', name: 'Supplier Alpha', type: 'PORTAL' as const },
  { id: 'user_owner_beta', email: 'owner.beta@client.com', name: 'Owner Beta', type: 'PORTAL' as const },
  { id: 'user_member_beta', email: 'member.beta@client.com', name: 'Member Beta', type: 'PORTAL' as const }
];

const ROLES = [
  { key: 'AZA8_ADMIN', scope: 'HUB', name: 'Aza8 Admin' },
  { key: 'AZA8_SUPPORT', scope: 'HUB', name: 'Aza8 Support' },
  { key: 'AZA8_ACCOUNT_MANAGER', scope: 'HUB', name: 'Aza8 Account Manager' },
  { key: 'OWNER', scope: 'PORTAL', name: 'Owner' },
  { key: 'MANAGER', scope: 'PORTAL', name: 'Manager' },
  { key: 'MEMBER', scope: 'PORTAL', name: 'Member' },
  { key: 'SUPPLIER', scope: 'PORTAL', name: 'Supplier' }
];

const PERMISSIONS = [
  'HUB_DASHBOARD_VIEW',
  'HUB_TENANT_READ',
  'HUB_TENANT_WRITE',
  'HUB_TENANT_USERS_READ',
  'HUB_TENANT_USERS_WRITE',
  'HUB_TOOLS_MANAGE',
  'HUB_RBAC_VIEW',
  'HUB_AUDIT_READ',
  'PORTAL_DASHBOARD_VIEW',
  'TENANT_MEMBER_READ',
  'TENANT_MEMBER_INVITE',
  'TENANT_MEMBER_ROLE_UPDATE',
  'TENANT_SETTINGS_READ',
  'TENANT_SETTINGS_WRITE',
  'TENANT_BILLING_READ',
  'TENANT_BILLING_WRITE',
  'AUDIT_READ',
  'TOOL_TASKS_READ',
  'TOOL_TASKS_WRITE',
  'TOOL_FILES_READ',
  'TOOL_FILES_WRITE',
  'TOOL_REQUESTS_READ',
  'TOOL_REQUESTS_CREATE',
  'TOOL_REQUESTS_APPROVE',
  'TOOL_REPORTS_READ'
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  AZA8_ADMIN: [
    'HUB_DASHBOARD_VIEW',
    'HUB_TENANT_READ',
    'HUB_TENANT_WRITE',
    'HUB_TENANT_USERS_READ',
    'HUB_TENANT_USERS_WRITE',
    'HUB_TOOLS_MANAGE',
    'HUB_RBAC_VIEW',
    'HUB_AUDIT_READ'
  ],
  AZA8_SUPPORT: ['HUB_DASHBOARD_VIEW', 'HUB_TENANT_READ', 'HUB_TENANT_USERS_READ', 'HUB_AUDIT_READ'],
  AZA8_ACCOUNT_MANAGER: [
    'HUB_DASHBOARD_VIEW',
    'HUB_TENANT_READ',
    'HUB_TENANT_WRITE',
    'HUB_TENANT_USERS_READ',
    'HUB_TOOLS_MANAGE',
    'HUB_AUDIT_READ'
  ],
  OWNER: [
    'PORTAL_DASHBOARD_VIEW',
    'TENANT_MEMBER_READ',
    'TENANT_MEMBER_INVITE',
    'TENANT_MEMBER_ROLE_UPDATE',
    'TENANT_SETTINGS_READ',
    'TENANT_SETTINGS_WRITE',
    'TENANT_BILLING_READ',
    'TENANT_BILLING_WRITE',
    'AUDIT_READ',
    'TOOL_TASKS_READ',
    'TOOL_TASKS_WRITE',
    'TOOL_FILES_READ',
    'TOOL_FILES_WRITE',
    'TOOL_REQUESTS_READ',
    'TOOL_REQUESTS_CREATE',
    'TOOL_REQUESTS_APPROVE',
    'TOOL_REPORTS_READ'
  ],
  MANAGER: [
    'PORTAL_DASHBOARD_VIEW',
    'TENANT_MEMBER_READ',
    'TENANT_MEMBER_INVITE',
    'TENANT_SETTINGS_READ',
    'TENANT_SETTINGS_WRITE',
    'AUDIT_READ',
    'TOOL_TASKS_READ',
    'TOOL_TASKS_WRITE',
    'TOOL_FILES_READ',
    'TOOL_FILES_WRITE',
    'TOOL_REQUESTS_READ',
    'TOOL_REQUESTS_CREATE',
    'TOOL_REPORTS_READ'
  ],
  MEMBER: [
    'PORTAL_DASHBOARD_VIEW',
    'TOOL_TASKS_READ',
    'TOOL_TASKS_WRITE',
    'TOOL_FILES_READ',
    'TOOL_FILES_WRITE',
    'TOOL_REQUESTS_READ',
    'TOOL_REQUESTS_CREATE',
    'TOOL_REPORTS_READ'
  ],
  SUPPLIER: ['PORTAL_DASHBOARD_VIEW', 'TOOL_FILES_READ', 'TOOL_FILES_WRITE', 'TOOL_REQUESTS_READ']
};

const MEMBERSHIPS = [
  { id: 'm_owner_alpha', tenantSlug: 'alpha', userEmail: 'owner.alpha@client.com', roleKey: 'OWNER' },
  { id: 'm_manager_alpha', tenantSlug: 'alpha', userEmail: 'manager.alpha@client.com', roleKey: 'MANAGER' },
  { id: 'm_member_alpha', tenantSlug: 'alpha', userEmail: 'member.alpha@client.com', roleKey: 'MEMBER' },
  { id: 'm_supplier_alpha', tenantSlug: 'alpha', userEmail: 'supplier.alpha@client.com', roleKey: 'SUPPLIER' },
  { id: 'm_owner_beta', tenantSlug: 'beta', userEmail: 'owner.beta@client.com', roleKey: 'OWNER' },
  { id: 'm_member_beta', tenantSlug: 'beta', userEmail: 'member.beta@client.com', roleKey: 'MEMBER' }
];

const TOOL_INSTALLS = [
  { id: 'ti_alpha_tasks', tenantSlug: 'alpha', toolKey: 'tasks', enabled: true },
  { id: 'ti_alpha_files', tenantSlug: 'alpha', toolKey: 'files', enabled: true },
  { id: 'ti_alpha_requests', tenantSlug: 'alpha', toolKey: 'requests', enabled: true },
  { id: 'ti_alpha_reports', tenantSlug: 'alpha', toolKey: 'reports', enabled: true },
  { id: 'ti_beta_tasks', tenantSlug: 'beta', toolKey: 'tasks', enabled: true },
  { id: 'ti_beta_reports', tenantSlug: 'beta', toolKey: 'reports', enabled: true },
  { id: 'ti_beta_files', tenantSlug: 'beta', toolKey: 'files', enabled: false },
  { id: 'ti_beta_requests', tenantSlug: 'beta', toolKey: 'requests', enabled: false }
];

const TASKS = [
  {
    id: 'task_alpha_1',
    tenantSlug: 'alpha',
    title: 'Seed task alpha',
    status: TaskStatus.OPEN
  },
  {
    id: 'task_beta_1',
    tenantSlug: 'beta',
    title: 'Seed task beta',
    status: TaskStatus.IN_PROGRESS
  }
];

const FILES = [
  {
    id: 'file_alpha_1',
    tenantSlug: 'alpha',
    name: 'Welcome Alpha',
    contentText: 'Alpha file seed'
  }
];

const REQUESTS = [
  {
    id: 'req_alpha_1',
    tenantSlug: 'alpha',
    title: 'Seed request',
    description: 'Please approve this seed',
    status: RequestStatus.OPEN,
    createdByEmail: 'owner.alpha@client.com'
  }
];

async function main() {
  for (const tenant of TENANTS) {
    await prisma.tenant.upsert({
      where: { id: tenant.id },
      update: { name: tenant.name, slug: tenant.slug },
      create: tenant
    });
  }

  for (const tool of TOOLS) {
    await prisma.tool.upsert({
      where: { key: tool.key },
      update: { name: tool.name },
      create: tool
    });
  }

  for (const user of USERS) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email, name: user.name, type: user.type },
      create: user
    });
  }

  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { key: role.key },
      update: { name: role.name, scope: role.scope as RoleScope },
      create: { key: role.key, scope: role.scope as RoleScope, name: role.name, description: role.name }
    });
  }

  for (const perm of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key: perm },
      update: {},
      create: { key: perm, description: perm }
    });
  }

  for (const [roleKey, perms] of Object.entries(ROLE_PERMISSIONS)) {
    for (const perm of perms) {
      await prisma.rolePermission.upsert({
        where: { roleKey_permissionKey: { roleKey, permissionKey: perm } },
        update: {},
        create: { roleKey, permissionKey: perm }
      });
    }
  }

  for (const membership of MEMBERSHIPS) {
    const tenantId = TENANTS.find((t) => t.slug === membership.tenantSlug)?.id;
    const userId = USERS.find((u) => u.email === membership.userEmail)?.id;
    if (!tenantId || !userId) continue;
    await prisma.membership.upsert({
      where: { tenantId_userId: { tenantId, userId } },
      update: { roleKey: membership.roleKey },
      create: { id: membership.id, tenantId, userId, roleKey: membership.roleKey }
    });
  }

  for (const install of TOOL_INSTALLS) {
    const tenantId = TENANTS.find((t) => t.slug === install.tenantSlug)?.id;
    if (!tenantId) continue;
    await prisma.toolInstall.upsert({
      where: { tenantId_toolKey: { tenantId, toolKey: install.toolKey } },
      update: { enabled: install.enabled },
      create: {
        id: install.id,
        tenantId,
        toolKey: install.toolKey,
        enabled: install.enabled
      }
    });
  }

  for (const task of TASKS) {
    const tenantId = TENANTS.find((t) => t.slug === task.tenantSlug)?.id;
    if (!tenantId) continue;
    await prisma.task.upsert({
      where: { id: task.id },
      update: { status: task.status, title: task.title, tenantId },
      create: { id: task.id, title: task.title, status: task.status, tenantId }
    });
  }

  for (const file of FILES) {
    const tenantId = TENANTS.find((t) => t.slug === file.tenantSlug)?.id;
    if (!tenantId) continue;
    await prisma.fileItem.upsert({
      where: { id: file.id },
      update: { tenantId, name: file.name, contentText: file.contentText },
      create: { id: file.id, name: file.name, contentText: file.contentText, tenantId }
    });
  }

  for (const request of REQUESTS) {
    const tenantId = TENANTS.find((t) => t.slug === request.tenantSlug)?.id;
    const creatorId = USERS.find((u) => u.email === request.createdByEmail)?.id;
    if (!tenantId || !creatorId) continue;
    await prisma.requestItem.upsert({
      where: { id: request.id },
      update: {
        tenantId,
        title: request.title,
        description: request.description,
        status: request.status,
        createdByUserId: creatorId
      },
      create: {
        id: request.id,
        tenantId,
        title: request.title,
        description: request.description,
        status: request.status,
        createdByUserId: creatorId
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
