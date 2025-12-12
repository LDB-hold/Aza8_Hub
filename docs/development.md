# Guia de Desenvolvimento

## Variáveis de ambiente
- Copie `apps/api-core/.env.example` para `apps/api-core/.env`.
- A URL do banco já aponta para a instância remota do Supabase e deve permanecer como:
  ```
  postgresql://postgres:DqHG7CWKTg7nItMM@db.qcibldbkaezayxldrtuc.supabase.co:5432/postgres?sslmode=require
  ```
- Os apps web podem continuar usando seus `.env` locais, mas não precisam de Postgres próprio.
- Os apps `apps/hub-web` e `apps/portal-web` precisam de arquivos `.env` locais antes de rodar o `start.sh`.
  - O script valida a existência de `apps/hub-web/.env` e `apps/portal-web/.env` logo no início.
  - Não há arquivos `.env.example` nesses diretórios, então crie os `.env` manualmente conforme as variáveis necessárias.

## Execução do monorepo
1. Garanta que você está autenticado no Supabase (a instância já está exposta no host acima, sem necessidade de Docker local).
2. Rode `./start.sh`. O script vai instalar dependências, gerar o Prisma Client e aplicar as migrations diretamente no banco remoto.
3. Se não quiser rodar migrations (por exemplo, em ambientes compartilhados), execute `SKIP_MIGRATIONS=1 ./start.sh`.

> Importante: não suba nenhum container Postgres local – todo o fluxo de desenvolvimento usa a instância remota indicada.
