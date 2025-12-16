# Progress – Backend Aza8 Hub

## v0.1.0 – 2025-12-15
- Autor: Codex (AI)
- Escopo: Próximos passos para fechar backend conforme docs/rotas atuais.

### Pendências prioritárias
1) Audit seguro: filtros por tenant/ator/ação/período; portal audit com where por tenant; export CSV/JSON; logar enforcement strict.
2) Tenants Hub: endpoints detalhe/update/lifecycle com validação de slug única/regex, plano/região/limites/billing; histórico/alertas.
3) RBAC Hub: CRUD de papéis e atribuição de papéis de hub; retorno coerente com docs/rbac.
4) Invites/Settings Portal: aceitar invite com expiração + tenant do contexto + sessão; endpoints mínimos de profile/org/billing.
5) Tools Hub/Portal: validar host/isHub em toggle de tool; relatórios/contagens filtradas por tenant.
6) Auth/segurança: cookie com expiração/secure em prod; revisitar fluxo de logout na API; manter TENANCY_ENFORCEMENT_MODE=strict observável.
7) Testes: integração para guards/tenancy e seeds; preparar base Playwright ou testes de API cobrindo perms-chave.
