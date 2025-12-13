import Link from 'next/link';
import { requireSession } from '@lib/auth';
import { getTenantContextFromHeaders } from '@lib/tenant';

type ToolStatus = 'ga' | 'beta' | 'soon';

const tools: { name: string; description: string; status: ToolStatus; href: string }[] = [
  { name: 'Tasks', description: 'Quadros e listas compartilhadas', status: 'ga', href: '/tools/tasks' },
  { name: 'Files', description: 'Entregas e evidências centralizadas', status: 'beta', href: '/tools/files' },
  { name: 'Requests', description: 'Pedidos do cliente com SLA', status: 'ga', href: '/tools/requests' },
  { name: 'Reports', description: 'Indicadores e gráficos', status: 'soon', href: '/tools/reports' }
];

const recentActivity = [
  { title: 'Arquivo enviado: contrato-final.pdf', by: 'alex@acme.com', time: '2h atrás' },
  { title: 'Task “Kickoff” atualizada', by: 'maria@acme.com', time: '6h atrás' },
  { title: 'Request #214 aprovado', by: 'ops@aza8.com', time: '1 dia atrás' }
];

const navSections = [
  {
    title: 'Operações',
    items: [
      { href: '/dashboard', icon: 'dashboard', label: 'Dashboard', helper: 'Resumo SAP' },
      { href: '/tools/tasks', icon: 'checklist', label: 'Tasks', helper: 'Fluxos e listas' },
      { href: '/tools/files', icon: 'folder', label: 'Files', helper: 'Arquivos e evidências' },
      { href: '/tools/requests', icon: 'assignment', label: 'Requests', helper: 'Solicitações' },
      { href: '/tools/reports', icon: 'monitoring', label: 'Reports', helper: 'Indicadores' }
    ]
  },
  {
    title: 'Equipe e configurações',
    items: [
      { href: '/team/members', icon: 'groups', label: 'Team', helper: 'Membros e papéis' },
      { href: '/team/invitations', icon: 'person_add', label: 'Convites', helper: 'Convidar usuários' },
      { href: '/settings/profile', icon: 'badge', label: 'Perfil', helper: 'Preferências' },
      { href: '/settings/organization', icon: 'business', label: 'Organização', helper: 'Dados cadastrais' },
      { href: '/settings/billing', icon: 'receipt_long', label: 'Billing', helper: 'Plano e faturas' }
    ]
  }
];

const hubOnlyNav = [
  {
    title: 'Administração Hub',
    items: [
      { href: '/hub/tenants', icon: 'lan', label: 'Tenants', helper: 'Gestão multiempresa' },
      { href: '/hub/rbac', icon: 'admin_panel_settings', label: 'RBAC', helper: 'Papéis e permissões' },
      { href: '/hub/audit', icon: 'rule_settings', label: 'Audit', helper: 'Trilha de eventos' }
    ]
  }
];

const highlightMetrics = [
  { label: 'Workspaces monitorados', value: '72', helper: '+8% vs semana anterior', icon: 'hub' },
  { label: 'Requests em SLA', value: '94%', helper: 'Meta > 90%', icon: 'schedule' },
  { label: 'Arquivos enviados no mês', value: '318', helper: '+27 em relação a mar/25', icon: 'drive_folder_upload' }
];

export default async function DashboardPage() {
  const session = await requireSession('/dashboard');
  const tenant = getTenantContextFromHeaders();
  const sections = tenant.isHub ? [...navSections, ...hubOnlyNav] : navSections;

  return (
    <div className={`min-h-screen bg-[#FDFCFB] px-4 py-8 text-slate-900 transition-colors`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row">
        <SAPMenu tenantKey={tenant.tenantKey} isHub={tenant.isHub} sections={sections} />
        <main className="flex-1 space-y-8">
          <header className="rounded-[32px] border border-slate-200/70 bg-white/95 p-6 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.35)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">SAP Overview</p>
                <h1 className="mt-2 text-3xl font-semibold">Bem-vindo, {session.user.name}</h1>
                <p className="text-sm text-slate-500">
                  Tenant <span className="font-semibold">{tenant.tenantKey}</span> · Contexto {tenant.isHub ? 'Hub' : 'Portal'}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-right text-sm">
                <p className="text-xs text-slate-500">Sessão</p>
                <p className="font-semibold text-slate-900">{session.user.email}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {highlightMetrics.map((metric) => (
                <article
                  key={metric.label}
                  className="rounded-[28px] border border-slate-200/80 bg-slate-50/70 px-4 py-3 text-sm text-slate-600"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                    <span className="material-symbols-rounded text-base text-sky-600" aria-hidden="true">
                      {metric.icon}
                    </span>
                    {metric.label}
                  </div>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{metric.value}</p>
                  <p className="text-xs text-slate-500">{metric.helper}</p>
                </article>
              ))}
            </div>
          </header>

          <section className="space-y-4 rounded-[32px] border border-slate-200/70 bg-white/95 p-6 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.25)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Ferramentas SAP</p>
                <h2 className="text-2xl font-semibold text-slate-900">Tool installs & status</h2>
              </div>
              <Link
                href={tenant.isHub ? '/hub/tenants' : '/tools/requests'}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-700"
              >
                Ver catálogo
                <span className="material-symbols-rounded text-base" aria-hidden="true">
                  trending_flat
                </span>
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {tools.map((tool) => (
                <ToolStatusCard key={tool.name} tool={tool} />
              ))}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <article className="rounded-[32px] border border-slate-200/70 bg-white/95 p-6 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.25)] lg:col-span-2">
              <header className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Atualizações recentes</p>
                  <h3 className="text-xl font-semibold">Activity feed</h3>
                </div>
                <span className="text-xs text-slate-500">Sync automático · últimos 24h</span>
              </header>
              <div className="mt-4 divide-y divide-slate-100">
                {recentActivity.map((item) => (
                  <div key={item.title} className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.by}</p>
                    </div>
                    <span className="text-xs text-slate-400">{item.time}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[32px] border border-slate-200/70 bg-white/95 p-6 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.25)]">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Sessão ativa</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">Contexto atual</h3>
              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">Email</dt>
                  <dd className="font-semibold text-slate-900">{session.user.email}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">Tenant</dt>
                  <dd className="font-semibold text-slate-900">{tenant.tenantKey}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">Área</dt>
                  <dd className="font-semibold text-slate-900">{tenant.isHub ? 'Hub' : 'Portal'}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">Último login</dt>
                  <dd className="font-semibold text-slate-900">há 12h</dd>
                </div>
              </dl>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}

function SAPMenu({
  tenantKey,
  isHub,
  sections
}: {
  tenantKey: string;
  isHub: boolean;
  sections: { title: string; items: MenuItemProps[] }[];
}) {
  return (
    <aside className="w-full md:w-64">
      <div className="rounded-[32px] border border-slate-200/70 bg-white/95 p-6 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.25)]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <span className="text-base font-semibold">SAP</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-500">Menu</p>
            <p className="text-lg font-semibold text-slate-900">SAP Hub</p>
            <p className="text-xs text-slate-500">Tenant {tenantKey}</p>
          </div>
        </div>
        <div className="mt-6 space-y-6">
          {sections.map((section) => (
            <nav key={section.title} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{section.title}</p>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <MenuItem key={item.href} {...item} active={item.href === '/dashboard'} />
                ))}
              </div>
            </nav>
          ))}
        </div>
        {isHub ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
            <p className="font-semibold">Modo Hub</p>
            <p>Você está gerenciando múltiplos tenants.</p>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
            <p className="font-semibold">Modo Portal</p>
            <p>As ferramentas exibidas refletem as instalações do tenant.</p>
          </div>
        )}
      </div>
    </aside>
  );
}

type MenuItemProps = {
  href: string;
  icon: string;
  label: string;
  helper: string;
  active?: boolean;
};

function MenuItem({ href, icon, label, helper, active }: MenuItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-2xl border px-3 py-2 text-sm transition ${
        active
          ? 'border-slate-900 bg-slate-900 text-white'
          : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <span className={`material-symbols-rounded text-base ${active ? 'text-white' : 'text-slate-500'}`} aria-hidden="true">
        {icon}
      </span>
      <div className="flex flex-col leading-tight">
        <span className="font-semibold">{label}</span>
        <span className="text-[0.7rem]">{helper}</span>
      </div>
    </Link>
  );
}

function ToolStatusCard({ tool }: { tool: { name: string; description: string; status: ToolStatus; href: string } }) {
  const statusChip = {
    ga: { label: 'Disponível', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    beta: { label: 'Beta', color: 'bg-amber-50 text-amber-700 border-amber-100' },
    soon: { label: 'Em breve', color: 'bg-slate-100 text-slate-600 border-slate-200' }
  }[tool.status];

  return (
    <article className="rounded-[28px] border border-slate-200/80 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{tool.name}</h3>
          <p className="text-sm text-slate-500">{tool.description}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusChip.color}`}>{statusChip.label}</span>
      </div>
      <Link href={tool.href} className="mt-4 inline-flex items-center text-sm font-semibold text-sky-700">
        Abrir ferramenta
        <span className="material-symbols-rounded text-base" aria-hidden="true">
          north_east
        </span>
      </Link>
    </article>
  );
}
