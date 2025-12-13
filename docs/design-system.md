# Design System – Material Design 3
- Referências principais: [Styles – Material Design 3](https://m3.material.io/styles) e [Components – Material Design 3](https://m3.material.io/components).
- Hub (`/hub/*`) e Portal (`/app/*`) seguem o mesmo tema; variações só quando o design system permitir diferença por contexto.
- Toda a plataforma deve respeitar 100% da largura disponível da viewport, espelhando o comportamento fluido recomendado em [Responsive layout grid – MD3](https://m3.material.io/foundations/layout/applying-layout/overview).
- Ícones sempre em `material-symbols-rounded` com estados hover/focus/pressed visíveis.

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
