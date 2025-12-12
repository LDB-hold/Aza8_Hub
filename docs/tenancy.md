# Tenancy Model

## Host-based routing
- `hub.aza8.com.br` → hub mode, sem `tenantId`, `isHubRequest=true`.
- `{slug}.aza8.com.br` → tenant mode, resolve o `Tenant` pelo slug e preenche o contexto `{ tenantId, tenantSlug, isHubRequest=false }`.
- Em desenvolvimento, `localhost` atua como hub e `*.localhost` resolve para slugs de tenant.

## TenantContext flow
1. `TenancyMiddleware` resolve o host (incluindo `x-forwarded-host`), busca o tenant correspondente e registra o contexto na `TenantContextStore` antes dos controllers.
2. `TenantContextService` expõe o contexto da requisição para services/guards sem aceitar tenantId arbitrário.
3. `AuthGuard` filtra memberships para o tenant ativo (ou roles globais em modo hub) garantindo RBAC correto.
4. Services de domínio (ex.: `TenantsService`) leem sempre do `TenantContextService`, nunca de payloads externos.

## Modelos tenant-scoped
Os modelos abaixo sempre recebem/validam `tenantId` automaticamente pelo `PrismaService`:
- `TenantMembership`
- `TenantPlugin`
- `AuditLog`

Mantenha esta lista sincronizada com `apps/api-core/src/tenancy/tenant-scoped-models.ts`. Se novos modelos receberem `tenantId`, inclua-os em ambos os lugares.

## Enforcement modes
- Controlado por `TENANCY_ENFORCEMENT_MODE` (`warn` por padrão, `strict` quando pronto para bloqueio total).
- `warn`: o middleware registra avisos ao faltar contexto ou ao detectar `tenantId` cruzado, mas continua a execução.
- `strict`: as mesmas condições geram erro — sem contexto de tenant ou com `tenantId` divergente a operação é bloqueada.
- Payloads de escrita em modelos tenant-scoped precisam incluir `data`; ausências disparam erro para evitar gravações vazias.

## Componentes visíveis
- **Dashboard Hub** (`apps/hub-web/components/hub-dashboard.tsx`): mostra usuário atual, contexto (hub ou slug) e até cinco tenants via `/me` e `/tenants` usando `@aza8/auth-client`.
- **Dashboard Portal** (`apps/portal-web/components/portal-home.tsx`): resolve tenant atual (`/tenants/current`) e usuário (`/me`), exibindo slug/plano/status e roles no contexto isolado.

## Fluxo de desenvolvimento
- `start.sh` exige `.env` em `apps/api-core`, `apps/hub-web` e `apps/portal-web` (copiar dos `.env.example`).
- Instala dependências (pode ser pulado com `SKIP_INSTALL=1`), gera Prisma Client e aplica migrations (pulável via `SKIP_MIGRATIONS=1`).
- Sobe API/Hub/Portal em paralelo após preparar o ambiente.
