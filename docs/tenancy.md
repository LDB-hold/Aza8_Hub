# Tenancy Model (host-based)

## Resolução de host
- `hub.aza8.com.br` (ou `hub.localhost`) → contexto hub `{ tenantId: null, isHubRequest: true }`.
- `{slug}.aza8.com.br` (ou `{slug}.localhost`) → contexto portal `{ tenantId, tenantSlug, isHubRequest: false }` carregado a partir do banco.
- Middleware lê `x-forwarded-host` antes de `host` para suportar edge/CDN. **Não há override manual via headers**; o tenant é sempre derivado do host.

## Fluxo de contexto
1. `TenancyMiddleware` resolve o host e insere o contexto na `TenantContextStore` (AsyncLocalStorage).
2. `TenantContextService` expõe o contexto por requisição para guards/services sem aceitar `tenantId` externo.
3. `AuthGuard` valida sessão, confirma membership do tenant atual (portal) ou role de hub, e injeta `userContext` na request.
4. `PermissionsGuard` usa `@RequirePermissions(...)` para bloquear rota quando o usuário não possui todos os requisitos.

## Enforcements Prisma
- Modelos escopados: `Membership`, `ToolInstall`, `Invite`, `AuditLog`, `Task`, `FileItem`, `RequestItem`.
- `PrismaService` middleware injeta `tenantId` em writes e filtra reads automaticamente quando `isHubRequest=false`.
- `TENANCY_ENFORCEMENT_MODE=strict` (padrão) gera erro em writes sem `tenantId` ou filtros cruzando tenants; `warn` apenas loga.
- Hub requests (isHubRequest=true) não recebem injeção automática, mas guardas de rota ainda checam permissões.

## Seeds determinísticos
- Tenants: alpha, beta.
- Ferramentas instaladas por tenant: alpha (todas), beta (tasks/reports).
- Usuário logado determina o tenant pelo host; não há troca de tenant via payload.

## Frontend
- App Router único serve `/hub/*` e `/app/*` no mesmo projeto. Menu e RouteGuard usam `tenantContext` do `/auth/me`.
- A navegação filtra itens por `requiredPermissions` e `toolKey`. Quando a ferramenta não está instalada, mostra “Tool not installed” ou 404.

## Como testar rapidamente
1. `pnpm --filter @aza8/api-core prisma db push && pnpm --filter @aza8/api-core prisma db seed`.
2. Rodar API (`pnpm --filter @aza8/api-core dev`) e web (`pnpm --filter @aza8/web dev`).
3. Hosts: `hub.localhost` para hub; `alpha.localhost` / `beta.localhost` para portals.
