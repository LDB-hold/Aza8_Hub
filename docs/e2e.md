# Playwright E2E

## Cenários mínimos
1) **OWNER alpha**  
   - Login como `owner.alpha@client.com`.  
   - Vê todos os itens de menu, acessa billing, convida usuário, CRUD de tasks/files/requests e aprova/rejeita.
2) **MEMBER alpha**  
   - Não vê team/invitations/billing.  
   - `/app/settings/billing` → 403.  
   - Requests: pode criar, não pode aprovar.
3) **SUPPLIER alpha**  
   - Vê somente ferramentas permitidas (files/requests).  
   - `/app/tools/tasks` → 403.
4) **MEMBER beta**  
   - Menus: apenas tasks + reports (files/requests desabilitados).  
   - `/app/tools/files` → “Tool not installed” ou 404.
5) **Isolamento de tenants**  
   - Usuário de alpha não lê dados de beta (API responde 403/404).

## Infra de testes
- `apps/web/playwright.config.ts`: baseURL troca conforme host (`hub.localhost`, `alpha.localhost`, `beta.localhost`).
- Fixtures: helper `quickLogin(email)` que chama `POST /auth/login` e preserva cookie de sessão.
- Selectors: Navigation Rail usa `data-testid` `nav-*` (dashboard, tasks, files, requests, reports, settings-* etc), guardas expõem `route-guard-forbidden` e `route-guard-tool-missing`, e cada página raiz tem `*-page` para assert de carregamento estável.

## Como rodar
```bash
pnpm install
pnpm --filter @aza8/api-core prisma db push
pnpm --filter @aza8/api-core prisma db seed
pnpm --filter @aza8/api-core dev # porta 3001
pnpm --filter @aza8/web dev      # porta 3000
pnpm --filter @aza8/web test:e2e
```
