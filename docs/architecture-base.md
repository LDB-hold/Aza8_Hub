# Aza8 Hub – Architecture Base

## Overview
- **Core API (`apps/api-core`)** – NestJS service hosting tenancy resolution, RBAC, auditing entities, Prisma/PostgreSQL access, and shared guards.
- **Hub Web (`apps/hub-web`)** – Next.js App Router for Aza8 operators. Talks to the API through shared auth helpers.
- **Portal Web (`apps/portal-web`)** – Next.js tenant portals served from `{tenant}.aza8.com.br`, sharing the same API + auth packages.
- **Packages (`packages/*`)** – Shared UI kit, domain types, auth client, configuration utilities, lint/tconfig presets. All apps consume them through path aliases.

## Tenancy model
1. Requests hit Cloudflare/edge, then the API.
2. `TenancyMiddleware` inspects the host (`hub.aza8.com.br` => hub context, `{slug}.aza8.com.br` => tenant context) and loads the tenant record.
3. A request-scoped `TenantContextService` stores `{ tenantId, tenantSlug, isHubRequest }` for downstream services.
4. Services (Tenants, Plugins, etc.) always pull the tenantId from this context rather than accepting free-form IDs, guaranteeing isolation.

## RBAC
- Users authenticate via Aza8 Auth callback → JWT issued by the API.
- Every protected route uses `AuthGuard` (verifies JWT, scopes memberships to the current tenant) + optional `RbacGuard` for role enforcement.
- Roles describe the scope (`GLOBAL_AZA8`, `TENANT`, `PLUGIN`) and map to permissions stored in Prisma. Guards read the resolved roles array on the request context.

## Frontends
- Both Next.js apps read runtime config via `@aza8/config`, rely on the shared UI components, and use `@aza8/auth-client` hooks for `/me`, `/tenants/*` calls.
- Hub pages show cross-tenant data (e.g., `/tenants`) guarded by AZA8 global roles. Portal pages stick to the resolved tenant context for membership + plugin surfaces.
