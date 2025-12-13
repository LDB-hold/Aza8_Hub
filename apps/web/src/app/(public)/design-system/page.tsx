const palette = [
  { name: 'Primary', token: 'md.sys.color.primary', hex: '#6750A4', role: 'Ações principais e realces de navegação.' },
  { name: 'Secondary', token: 'md.sys.color.secondary', hex: '#625B71', role: 'Elementos complementares e superfícies elevadas.' },
  { name: 'Tonal Surface', token: 'md.sys.color.surface-container', hex: '#F3EDF7', role: 'Cards tonais, estados repouso.' },
  { name: 'Neutral', token: 'md.sys.color.neutral-variant', hex: '#49454F', role: 'Texto médio e ícones.' },
  { name: 'Error', token: 'md.sys.color.error', hex: '#B3261E', role: 'Feedback destrutivo e mensagens de erro.' }
];

const typography = [
  { name: 'Display Large', token: 'md.sys.typescale.display.large', sample: 'Material Design 3', className: 'text-4xl font-semibold tracking-tight' },
  { name: 'Title Medium', token: 'md.sys.typescale.title.medium', sample: 'Hub & Portal', className: 'text-lg font-semibold' },
  { name: 'Body Large', token: 'md.sys.typescale.body.large', sample: 'Copy e descrições.', className: 'text-base text-slate-700' },
  { name: 'Label Medium', token: 'md.sys.typescale.label.medium', sample: 'Estados, chips, botões.', className: 'text-sm font-semibold uppercase tracking-[0.14em] text-slate-600' }
];

const components = [
  'Botões (filled, tonal, outlined, text) com ícones `material-symbols-rounded` e estados hover/focus/pressed.',
  'TextFields filled com label flutuante, helper e estados de erro.',
  'Cards tonais/outlined com divisores para listas e painéis de dados.',
  'Navigation (Top App Bar + Drawer/Rail) diferenciando Hub administrativo vs Portal operacional.',
  'Dialog/Sheet/Snackbar para feedbacks curtos e fluxos de confirmação.'
];

const navigation = [
  {
    title: 'Hub (`/hub/*`)',
    desc: 'Menus administrativos; requer TenantContext propagado e guardas de RBAC.',
    items: ['Dashboard administrativo', 'Tenants', 'RBAC', 'Audit'],
    badge: 'Admin'
  },
  {
    title: 'Portal (`/app/*`)',
    desc: 'Menus operacionais por tenant; rail lateral com ferramentas instaladas.',
    items: ['Dashboard', 'Tasks/Files/Requests/Reports', 'Team', 'Settings', 'Audit'],
    badge: 'Operacional'
  }
];

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FDFCFB] via-white to-[#EEF2FF] text-slate-900">
      <section className="relative isolate overflow-hidden px-6 pb-16 pt-20 sm:px-10">
        <div className="absolute inset-0 -z-10 opacity-60" aria-hidden="true">
          <div className="absolute left-1/2 top-10 h-56 w-56 -translate-x-1/2 rounded-full bg-sky-200/50 blur-3xl" />
          <div className="absolute right-10 top-24 h-40 w-40 rounded-full bg-indigo-200/60 blur-3xl" />
        </div>
        <div className="mx-auto max-w-5xl space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 shadow-sm ring-1 ring-sky-100">
            <span className="material-symbols-rounded text-base" aria-hidden>palette</span>
            Material Design 3
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">Design System unificado</h1>
          <p className="max-w-3xl text-lg text-slate-600">
            Página pública de referência para tokens, componentes e navegação do Hub/Portal. Baseada em {''}
            <a className="font-semibold text-sky-700" href="https://m3.material.io/styles" target="_blank" rel="noreferrer">
              Material Design 3
            </a>{' '}
            e {''}
            <a className="font-semibold text-sky-700" href="https://m3.material.io/components" target="_blank" rel="noreferrer">
              Components
            </a>.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 ring-1 ring-slate-200">
              <span className="material-symbols-rounded text-base text-emerald-500" aria-hidden>verified</span>
              Tenancy estrita
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 ring-1 ring-slate-200">
              <span className="material-symbols-rounded text-base text-indigo-500" aria-hidden>shield</span>
              RBAC revisado
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 ring-1 ring-slate-200">
              <span className="material-symbols-rounded text-base text-amber-500" aria-hidden>auto_awesome</span>
              Estados MD3
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl space-y-8 px-6 pb-16 sm:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Tokens</p>
                <h2 className="text-xl font-semibold text-slate-900">Cores</h2>
              </div>
              <span className="material-symbols-rounded text-slate-500" aria-hidden>color_lens</span>
            </header>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {palette.map((tone) => (
                <div key={tone.token} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">{tone.name}</p>
                    <span className="text-xs font-mono text-slate-500">{tone.token}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/80 p-3 ring-1 ring-slate-100">
                    <div className="h-10 w-10 rounded-xl" style={{ backgroundColor: tone.hex }} aria-hidden />
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{tone.hex}</p>
                      <p className="text-xs text-slate-500">{tone.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Tokens</p>
                <h2 className="text-xl font-semibold text-slate-900">Tipografia</h2>
              </div>
              <span className="material-symbols-rounded text-slate-500" aria-hidden>text_fields</span>
            </header>
            <div className="mt-4 space-y-3">
              {typography.map((type) => (
                <div key={type.token} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">{type.name}</p>
                    <span className="text-xs font-mono text-slate-500">{type.token}</span>
                  </div>
                  <p className={`${type.className} mt-2`}>{type.sample}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <article className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_70px_-46px_rgba(15,23,42,0.38)]">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Componentes</p>
              <h2 className="text-xl font-semibold text-slate-900">Base MD3</h2>
            </div>
            <span className="material-symbols-rounded text-slate-500" aria-hidden>view_agenda</span>
          </header>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {components.map((item) => (
              <li key={item} className="flex items-start gap-2 rounded-2xl bg-slate-50/70 px-4 py-3 ring-1 ring-slate-100">
                <span className="material-symbols-rounded text-base text-sky-600" aria-hidden>check_circle</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_70px_-46px_rgba(15,23,42,0.38)]">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Navegação</p>
              <h2 className="text-xl font-semibold text-slate-900">Hub vs Portal</h2>
            </div>
            <span className="material-symbols-rounded text-slate-500" aria-hidden>alt_route</span>
          </header>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {navigation.map((nav) => (
              <div key={nav.title} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 ring-1 ring-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{nav.badge}</p>
                    <h3 className="text-lg font-semibold text-slate-900">{nav.title}</h3>
                  </div>
                  <span className="material-symbols-rounded text-base text-indigo-500" aria-hidden>route</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{nav.desc}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                  {nav.items.map((item) => (
                    <span key={item} className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-amber-600">Exibir "Tool not installed" quando `toolKey` não estiver em `ToolInstall`.</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
