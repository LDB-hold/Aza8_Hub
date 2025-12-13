"use client";

import { useMemo, useState } from "react";

const railItems = [
  { key: "home", label: "Home", icon: "home" },
  { key: "tasks", label: "Tasks", icon: "checklist" },
  { key: "files", label: "Files", icon: "folder" },
  { key: "reports", label: "Reports", icon: "monitoring" },
  { key: "settings", label: "Settings", icon: "settings" }
];

type Palette = {
  page: string;
  text: string;
  rail: string;
  body: string;
  surface: string;
  surfaceStroke: string;
  button: string;
  icon: string;
  searchInput: string;
  profileButton: string;
  profileIcon: string;
  searchIcon: string;
  searchChip: string;
  railActive: string;
  railInactive: string;
  motion: string;
  railLabel: string;
};

export default function LayoutLabPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeItem, setActiveItem] = useState(railItems[0].key);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const palette = useMemo<Palette>(
    () =>
      isDarkMode
        ? {
            page: "bg-[#1D1B20]",
            text: "text-slate-100",
            rail: "bg-[#2B2A30]",
            body: "bg-[#1D1B20]",
            surface: "bg-[#2A262E]/80",
            surfaceStroke: "border border-white/5",
            button: "bg-[#3A3940] text-slate-100",
            icon: "text-slate-50",
            searchInput: "text-slate-100 placeholder:text-slate-400",
            profileButton: "bg-[#3A3940] text-slate-100 ring-1 ring-white/10",
            profileIcon: "text-slate-50",
            searchIcon: "text-slate-50",
            searchChip: "bg-[#333238]/95 ring-1 ring-white/10",
            railActive: "bg-[#4C4AF2] text-white",
            railInactive: "text-slate-300 hover:bg-white/15",
            motion: "transition-colors duration-150 ease-linear",
            railLabel: "text-slate-200"
          }
        : {
            page: "bg-[#F7F2FA]",
            text: "text-slate-900",
            rail: "bg-[#f4f4f4]",
            body: "bg-white",
            surface: "bg-white/70",
            surfaceStroke: "border border-slate-200/70",
            button: "bg-white text-slate-600",
            icon: "text-slate-600",
            searchInput: "text-slate-900 placeholder:text-slate-500",
            profileButton: "bg-white text-slate-700 ring-1 ring-slate-200/70",
            profileIcon: "text-slate-600",
            searchIcon: "text-slate-600",
            searchChip: "bg-white/90 ring-1 ring-slate-200/60",
            railActive: "bg-indigo-600 text-white",
            railInactive: "text-slate-600 hover:bg-slate-200",
            motion: "transition-colors duration-150 ease-linear",
            railLabel: "text-slate-500"
          },
    [isDarkMode]
  );

  return (
    <main className={`min-h-screen ${palette.page} ${palette.text}`}>
      <div className="flex min-h-screen">
        <div className={`relative sticky top-0 flex h-screen w-24 items-start justify-center ${palette.rail} z-30`}>
          <NavigationRail
            isDarkMode={isDarkMode}
            activeItem={activeItem}
            onSelectItem={setActiveItem}
            onToggleTheme={() => setIsDarkMode((prev) => !prev)}
            palette={palette}
          />
        </div>

        <section className={`relative flex-1 overflow-y-auto ${palette.body}`} aria-label="Body Preview">
          <div className="absolute left-6 top-6 flex items-center gap-3">
            <button
              type="button"
              className={`pointer-events-auto inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold backdrop-blur ${palette.motion} ${palette.profileButton}`}
            >
              <span className={`material-symbols-rounded text-base ${palette.profileIcon}`} aria-hidden>
                arrow_back
              </span>
              <span>Voltar</span>
            </button>
          </div>
          <div className="absolute right-6 top-6 flex items-center gap-3">
            <div
              className={`group pointer-events-auto flex items-center overflow-hidden rounded-full backdrop-blur ${palette.motion} ${palette.searchChip} ${
                isSearchExpanded ? "w-80 pl-4 pr-3 py-2" : "h-12 w-12 justify-center"
              } ${isSearchExpanded ? "opacity-100" : "opacity-90"}`}
              onMouseEnter={() => setIsSearchExpanded(true)}
              onMouseLeave={() => setIsSearchExpanded(false)}
              aria-expanded={isSearchExpanded}
            >
              <span className={`material-symbols-rounded text-lg ${palette.searchIcon} ${palette.motion}`} aria-hidden>
                search
              </span>
              {isSearchExpanded ? (
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className={`ml-3 flex-1 border-none bg-transparent px-2 py-0 text-sm outline-none placeholder:text-sm ${palette.motion} ${palette.searchInput}`}
                  autoFocus
                />
              ) : null}
            </div>
            <button
              type="button"
              className={`pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full ${palette.profileButton} transition hover:-translate-y-0.5`}
              aria-label="Abrir perfil"
            >
              <span className={`material-symbols-rounded text-xl ${palette.profileIcon}`} aria-hidden>
                account_circle
              </span>
            </button>
          </div>
        </section>

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
    <nav className="flex h-full w-full flex-col items-center justify-between px-1 py-4" aria-label="Navigation Rail Preview">
      <div className="flex flex-col items-center gap-4">
        {railItems.map((item) => {
          const isActive = item.key === activeItem;
          return (
            <div key={item.key} className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => onSelectItem(item.key)}
                className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold transition ${palette.motion} ${
                  isActive ? palette.railActive : palette.railInactive
                }`}
                aria-pressed={isActive}
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
        className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${palette.button} shadow-sm transition hover:-translate-y-0.5`}
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
