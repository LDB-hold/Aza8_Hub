# Guia de Desenvolvimento

## Variáveis de ambiente
- Copie `apps/api-core/.env.example` para `apps/api-core/.env`.
- A URL do banco já aponta para a instância remota do Supabase e deve permanecer como:
  ```
  postgresql://postgres:DqHG7CWKTg7nItMM@db.qcibldbkaezayxldrtuc.supabase.co:5432/postgres?sslmode=require
  ```
- O app web unificado (`apps/web`) usa `.env.example` como base (`NEXT_PUBLIC_API_URL`, `AUTH_MODE`, `COOKIE_DOMAIN` etc).
- Ignore `apps/hub-web` e `apps/portal-web` (frontends antigos).

## Execução do monorepo
1. Garanta que você está autenticado no Supabase (instância remota, sem Docker local).
2. Instale dependências e gere Prisma Client:
   ```
   pnpm install
   pnpm prisma:generate
   ```
3. Aplique schema/seed no Postgres remoto:
   ```
   pnpm --filter @aza8/api-core prisma db push
   pnpm --filter @aza8/api-core prisma db seed
   ```
4. Suba API e Web:
   ```
   pnpm --filter @aza8/api-core dev   # porta 3001
   pnpm --filter @aza8/web dev        # porta 3000
   ```
5. Hosts locais (ajuste /etc/hosts):
   ```
   127.0.0.1 hub.localhost
   127.0.0.1 alpha.localhost
   127.0.0.1 beta.localhost
   ```
   - Hub: http://hub.localhost:3000
   - Portal alpha: http://alpha.localhost:3000
   - Portal beta: http://beta.localhost:3000

Se não quiser rodar migrations, use `SKIP_MIGRATIONS=1 ./start.sh` (opcional).

> Importante: não suba container Postgres local – use a instância remota indicada.

## Arquivos locais ignorados
- `config.toml`: configurações do Codex/MCP com credenciais sensíveis. Fica apenas no ambiente local e já está no `.gitignore`.
- `.Temp-logs/`: logs gerados pelo `start.sh` com saída completa dos serviços. São rotacionados automaticamente e não devem ser versionados.

## Tenancy: monitorar e endurecer
- Ambiente API: use `TENANCY_ENFORCEMENT_MODE=strict` em `apps/api-core/.env` (padrão já configurado).
- Fluxo recomendado:
  1. Observe os logs do `TenancyMiddleware` para detectar rotas que ainda não aplicam o contexto de tenant.
  2. Corrija os pontos sinalizados até não haver warnings.
  3. Mantenha `strict` para bloquear requisições sem contexto de tenant válido.
