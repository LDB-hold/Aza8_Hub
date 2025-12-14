"use client";

import { useEffect, useMemo, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";

const railItems = [
  { key: "home", label: "Início", icon: "home" },
  { key: "tasks", label: "Tarefas", icon: "checklist" },
  { key: "files", label: "Arquivos", icon: "folder" },
  { key: "reports", label: "Relatórios", icon: "monitoring" },
  { key: "settings", label: "Config.", icon: "settings" }
];

type Palette = {
  page: string;
  text: string;
  rail: string;
  railStroke: string;
  body: string;
  surface: string;
  surfaceStroke: string;
  appBar: string;
  button: string;
  icon: string;
  searchInput: string;
  profileButton: string;
  profileIcon: string;
  searchIcon: string;
  searchChip: string;
  railActive: string;
  railInactive: string;
  railLabel: string;
  mutedText: string;
  labelTone: string;
  focus: string;
  motion: string;
};

export default function LayoutLabPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeItem, setActiveItem] = useState(railItems[0].key);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const palette = useMemo<Palette>(
    () =>
      isDarkMode
        ? {
            page: "bg-[#1C1B1F]",
            text: "text-[#E6E1E5]",
            rail: "bg-[#141218]",
            railStroke: "border-r border-[#36343B]",
            body: "bg-[#1C1B1F]",
            surface: "bg-[#1D1B20]/90",
            surfaceStroke: "border border-[#49454F]",
            appBar: "bg-[#1D1B20]/90 backdrop-blur border-b border-[#49454F]",
            button: "bg-[#2B2832] text-[#E6E1E5]",
            icon: "text-[#E6E1E5]",
            searchInput: "text-[#E6E1E5] placeholder:text-[#CAC4D0]",
            profileButton: "bg-[#2B2832] text-[#E6E1E5] ring-1 ring-[#49454F] hover:bg-[#332F3A]",
            profileIcon: "text-[#E6E1E5]",
            searchIcon: "text-[#E6E1E5]",
            searchChip: "bg-[#2B2832] ring-1 ring-[#49454F]",
            railActive: "bg-[#D0BCFF] text-[#381E72] shadow-[0_8px_16px_rgba(0,0,0,0.25)]",
            railInactive: "text-[#CAC4D0] hover:bg-white/5",
            railLabel: "text-[#CAC4D0]",
            mutedText: "text-[#CAC4D0]",
            labelTone: "text-[#CAC4D0]",
            focus: "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D0BCFF]",
            motion: "transition-all duration-200 ease-out"
          }
        : {
            page: "bg-[#FFFBFE]",
            text: "text-[#1C1B1F]",
            rail: "bg-[#F3EDF7]",
            railStroke: "border-r border-[#E8DEF8]",
            body: "bg-[#FEF7FF]",
            surface: "bg-white/90",
            surfaceStroke: "border border-[#E6E0E9]",
            appBar: "bg-[#FEF7FF]/95 backdrop-blur border-b border-[#E6E0E9]",
            button: "bg-white text-[#1C1B1F]",
            icon: "text-[#1C1B1F]",
            searchInput: "text-[#1C1B1F] placeholder:text-[#49454F]",
            profileButton: "bg-white text-[#1D1B20] ring-1 ring-[#E6E0E9] hover:bg-[#F4EFF4]",
            profileIcon: "text-[#1D1B20]",
            searchIcon: "text-[#1D1B20]",
            searchChip: "bg-white ring-1 ring-[#E6E0E9]",
            railActive: "bg-[#6750A4] text-white shadow-[0_8px_16px_rgba(103,80,164,0.35)]",
            railInactive: "text-[#49454F] hover:bg-[#EADDFF]",
            railLabel: "text-[#49454F]",
            mutedText: "text-[#49454F]",
            labelTone: "text-[#79767D]",
            focus: "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6750A4]",
            motion: "transition-all duration-200 ease-out"
          },
    [isDarkMode]
  );

  useEffect(() => {
    if (isSearchExpanded) {
      searchInputRef.current?.focus();
    }
  }, [isSearchExpanded]);

  const handleSearchBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsSearchExpanded(false);
    }
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      setIsSearchExpanded(false);
    }
  };

  return (
    <main className={`min-h-screen h-screen overflow-hidden ${palette.page} ${palette.text}`}>
      <div className="flex h-screen">
        <aside className={`relative sticky top-0 z-30 flex h-screen w-24 items-start justify-center ${palette.rail} ${palette.railStroke}`}>
          <NavigationRail
            isDarkMode={isDarkMode}
            activeItem={activeItem}
            onSelectItem={setActiveItem}
            onToggleTheme={() => setIsDarkMode((prev) => !prev)}
            palette={palette}
          />
        </aside>

        <div className="relative flex flex-1 flex-col overflow-hidden">
          <header className={`sticky top-0 z-20 ${palette.appBar}`}>
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${palette.profileButton} ${palette.focus} ${palette.motion}`}
                  aria-label="Voltar"
                >
                  <span className={`material-symbols-rounded text-base ${palette.profileIcon}`} aria-hidden>
                    arrow_back
                  </span>
                  <span>Voltar</span>
                </button>
                <div className="flex flex-col">
                  <span className={`text-xs font-semibold uppercase tracking-[0.08em] ${palette.labelTone}`}>Navigation · Body · App Bar</span>
                  <span className="text-2xl font-semibold leading-7">Layout Lab</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center rounded-full ${palette.searchChip} ${palette.motion}`}
                  role="search"
                  aria-label="Pesquisar"
                  aria-expanded={isSearchExpanded}
                  onBlur={handleSearchBlur}
                  onKeyDown={handleSearchKeyDown}
                >
                  <button
                    type="button"
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${palette.searchChip} ${palette.focus} ${palette.motion}`}
                    onClick={() => setIsSearchExpanded((prev) => !prev)}
                    aria-label={isSearchExpanded ? "Fechar busca" : "Abrir busca"}
                    aria-expanded={isSearchExpanded}
                    aria-controls="layout-lab-search-input"
                  >
                    <span className={`material-symbols-rounded text-lg ${palette.searchIcon}`} aria-hidden>
                      search
                    </span>
                  </button>
                  {isSearchExpanded ? (
                    <input
                      id="layout-lab-search-input"
                      ref={searchInputRef}
                      type="search"
                      placeholder="Pesquisar..."
                      className={`ml-1 mr-3 w-64 border-none bg-transparent text-sm outline-none ${palette.searchInput}`}
                    />
                  ) : null}
                </div>

                <button
                  type="button"
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${palette.profileButton} ${palette.focus} ${palette.motion}`}
                  aria-label="Abrir perfil"
                >
                  <span className={`material-symbols-rounded text-xl ${palette.profileIcon}`} aria-hidden>
                    account_circle
                  </span>
                </button>
              </div>
            </div>
          </header>

          <section className={`flex-1 overflow-y-auto px-6 pb-8 pt-6 ${palette.body}`} aria-label="Pré-visualização de corpo">
            <div className={`rounded-3xl p-6 ${palette.surface} ${palette.surfaceStroke} shadow-[0_10px_30px_rgba(28,27,31,0.12)]`}>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#6750A4]">Exemplo MD3</p>
                <h2 className="text-xl font-semibold leading-7">Estrutura Navigation · Body · App Bar</h2>
                <p className={`text-sm ${palette.mutedText}`}>
                  Esta página demonstra a hierarquia semântica recomendada pelo Material Design 3 com Navigation Rail, Top App Bar e área de conteúdo fluida.
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div className={`flex flex-col gap-3 rounded-2xl p-4 ${palette.surface} ${palette.surfaceStroke}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold uppercase tracking-[0.08em] ${palette.labelTone}`}>Navigation Rail</span>
                      <p className={`text-sm ${palette.mutedText}`}>Use ícones com labels visíveis e estado ativo tonal.</p>
                    </div>
                    <span className={`material-symbols-rounded text-xl ${palette.icon}`} aria-hidden>
                      route
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {railItems.slice(0, 3).map((item) => {
                      const isActive = item.key === activeItem;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setActiveItem(item.key)}
                          className={`flex h-10 flex-1 items-center justify-center rounded-full text-sm font-semibold ${palette.motion} ${palette.focus} ${
                            isActive ? palette.railActive : `${palette.surfaceStroke} ${palette.railInactive}`
                          }`}
                          aria-pressed={isActive}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={`flex flex-col gap-3 rounded-2xl p-4 ${palette.surface} ${palette.surfaceStroke}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold uppercase tracking-[0.08em] ${palette.labelTone}`}>App Bar</span>
                      <p className={`text-sm ${palette.mutedText}`}>Combine título, breadcrumbs e ações principais com foco visível.</p>
                    </div>
                    <span className={`material-symbols-rounded text-xl ${palette.icon}`} aria-hidden>
                      schedule
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-3 rounded-2xl p-3 ${
                      isDarkMode ? "border border-dashed border-[#49454F] bg-[#2B2832]" : "border border-dashed border-[#CAC4D0] bg-[#E6E0E9]/40"
                    }`}
                  >
                    <span className="text-sm font-semibold">Top App Bar (medium)</span>
                    <span className={`text-xs ${palette.mutedText}`}>Responsiva e sticky</span>
                  </div>
                </div>

                <div className={`flex flex-col gap-3 rounded-2xl p-4 ${palette.surface} ${palette.surfaceStroke}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold uppercase tracking-[0.08em] ${palette.labelTone}`}>Conteúdo</span>
                      <p className={`text-sm ${palette.mutedText}`}>Superfícies fluidas 100% viewport, com grid responsivo.</p>
                    </div>
                    <span className={`material-symbols-rounded text-xl ${palette.icon}`} aria-hidden>
                      view_quilt
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Surface", "Container", "Card", "Section"].map((chip) => (
                      <span
                        key={chip}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${palette.surfaceStroke} ${palette.motion}`}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`flex flex-col gap-3 rounded-2xl p-4 ${palette.surface} ${palette.surfaceStroke}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold uppercase tracking-[0.08em] ${palette.labelTone}`}>Estados</span>
                      <p className={`text-sm ${palette.mutedText}`}>Hover, focus, pressed devem ser visíveis em rail, chips e botões.</p>
                    </div>
                    <span className={`material-symbols-rounded text-xl ${palette.icon}`} aria-hidden>
                      visibility
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {["Hover", "Focus", "Pressed"].map((state) => (
                      <span
                        key={state}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${palette.surfaceStroke} ${palette.motion}`}
                      >
                        {state}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`flex flex-col gap-3 rounded-2xl p-4 ${palette.surface} ${palette.surfaceStroke}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold uppercase tracking-[0.08em] ${palette.labelTone}`}>Tipografia</span>
                      <p className={`text-sm ${palette.mutedText}`}>Headline, title e label curtos garantem hierarquia clara no App Bar.</p>
                    </div>
                    <span className={`material-symbols-rounded text-xl ${palette.icon}`} aria-hidden>
                      format_size
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">Headline / 24</span>
                    <span className={`text-sm ${palette.mutedText}`}>Title / 16 — Label / 12</span>
                  </div>
                </div>

                <div className={`flex flex-col gap-3 rounded-2xl p-4 ${palette.surface} ${palette.surfaceStroke}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold uppercase tracking-[0.08em] ${palette.labelTone}`}>Acessibilidade</span>
                      <p className={`text-sm ${palette.mutedText}`}>`aria-expanded`, `aria-current` e foco visível ativos no rail e na busca.</p>
                    </div>
                    <span className={`material-symbols-rounded text-xl ${palette.icon}`} aria-hidden>
                      accessibility_new
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["aria-expanded", "aria-current", "focus-visible"].map((chip) => (
                      <span
                        key={chip}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${palette.surfaceStroke} ${palette.motion}`}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`flex flex-col gap-3 rounded-2xl p-4 ${palette.surface} ${palette.surfaceStroke}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold uppercase tracking-[0.08em] ${palette.labelTone}`}>Motion</span>
                      <p className={`text-sm ${palette.mutedText}`}>Durations suaves (200ms) e easings padronizadas para hover/expansão.</p>
                    </div>
                    <span className={`material-symbols-rounded text-xl ${palette.icon}`} aria-hidden>
                      speed
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">Ease-out · 200ms</span>
                    <span className={`text-sm ${palette.mutedText}`}>Usar enter/exit consistentes entre rail, chips e cards.</span>
                  </div>
                </div>

                <div className={`flex flex-col gap-3 rounded-2xl p-4 ${palette.surface} ${palette.surfaceStroke}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold uppercase tracking-[0.08em] ${palette.labelTone}`}>Grid</span>
                      <p className={`text-sm ${palette.mutedText}`}>Largura 100% viewport com colunas fluidas e gutters consistentes.</p>
                    </div>
                    <span className={`material-symbols-rounded text-xl ${palette.icon}`} aria-hidden>
                      grid_view
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["4 cols", "8 cols", "12 cols"].map((chip) => (
                      <span
                        key={chip}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${palette.surfaceStroke} ${palette.motion}`}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`flex flex-col gap-3 rounded-2xl p-4 ${palette.surface} ${palette.surfaceStroke}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold uppercase tracking-[0.08em] ${palette.labelTone}`}>Tema</span>
                      <p className={`text-sm ${palette.mutedText}`}>Cores tonais + strokes garantem contraste em light/dark sem bordas pesadas.</p>
                    </div>
                    <span className={`material-symbols-rounded text-xl ${palette.icon}`} aria-hidden>
                      palette
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">Primary tonal · Surface container</span>
                    <span className={`text-sm ${palette.mutedText}`}>Aplicar tokens no rail ativo, chips e botões de ação.</span>
                  </div>
                </div>

                <div className={`flex flex-col gap-3 rounded-2xl p-4 ${palette.surface} ${palette.surfaceStroke}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold uppercase tracking-[0.08em] ${palette.labelTone}`}>Dialogs</span>
                      <p className={`text-sm ${palette.mutedText}`}>Camadas elevadas com backdrop e botões tonais para confirmações.</p>
                    </div>
                    <span className={`material-symbols-rounded text-xl ${palette.icon}`} aria-hidden>
                      chat
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">Modal · Elevation + blur</span>
                    <span className={`text-sm ${palette.mutedText}`}>Ações alinhadas à direita, foco inicial no botão primário.</span>
                  </div>
                </div>

                <div className={`flex flex-col gap-3 rounded-2xl p-4 ${palette.surface} ${palette.surfaceStroke}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold uppercase tracking-[0.08em] ${palette.labelTone}`}>Sheets</span>
                      <p className={`text-sm ${palette.mutedText}`}>Bottom sheets com drag handle e áreas de lista/tabs empilháveis.</p>
                    </div>
                    <span className={`material-symbols-rounded text-xl ${palette.icon}`} aria-hidden>
                      vertical_align_center
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">Standard · Modal</span>
                    <span className={`text-sm ${palette.mutedText}`}>Evitar sobreposição de rails; usar scrim para modal.</span>
                  </div>
                </div>

                <div className={`flex flex-col gap-3 rounded-2xl p-4 ${palette.surface} ${palette.surfaceStroke}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold uppercase tracking-[0.08em] ${palette.labelTone}`}>Elevation</span>
                      <p className={`text-sm ${palette.mutedText}`}>Sombras sutis para diferenciar App Bar, rail e cards.</p>
                    </div>
                    <span className={`material-symbols-rounded text-xl ${palette.icon}`} aria-hidden>
                      filter_b_and_w
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {["0dp", "1dp", "3dp"].map((chip) => (
                      <span
                        key={chip}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${palette.surfaceStroke} ${palette.motion}`}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`flex flex-col gap-3 rounded-2xl p-4 ${palette.surface} ${palette.surfaceStroke}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold uppercase tracking-[0.08em] ${palette.labelTone}`}>Density</span>
                      <p className={`text-sm ${palette.mutedText}`}>Alturas mínimas 48px para touch targets; rail 72px.</p>
                    </div>
                    <span className={`material-symbols-rounded text-xl ${palette.icon}`} aria-hidden>
                      line_weight
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["48px", "56px", "72px"].map((chip) => (
                      <span
                        key={chip}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${palette.surfaceStroke} ${palette.motion}`}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`flex flex-col gap-3 rounded-2xl p-4 ${palette.surface} ${palette.surfaceStroke}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold uppercase tracking-[0.08em] ${palette.labelTone}`}>Listas</span>
                      <p className={`text-sm ${palette.mutedText}`}>Dividers sutis e ícones à esquerda para hierarquia clara.</p>
                    </div>
                    <span className={`material-symbols-rounded text-xl ${palette.icon}`} aria-hidden>
                      format_list_bulleted
                    </span>
                  </div>
                  <div className="flex flex-col divide-y divide-[#E6E0E9]/70">
                    {["Item primário", "Item com legenda"].map((item) => (
                      <div key={item} className="flex items-center justify-between py-2">
                        <span className="text-sm font-semibold">{item}</span>
                        <span className={`material-symbols-rounded text-base ${palette.icon}`} aria-hidden>
                          chevron_right
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`flex flex-col gap-3 rounded-2xl p-4 ${palette.surface} ${palette.surfaceStroke}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold uppercase tracking-[0.08em] ${palette.labelTone}`}>Snackbar</span>
                      <p className={`text-sm ${palette.mutedText}`}>Feedback transitório com ação única alinhada à direita.</p>
                    </div>
                    <span className={`material-symbols-rounded text-xl ${palette.icon}`} aria-hidden>
                      notifications
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-dashed border-[#E6E0E9] px-3 py-2">
                    <span className="text-sm font-semibold">Salvo com sucesso</span>
                    <button
                      type="button"
                      className={`text-sm font-semibold ${palette.motion} ${palette.focus}`}
                      aria-label="Desfazer ação"
                    >
                      DESFAZER
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function NavigationRail({
  isDarkMode,
  onToggleTheme,
  palette,
  activeItem,
  onSelectItem
}: {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  palette: Palette;
  activeItem: string;
  onSelectItem: (key: string) => void;
}) {
  return (
    <nav className="flex h-full w-full flex-col items-center justify-between px-2 py-4" aria-label="Navigation Rail Preview">
      <div className="flex flex-col items-center gap-4">
        {railItems.map((item) => {
          const isActive = item.key === activeItem;
          return (
            <div key={item.key} className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => onSelectItem(item.key)}
                className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold ${palette.motion} ${palette.focus} ${
                  isActive ? palette.railActive : palette.railInactive
                }`}
                aria-pressed={isActive}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
              >
                <span className="material-symbols-rounded text-lg" aria-hidden>
                  {item.icon}
                </span>
              </button>
              <span className={`w-full text-center text-xs font-medium ${palette.railLabel}`}>{item.label}</span>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${palette.button} ${palette.focus} ${palette.motion}`}
        aria-pressed={isDarkMode}
        aria-label={isDarkMode ? "Desativar modo escuro" : "Ativar modo escuro"}
        onClick={onToggleTheme}
      >
        <span className={`material-symbols-rounded text-xl ${palette.icon}`} aria-hidden>
          {isDarkMode ? "light_mode" : "dark_mode"}
        </span>
      </button>
    </nav>
  );
}
