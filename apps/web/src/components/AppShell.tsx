/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { TenantBadge } from './TenantBadge';
import { LogoutButton } from './LogoutButton';
import type { Session } from '../lib/auth';
import type { TenantContext } from '../lib/tenant';
import { Avatar } from './ui/avatar';
import {
  buildNavigation,
  ALL_NAV_ITEMS,
  evaluateRouteAccess,
  findActiveNavItem,
  flattenNavItems,
  getInstalledTools,
  type NavItem
} from '../lib/navigation';
import { cn } from '../lib/utils';

type Palette = {
  page: string;
  text: string;
  rail: string;
  railStroke: string;
  surface: string;
  surfaceStroke: string;
  appBar: string;
  icon: string;
  searchChip: string;
  searchInput: string;
  button: string;
  railActive: string;
  railInactive: string;
  railLabel: string;
  mutedText: string;
  focus: string;
  motion: string;
  body: string;
};

export function AppShell({ children, session, tenant }: { children: ReactNode; session: Session; tenant: TenantContext }) {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const palette = useMemo<Palette>(
    () =>
      isDarkMode
        ? {
            page: 'bg-[#1C1B1F]',
            text: 'text-[#E6E1E5]',
            rail: 'bg-[#141218]',
            railStroke: 'border-[#36343B]',
            body: 'bg-[#1C1B1F]',
            surface: 'bg-[#1D1B20]/90',
            surfaceStroke: 'border-[#49454F]',
            appBar: 'bg-[#1D1B20]/90 backdrop-blur border-b border-[#49454F]',
            icon: 'text-[#E6E1E5]',
            searchChip: 'bg-[#2B2832] ring-1 ring-[#49454F]',
            searchInput: 'text-[#E6E1E5] placeholder:text-[#CAC4D0]',
            button: 'bg-[#2B2832] text-[#E6E1E5]',
            railActive: 'bg-[#D0BCFF] text-[#381E72] shadow-[0_8px_16px_rgba(0,0,0,0.25)]',
            railInactive: 'text-[#CAC4D0] hover:bg-white/5',
            railLabel: 'text-[#CAC4D0]',
            mutedText: 'text-[#CAC4D0]',
            focus: 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D0BCFF]',
            motion: 'transition-all duration-200 ease-out'
          }
        : {
            page: 'bg-[#FFFBFE]',
            text: 'text-[#1C1B1F]',
            rail: 'bg-[#F3EDF7]',
            railStroke: 'border-[#E8DEF8]',
            body: 'bg-[#FEF7FF]',
            surface: 'bg-white/90',
            surfaceStroke: 'border-[#E6E0E9]',
            appBar: 'bg-[#FEF7FF]/95 backdrop-blur border-b border-[#E6E0E9]',
            icon: 'text-[#1C1B1F]',
            searchChip: 'bg-white ring-1 ring-[#E6E0E9]',
            searchInput: 'text-[#1C1B1F] placeholder:text-[#49454F]',
            button: 'bg-white text-[#1C1B1F]',
            railActive: 'bg-[#6750A4] text-white shadow-[0_8px_16px_rgba(103,80,164,0.35)]',
            railInactive: 'text-[#49454F] hover:bg-[#EADDFF]',
            railLabel: 'text-[#49454F]',
            mutedText: 'text-[#49454F]',
            focus: 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6750A4]',
            motion: 'transition-all duration-200 ease-out'
          },
    [isDarkMode]
  );

  const installedTools = useMemo(() => getInstalledTools(tenant), [tenant]);
  const navSections = useMemo(() => buildNavigation({ session, tenant, installedTools }), [session, tenant, installedTools]);
  const flatNavItems = useMemo(() => flattenNavItems(navSections), [navSections]);
  const blueprintActiveItem = useMemo<NavItem | null>(() => findActiveNavItem(pathname, ALL_NAV_ITEMS), [pathname]);
  const navActiveItem = useMemo<NavItem | null>(() => findActiveNavItem(pathname, flatNavItems), [pathname, flatNavItems]);
  const displayItem = navActiveItem ?? blueprintActiveItem;
  const guardState = useMemo(
    () => evaluateRouteAccess(pathname, { session, tenant, installedTools, activeItem: blueprintActiveItem }),
    [blueprintActiveItem, installedTools, pathname, session, tenant]
  );

  useEffect(() => {
    if (isSearchExpanded) {
      searchInputRef.current?.focus();
    }
  }, [isSearchExpanded]);

  return (
    <div className={`flex min-h-screen ${palette.page} ${palette.text}`} data-testid="app-shell">
      <aside
        className={`sticky top-0 z-30 flex h-screen w-24 flex-col items-center border-r ${palette.railStroke} ${palette.rail}`}
        data-testid="navigation-rail"
      >
        <div className="flex w-full flex-1 flex-col items-center gap-4 overflow-y-auto px-3 py-5">
          {navSections.map((section) => (
            <div key={section.title} className="flex w-full flex-col items-center gap-2">
              {section.items.map((item) => (
                <RailItem
                  key={item.key}
                  item={item}
                  active={navActiveItem?.href === item.href}
                  palette={palette}
                  data-testid={item.testId}
                />
              ))}
              <div className="h-px w-12 rounded-full bg-white/20" aria-hidden />
            </div>
          ))}
        </div>

        <div className="w-full px-3 pb-4">
          <button
            type="button"
            onClick={() => setIsDarkMode((prev) => !prev)}
            className={cn(
              'flex h-12 w-full items-center justify-center rounded-full border text-sm font-semibold',
              palette.button,
              palette.surfaceStroke,
              palette.focus,
              palette.motion
            )}
            data-testid="theme-toggle"
            aria-pressed={isDarkMode}
            aria-label={isDarkMode ? 'Desativar modo escuro' : 'Ativar modo escuro'}
          >
            <span className={`material-symbols-rounded text-xl ${palette.icon}`} aria-hidden>
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
        <header className={`sticky top-0 z-20 ${palette.appBar}`} data-testid="app-bar">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <Link href={tenant.isHub ? '/hub/dashboard' : '/dashboard'} className="inline-flex items-center gap-2 text-lg font-semibold">
                <span className={`material-symbols-rounded text-xl ${palette.icon}`} aria-hidden>
                  apps
                </span>
                Aza8 Hub
              </Link>
              <TenantBadge tenantKey={tenant.tenantKey} isHub={tenant.isHub} />
            </div>

            <div className="flex items-center gap-3">
              <SearchChip
                isExpanded={isSearchExpanded}
                onToggle={() => setIsSearchExpanded((prev) => !prev)}
                palette={palette}
                searchInputRef={searchInputRef}
              />
              <div className="hidden sm:flex flex-col items-end text-xs leading-tight">
                <span className="font-semibold">{session.user.name}</span>
                <span className={palette.mutedText}>{session.user.email}</span>
              </div>
              <Avatar name={session.user.name} className="shadow-sm" />
              <LogoutButton className="hidden sm:inline-flex" />
            </div>
          </div>
        </header>

        <main className={`flex-1 overflow-y-auto px-6 pb-10 pt-6 ${palette.body}`} data-testid="page-body">
          <div className={`rounded-3xl border ${palette.surfaceStroke} ${palette.surface} p-6 shadow-[0_24px_64px_-48px_rgba(28,27,31,0.45)]`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-[0.12em] ${palette.mutedText}`}>
                  {tenant.isHub ? 'Hub · Navigation · App Bar' : 'Portal · Navigation · App Bar'}
                </p>
                <h1 className="text-2xl font-semibold leading-7">{displayItem?.label ?? 'Área autenticada'}</h1>
                <p className={`text-sm ${palette.mutedText}`}>{displayItem?.description ?? 'Selecione uma ferramenta ou página no rail.'}</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {displayItem?.toolKey ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#E6E0E9] px-3 py-1 font-semibold">
                    <span className="material-symbols-rounded text-sm" aria-hidden>
                      extension
                    </span>
                    {displayItem.toolKey}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#E6E0E9] px-3 py-1 font-semibold">
                  <span className="material-symbols-rounded text-sm" aria-hidden>
                    shield_lock
                  </span>
                  RBAC ativo
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 min-h-[60vh]">
            {guardState.state === 'forbidden' ? (
              <GuardMessage
                title="Acesso restrito"
                description={
                  guardState.reason === 'host'
                    ? 'A rota não está disponível neste host. Acesse pelo domínio correto.'
                    : 'Você não possui as permissões necessárias para esta página.'
                }
                icon="block"
                dataTestId="route-guard-forbidden"
              />
            ) : guardState.state === 'tool-missing' ? (
              <GuardMessage
                title="Tool not installed"
                description="Esta ferramenta não está habilitada para o tenant atual."
                icon="report_problem"
                dataTestId="route-guard-tool-missing"
              />
            ) : (
              <div className="rounded-3xl border border-dashed border-[#E6E0E9] bg-white/70 p-1 sm:p-2 md:p-3">
                <div className="rounded-[28px] border border-[#E6E0E9] bg-white/90 p-4 shadow-[0_18px_48px_-34px_rgba(28,27,31,0.35)]">
                  {children}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function RailItem({ item, active, palette }: { item: NavItem; active: boolean; palette: Palette }) {
  return (
    <Link
      href={item.href}
      className={cn(
        'flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold',
        palette.motion,
        palette.focus,
        active ? palette.railActive : cn('border', palette.surfaceStroke, palette.railInactive)
      )}
      aria-current={active ? 'page' : undefined}
      aria-label={item.label}
      data-testid={item.testId}
    >
      <span className="material-symbols-rounded text-lg" aria-hidden>
        {item.icon}
      </span>
      <span className="sr-only">{item.label}</span>
    </Link>
  );
}

function SearchChip({
  isExpanded,
  onToggle,
  palette,
  searchInputRef
}: {
  isExpanded: boolean;
  onToggle: () => void;
  palette: Palette;
  searchInputRef: React.RefObject<HTMLInputElement>;
}) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div
      className={cn('flex items-center rounded-full', palette.searchChip, palette.motion, isFocused ? palette.focus : '')}
      role="search"
      aria-label="Pesquisar"
      aria-expanded={isExpanded}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <button
        type="button"
        className={`flex h-12 w-12 items-center justify-center rounded-full ${palette.searchChip} ${palette.focus} ${palette.motion}`}
        onClick={onToggle}
        aria-label={isExpanded ? 'Fechar busca' : 'Abrir busca'}
        aria-expanded={isExpanded}
        aria-controls="global-search-input"
      >
        <span className={`material-symbols-rounded text-lg ${palette.icon}`} aria-hidden>
          search
        </span>
      </button>
      {isExpanded ? (
        <input
          id="global-search-input"
          ref={searchInputRef}
          type="search"
          placeholder="Pesquisar no Hub ou Portal..."
          className={`ml-1 mr-3 w-64 border-none bg-transparent text-sm outline-none ${palette.searchInput}`}
          data-testid="app-bar-search"
        />
      ) : null}
    </div>
  );
}

function GuardMessage({
  title,
  description,
  icon,
  dataTestId
}: {
  title: string;
  description: string;
  icon: string;
  dataTestId: string;
}) {
  return (
    <div
      className="flex flex-col items-start gap-3 rounded-[28px] border border-dashed border-[#E6E0E9] bg-white/80 p-6 text-sm text-[#49454F]"
      data-testid={dataTestId}
    >
      <div className="flex items-center gap-2">
        <span className="material-symbols-rounded text-xl text-[#6750A4]" aria-hidden>
          {icon}
        </span>
        <h2 className="text-lg font-semibold text-[#1C1B1F]">{title}</h2>
      </div>
      <p className="max-w-3xl text-sm">{description}</p>
    </div>
  );
}
