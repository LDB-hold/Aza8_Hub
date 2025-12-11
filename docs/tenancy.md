# Tenancy Model

## Host-based routing
- `hub.aza8.com.br` → hub mode, no tenantId, `isHubRequest=true`.
- `{slug}.aza8.com.br` → tenant mode, lookup `Tenant` by slug, populate context `{ tenantId, tenantSlug, isHubRequest=false }`.
- Local development treats `localhost` as hub and `*.localhost` as tenant slugs.

## TenantContext flow
1. `TenancyMiddleware` resolves the host + tenant record before controllers run.
2. `TenantContextService` exposes the request-scoped context to guards/services.
3. Business services (TenantsService, future PluginService, etc.) never accept arbitrary tenant IDs—they always read from `TenantContextService`.
4. `AuthGuard` filters memberships to the active tenant (or global roles if hub) so RBAC decisions are accurate.

## Database patterns
- Every table referencing tenant data includes a `tenantId` foreign key.
- Queries must include `tenantId = context.tenantId` constraints; reusable helpers can enforce this pattern as modules grow.
- Audit log entries optionally carry `tenantId` and `userId` so activity can be sliced per tenant and per operator.
