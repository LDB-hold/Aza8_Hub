# Playwright E2E

## Cenários mínimos
1) **OWNER alpha**  
   - Login como `owner.alpha@client.com`.  
   - Vê todos os itens de menu, acessa billing, convida usuário, CRUD de tasks/files/requests e aprova/rejeita.
2) **MEMBER alpha**  
   - Não vê team/invitations/billing.  
   - `/settings/billing` → 403.  
   - Requests: pode criar, não pode aprovar.
3) **SUPPLIER alpha**  
   - Vê somente ferramentas permitidas (files/requests).  
   - `/tools/tasks` → 403.
4) **MEMBER beta**  
   - Menus: apenas tasks + reports (files/requests desabilitados).  
   - `/tools/files` → “Tool not installed” ou 404.
5) **Isolamento de tenants**  
   - Usuário de alpha não lê dados de beta (API responde 403/404).

## Infra de testes
- Playwright ainda não está configurado no repo (não existe `apps/web/playwright.config.ts`).  
- Fixture recomendada: `quickLogin(email)` chamando `POST /api/auth/mock-login` (web) que aciona `/auth/login` na API core e grava cookie de sessão.
- Hosts para navegação: `hub.localhost` (Hub), `alpha.localhost` e `beta.localhost` (Portal).
- Selectors disponíveis: Navigation Rail usa `data-testid` `nav-*` (dashboard, tasks, files, requests, reports, settings-* etc); páginas raiz expõem `*-page` para asserts.

## Como rodar
```bash
pnpm install
pnpm --filter @aza8/api-core prisma db push
pnpm --filter @aza8/api-core prisma db seed
pnpm --filter @aza8/api-core dev # porta 3001
pnpm --filter @aza8/web dev      # porta 3000
pnpm --filter @aza8/web test:e2e
```

## Revisão v0.1.1 – 2025-12-15
- Autor: Codex (AI)
- Escopo: alinhar paths reais (sem prefixo `/app`), login mock via `/api/auth/mock-login` e ausência de config Playwright no repo.
- Impacto: evita cenários apontarem para rotas inexistentes; define como estruturar fixture de login; destaca pendência de setup e2e.
- Fontes MCP: não utilizado.
