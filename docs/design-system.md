# Design System – Material Design 3
- Referências principais: [Styles – Material Design 3](https://m3.material.io/styles) e [Components – Material Design 3](https://m3.material.io/components).
- Hub (`/hub/*`) e Portal (`/app/*`) seguem o mesmo tema; variações só quando o design system permitir diferença por contexto.
- Toda a plataforma deve respeitar 100% da largura disponível da viewport, espelhando o comportamento fluido recomendado em [Responsive layout grid – MD3](https://m3.material.io/foundations/layout/applying-layout/overview).
- Ícones sempre em `material-symbols-rounded` com estados hover/focus/pressed visíveis.
- Navigation–Body–App Bar aplicado globalmente: Navigation Rail tonal + Top App Bar (medium) sticky com busca/ação de perfil, seguindo [Navigation Rail](https://m3.material.io/components/navigation-rail/overview) e [Top App Bar](https://m3.material.io/components/top-app-bar/overview).

## Página pública `/design-system`
- Exibe tokens iniciais (cores primária/secundária, surface container tonal, neutral-variant e error) com hex e papel semântico.
- Mapeia tipografia MD3 (display, title, body, label) aplicada ao Hub/Portal.
- Lista componentes base obrigatórios (Buttons, FAB, TextField, Cards, Navigation, Dialog/Sheet/Snackbar) e reforça estados MD3.
- Destaca Navegação Hub vs Portal (Top App Bar + Navigation rail) e lembra o fallback “Tool not installed” quando `toolKey` não estiver em `ToolInstall`.
- Serve como referência rápida para squads durante a migração total para MD3.

## Material Design 3 – Tela de Login
- Card único centrado com bordas `rounded-[32px]`, blur suave e sombra elevada inspirado em [Cards – Material Design 3](https://m3.material.io/components/cards/overview).
- Text fields filled com label flutuante e helper conforme [Text fields – Material Design 3](https://m3.material.io/components/text-fields/overview).
- Botão principal segue padrão filled tonal/button do [Buttons – Material Design 3](https://m3.material.io/components/buttons/overview) com `rounded-[28px]` e ícone `trending_flat`.
- Botões flutuantes (dark mode + idioma) usam o mesmo chip `rounded-full`, ícones `material-symbols-rounded` e iteram entre `dark_mode`/`light_mode` para indicar o estado global fora do card principal.
- Fundo global usa `md.ref.palette.neutral98` (`#FDFCFB`) no light mode e `md.ref.palette.neutral20` (`#303034`) no dark mode, alinhando com as Surface colors da especificação.

## Dashboard SAP (MD3)
- Navigation rail lateral usa tokens de [Navigation Rail – Material Design 3](https://m3.material.io/components/navigation-rail/overview) com `rounded-[32px]`, ícones `material-symbols-rounded` e indicadores filled para o item ativo.
- Cards de métricas e ferramentas seguem [Cards – Material Design 3](https://m3.material.io/components/cards/overview) com estados tonal (surface containers) e chips de status.
- Activity feed e sessão ativa usam divisões `divide-y` e tipografia `label`/`body` conforme tabela tipográfica MD3 para garantir hierarquia visual clara.

## Dashboard do Hub (MD3)
- Blocos de métricas usam cards tonal e chips de status conforme [Cards – MD3](https://m3.material.io/components/cards/overview) e [Assist chips – MD3](https://m3.material.io/components/chips/assist-chips) para atalhos rápidos.
- Alertas operacionais seguem padrão de banners/inline alerts inspirados em [Banner – MD3](https://m3.material.io/components/banners/overview) com ações primária/secundária (“Ver audit”, “Ver tenants afetados”).
- Estados vazios aplicam guidance de [Empty states – MD3](https://m3.material.io/foundations/content-design/empty-states) com mensagem clara e ação “Recarregar”.
- Mensagens 403/404/500 mantêm estrutura de [Dialogs/Snackbar – MD3](https://m3.material.io/components/dialogs/overview) para feedback de bloqueio ou erro de carregamento.

## Tenants (lista, criação/edição, detalhe)
- Filtros e ações rápidas usam [Filter chips – MD3](https://m3.material.io/components/chips/overview) e [Assist chips – MD3](https://m3.material.io/components/chips/assist-chips) para pausar/retomar/arquivar.
- Listagem segue grade responsiva com cartões ou tabelas densas inspiradas em [Lists – MD3](https://m3.material.io/components/lists/overview) com ícones `material-symbols-rounded` e chips de status.
- Formulários de criação/edição aplicam [Text fields – MD3](https://m3.material.io/components/text-fields/overview), [Segmented buttons – MD3](https://m3.material.io/components/segmented-buttons/overview) para plano/estado e [Dialogs – MD3](https://m3.material.io/components/dialogs/overview) para confirmações (ex.: arquivar).
- Estados vazios/erro seguem [Empty states – MD3](https://m3.material.io/foundations/content-design/empty-states); toasts de feedback usam [Snackbars – MD3](https://m3.material.io/components/snackbar/overview).

## Página pública `/layout-lab` (teste Navigation–Body–App Bar)
- Estrutura espelha arquitetura Navigation–Body–App Bar com `Navigation Rail` + `Top App Bar (medium)` sticky, referência direta a [Navigation Rail – MD3](https://m3.material.io/components/navigation-rail/overview) e [Top App Bar – MD3](https://m3.material.io/components/top-app-bar/overview).
- Tokens aplicados (light/dark): background `#FFFBFE` / `#1C1B1F`, surface container `#F3EDF7` / `#141218`, active rail `#6750A4` (light) e `#D0BCFF` (dark), strokes `#E6E0E9` / `#49454F`, texto de apoio `#49454F` / `#CAC4D0`.
- Busca acessível: chip com toggle via click/teclado, `aria-expanded`, foco visível (`outline` tonal) e input `type="search"` com placeholder MD3.
- App Bar exibe breadcrumbs curtos, título (headline), ações de perfil e mantém sombra suave para diferenciar do body mantendo 100% da viewport conforme [Responsive layout grid – MD3](https://m3.material.io/foundations/layout/applying-layout/overview).

## Atualização v0.1.0 – 2025-12-14
- Autor: Codex (AI)
- Escopo: Top App Bar autenticado – botão de perfil copiado do `/layout-lab` abrindo menu vertical.
- Impacto: Menu de perfil segue [Menus + Divider – MD3](/websites/m3_material_io) com surface tonal, foco visível, nome/e-mail e ação de logout; comportamento restrito ao usuário logado, sem impacto em RBAC ou tenancy.
