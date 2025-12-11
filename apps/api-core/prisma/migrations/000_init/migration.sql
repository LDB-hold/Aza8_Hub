-- Initial Prisma migration scaffold for Version 0
CREATE TABLE IF NOT EXISTS "Tenant" (
    "id" TEXT PRIMARY KEY,
    "slug" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "authProvider" TEXT NOT NULL,
    "authProviderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "Role" (
    "id" TEXT PRIMARY KEY,
    "scope" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "Permission" (
    "id" TEXT PRIMARY KEY,
    "key" TEXT NOT NULL UNIQUE,
    "description" TEXT
);

CREATE TABLE IF NOT EXISTS "RolePermission" (
    "id" TEXT PRIMARY KEY,
    "roleId" TEXT NOT NULL REFERENCES "Role"("id") ON DELETE CASCADE,
    "permissionId" TEXT NOT NULL REFERENCES "Permission"("id") ON DELETE CASCADE,
    CONSTRAINT role_permission_unique UNIQUE ("roleId", "permissionId")
);

CREATE TABLE IF NOT EXISTS "TenantMembership" (
    "id" TEXT PRIMARY KEY,
    "tenantId" TEXT NOT NULL REFERENCES "Tenant"("id") ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "roleId" TEXT NOT NULL REFERENCES "Role"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT tenant_membership_unique UNIQUE ("tenantId", "userId", "roleId")
);

CREATE TABLE IF NOT EXISTS "Plugin" (
    "id" TEXT PRIMARY KEY,
    "key" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "configSchema" JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "TenantPlugin" (
    "id" TEXT PRIMARY KEY,
    "tenantId" TEXT NOT NULL REFERENCES "Tenant"("id") ON DELETE CASCADE,
    "pluginId" TEXT NOT NULL REFERENCES "Plugin"("id") ON DELETE CASCADE,
    "status" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT tenant_plugin_unique UNIQUE ("tenantId", "pluginId")
);

CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT PRIMARY KEY,
    "tenantId" TEXT REFERENCES "Tenant"("id") ON DELETE SET NULL,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
