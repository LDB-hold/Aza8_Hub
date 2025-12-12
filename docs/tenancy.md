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

## Enforcement modes
- Controlled by `TENANCY_ENFORCEMENT_MODE` (`warn` by default, `strict` when fully validated).
- `warn`: middleware logs any missing/invalid tenant context but lets the request through so gaps can be detected without blocking users.
- `strict`: the same checks become blocking—requests that do not satisfy tenancy rules are rejected.
- Operational flow: keep `warn` enabled while new routes are being covered, monitor `TenancyMiddleware` warnings in the logs, and switch to `TENANCY_ENFORCEMENT_MODE=strict` once the warnings stop to fully enforce isolation.

## Database patterns
- Every table referencing tenant data includes a `tenantId` foreign key.
- Queries must include `tenantId = context.tenantId` constraints; reusable helpers can enforce this pattern as modules grow.
- Audit log entries optionally carry `tenantId` and `userId` so activity can be sliced per tenant and per operator.
