# Aza8 Hub – Architecture Base

## Overview
- **Core API (`apps/api-core`)** – NestJS service hosting tenancy resolution, RBAC, auditing entities, Prisma/PostgreSQL access, shared guards, and the plugin layer (`Plugin`, `TenantPlugin`) that will drive marketplace-style enablement.
- **Hub Web (`apps/hub-web`)** – Next.js App Router for Aza8 operators. Talks to the API through shared auth helpers.
- **Portal Web (`apps/portal-web`)** – Next.js tenant portals served from `{tenant}.aza8.com.br`, sharing the same API + auth packages.
- **Packages (`packages/*`)** – Shared UI kit, domain types, auth client, configuration utilities, lint/tsconfig presets. All apps consume them through path aliases.

See `docs/platform-overview.md` for the full current-state snapshot of the platform and `docs/development.md` for running the stack locally and applying migrations.

## Tenancy model
1. Requests hit Cloudflare/edge, which terminates TLS, applies WAF policies, and routes `hub.aza8.com.br` / `{slug}.aza8.com.br` to the appropriate Next.js frontends or Core API before the API handles the request.
2. `TenancyMiddleware` inspects the host (`hub.aza8.com.br` => hub context, `{slug}.aza8.com.br` => tenant context) and loads the tenant record.
3. A request-scoped `TenantContextService` stores `{ tenantId, tenantSlug, isHubRequest }` for downstream services.
4. Services (Tenants, Plugins, etc.) always pull the tenantId from this context rather than accepting free-form IDs, guaranteeing isolation.

For deeper coverage of host-based routing, `TenantContext`, and DB patterns, see `docs/tenancy.md`.

## RBAC
- Users authenticate via Aza8 Auth callback → JWT issued by the API.
- Every protected route uses `AuthGuard` (verifies JWT, scopes memberships to the current tenant) + optional `RbacGuard` for role enforcement.
- Roles describe the scope (`GLOBAL_AZA8`, `TENANT`, `PLUGIN`) and map to permissions stored in Prisma. Guards read the resolved roles array on the request context.

Full role/permission mappings plus upcoming `@RequirePermissions` usage live in `docs/rbac.md`.

## Frontends
- Both Next.js apps read runtime config via `@aza8/config`, rely on the shared UI components, and use `@aza8/auth-client` hooks for `/me`, `/tenants/*` calls.
- Hub pages show cross-tenant data (e.g., `/tenants`) guarded by `GLOBAL_AZA8` roles—`AZA8_ADMIN`, `AZA8_ACCOUNT_MANAGER`, `AZA8_OPERATOR`—so only internal operators use them. Portal pages stay inside a single tenant context for membership + plugin surfaces, serving `TENANT_OWNER`, `TENANT_MANAGER`, `TENANT_MARKETING`, and `TENANT_SUPPLIER` roles.
