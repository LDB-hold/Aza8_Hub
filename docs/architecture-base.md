# Aza8 Hub – Architecture Base

## Overview
- **Core API (`apps/api-core`)** – NestJS com resolução de tenancy, RBAC, auditoria, Prisma/PostgreSQL, guards compartilhados e camada de ferramentas (tool installs).
- **Web unificado (`apps/web`)** – Next.js App Router servindo Hub (`/hub/*`) e Portal (rotas raiz: `/dashboard`, `/tools/*`, `/team/*`, `/settings/*`, `/audit`), resolvendo o tenant pelo host (`hub.localhost`, `{slug}.localhost`) e consumindo a API com sessões em cookie.
- **Packages (`packages/*`)** – UI kit, tipos de domínio, cliente de auth, utilitários de configuração, presets de lint/tsconfig. Consumidos via path aliases pelos apps.

Veja `docs/platform-overview.md` para o snapshot funcional atual e `docs/development.md` para rodar localmente e aplicar migrations.

## Tenancy model
1. Requests chegam com host `hub.aza8.com.br` ou `{slug}.aza8.com.br` (local: `hub.localhost`, `{slug}.localhost`).
2. `TenancyMiddleware` inspeciona o host e resolve o contexto (`hub` => `isHubRequest=true`; `{slug}` => carrega tenant).
3. A request-scoped `TenantContextService` stores `{ tenantId, tenantSlug, isHubRequest }` for downstream services.
4. Services (Tenants, Plugins, etc.) always pull the tenantId from this context rather than accepting free-form IDs, guaranteeing isolation.

Para mais detalhes de host-based routing, `TenantContext` e padrões de DB, veja `docs/tenancy.md`.

## RBAC
- Login emite sessão (cookie) e `AuthGuard` carrega `userContext` com membership/role do tenant atual ou role de hub.
- `PermissionsGuard` aplica `@RequirePermissions(...)` lendo `userContext.permissions`.
- Mapeamentos completos de roles/permissões estão em `docs/rbac.md`.

## Frontend (apps/web)
- App Router único (`/hub/*` e portal sem prefixo `/app`, usando `/dashboard`, `/tools/*`, `/team/*`, `/settings/*`, `/audit`) com menu/RouteGuard filtrando permissões e ferramentas instaladas.
- Tenancy derivado do host; headers `x-tenant-slug`/`x-is-hub` circulam entre middleware e API.
- UI usa `packages/ui`; auth client compartilha hooks para `/auth/me`, etc.

## Revisão v0.1.1 – 2025-12-15
- Autor: Codex (AI)
- Escopo: corrigir paths do portal (sem `/app`) e manter alinhamento com roteamento real.
- Impacto: documentação reflete navegação atual; reduz risco de 404 em QA.
- Fontes MCP: não utilizado.
