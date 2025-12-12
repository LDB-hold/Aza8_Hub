# Canvas de referência rápida

- **Modelos com enforcement de locatário** — `apps/api-core/src/tenancy/tenant-scoped-models.ts` (Linhas 1-8): lista os modelos que recebem `tenantId` automaticamente pelo PrismaService; há um TODO para sincronizar essa lista com a documentação.
- **Middleware de tenancy (host → contexto)** — `apps/api-core/src/tenancy/tenancy.middleware.ts` (Linhas 1-30): resolve o host (incluindo `x-forwarded-host`), obtém o `TenantContext` e o propaga via `TenantContextStore` para que serviços/guards usem o contexto correto.
- **Enforcement no PrismaService** — `apps/api-core/src/database/prisma.service.ts` (Linhas 1-233): injeta/mantém `tenantId` em consultas/gravações de modelos “tenant-scoped”; em modo `strict` bloqueia operações sem contexto, com `tenantId` ausente ou cruzado, e valida payloads de escrita (lança erro se `data` estiver vazio).
- **Dashboard Hub (modo operador)** — `apps/hub-web/components/hub-dashboard.tsx` (Linhas 1-58): página inicial mostra usuário atual, contexto (hub ou slug) e até cinco tenants consumindo `/me` e `/tenants` via `@aza8/auth-client`.
- **Dashboard Portal (modo tenant)** — `apps/portal-web/components/portal-home.tsx` (Linhas 1-52): resolve tenant atual (`/tenants/current`) e usuário (`/me`), exibindo slug/plan/status e roles no contexto isolado.
- **Fluxo de desenvolvimento** — `start.sh` (Linhas 7-104): script espera `.env` em `apps/api-core`, `apps/hub-web` e `apps/portal-web`, instala dependências, gera Prisma Client, aplica migrations e sobe API/Hub/Portal em paralelo (pode pular install/migrations via `SKIP_INSTALL`/`SKIP_MIGRATIONS`).
- **Modelo de tenancy documentado** — `docs/tenancy.md` (Linhas 1-23): descreve roteamento por host, fluxo do `TenantContext` e modos de enforcement (`warn` vs `strict`).
- **Observação sobre gaps documentados** — `docs/revisao-prisma-service.md` (Linhas 1-13): lista riscos que já estão endereçados no código (enforcement estrito ao faltar contexto, preservação de payload em `applyTenantIdToData`, tipagem do middleware), sugerindo revisar/atualizar o documento.

## Pendências imediatas
- Validar e completar a lista `TENANT_SCOPED_MODELS` para cobrir todos os modelos dependentes de tenant.
- Atualizar ou remover `docs/revisao-prisma-service.md` se estiver divergente do código.
- Criar templates `.env.example` para `apps/api-core`, `apps/hub-web` e `apps/portal-web` para facilitar onboarding.
