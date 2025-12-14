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

const highlightMetrics = [
  { label: 'Workspaces monitorados', value: '72', helper: '+8% vs semana anterior', icon: 'hub' },
  { label: 'Requests em SLA', value: '94%', helper: 'Meta > 90%', icon: 'schedule' },
  { label: 'Arquivos enviados no mês', value: '318', helper: '+27 em relação a mar/25', icon: 'drive_folder_upload' }
];

export default async function DashboardPage() {
  const session = await requireSession('/dashboard');
  const tenant = getTenantContextFromHeaders();

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      <header className="space-y-2 rounded-[28px] border border-[#E6E0E9] bg-white/90 p-5 shadow-[0_18px_48px_-34px_rgba(28,27,31,0.35)]">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6750A4]">
          {tenant.isHub ? 'Hub overview' : 'Portal overview'}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold leading-7">Bem-vindo, {session.user.name}</h1>
            <p className="text-sm text-[#49454F]">
              Tenant <span className="font-semibold text-[#1C1B1F]">{tenant.tenantKey}</span> · Contexto{' '}
              {tenant.isHub ? 'Hub' : 'Portal'}
            </p>
          </div>
          <div className="rounded-2xl border border-dashed border-[#E6E0E9] bg-white/70 px-4 py-3 text-right text-sm">
            <p className="text-xs text-[#49454F]">Sessão</p>
            <p className="font-semibold text-[#1C1B1F]">{session.user.email}</p>
          </div>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-3" data-testid="dashboard-metrics">
        {highlightMetrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-[24px] border border-[#E6E0E9] bg-white/80 p-4 shadow-[0_16px_44px_-34px_rgba(28,27,31,0.3)]"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6750A4]">
              <span className="material-symbols-rounded text-base" aria-hidden="true">
                {metric.icon}
              </span>
              {metric.label}
            </div>
            <p className="mt-2 text-3xl font-semibold text-[#1C1B1F]">{metric.value}</p>
            <p className="text-xs text-[#49454F]">{metric.helper}</p>
          </article>
        ))}
      </section>

      <section
        className="rounded-[28px] border border-[#E6E0E9] bg-white/90 p-5 shadow-[0_18px_48px_-34px_rgba(28,27,31,0.35)]"
        data-testid="dashboard-tools"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#49454F]">Ferramentas</p>
            <h2 className="text-lg font-semibold text-[#1C1B1F]">Instalações e status</h2>
          </div>
          <Link
            href={tenant.isHub ? '/hub/tenants' : '/tools/requests'}
            className="inline-flex items-center gap-2 rounded-full border border-[#E6E0E9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1C1B1F]"
            data-testid="dashboard-tools-cta"
          >
            Ver catálogo
            <span className="material-symbols-rounded text-base" aria-hidden="true">
              trending_flat
            </span>
          </Link>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {tools.map((tool) => (
            <ToolStatusCard key={tool.name} tool={tool} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3" data-testid="dashboard-activity">
        <article className="rounded-[28px] border border-[#E6E0E9] bg-white/90 p-5 shadow-[0_18px_48px_-34px_rgba(28,27,31,0.35)] lg:col-span-2">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#49454F]">Atualizações</p>
              <h3 className="text-lg font-semibold text-[#1C1B1F]">Activity feed</h3>
            </div>
            <span className="text-xs text-[#49454F]">Sync automático · últimas 24h</span>
          </header>
          <div className="mt-4 divide-y divide-[#E6E0E9]">
            {recentActivity.map((item) => (
              <div key={item.title} className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-semibold text-[#1C1B1F]">{item.title}</p>
                  <p className="text-xs text-[#49454F]">{item.by}</p>
                </div>
                <span className="text-xs text-[#49454F]">{item.time}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-[#E6E0E9] bg-white/90 p-5 shadow-[0_18px_48px_-34px_rgba(28,27,31,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#49454F]">Sessão ativa</p>
          <h3 className="mt-2 text-lg font-semibold text-[#1C1B1F]">Contexto atual</h3>
          <dl className="mt-6 space-y-4 text-sm text-[#1C1B1F]">
            <div className="flex items-center justify-between">
              <dt className="text-[#49454F]">Email</dt>
              <dd className="font-semibold">{session.user.email}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[#49454F]">Tenant</dt>
              <dd className="font-semibold">{tenant.tenantKey}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[#49454F]">Área</dt>
              <dd className="font-semibold">{tenant.isHub ? 'Hub' : 'Portal'}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[#49454F]">Último login</dt>
              <dd className="font-semibold">há 12h</dd>
            </div>
          </dl>
        </article>
      </section>
    </div>
  );
}

function ToolStatusCard({ tool }: { tool: { name: string; description: string; status: ToolStatus; href: string } }) {
  const statusChip = {
    ga: { label: 'Disponível', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    beta: { label: 'Beta', color: 'bg-amber-50 text-amber-700 border-amber-100' },
    soon: { label: 'Em breve', color: 'bg-slate-100 text-slate-600 border-slate-200' }
  }[tool.status];

  return (
    <article className="rounded-[24px] border border-[#E6E0E9] bg-white/80 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[#1C1B1F]">{tool.name}</h3>
          <p className="text-sm text-[#49454F]">{tool.description}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusChip.color}`}>{statusChip.label}</span>
      </div>
      <Link href={tool.href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#6750A4]" data-testid={`tool-link-${tool.name.toLowerCase()}`}>
        Abrir ferramenta
        <span className="material-symbols-rounded text-base" aria-hidden="true">
          trending_flat
        </span>
      </Link>
    </article>
  );
}
