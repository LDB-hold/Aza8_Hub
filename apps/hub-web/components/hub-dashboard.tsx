'use client';

import Link from 'next/link';
import { Layout, Text, Button } from '@aza8/ui';
import { useCurrentUser, createCookieTokenProvider } from '@aza8/auth-client';

import { webConfig } from '../config/web-config';
import { useTenants } from '../lib/use-tenants';

const tokenProvider = createCookieTokenProvider();

export const HubDashboard = () => {
  const { data, loading, error } = useCurrentUser({
    baseUrl: webConfig.apiUrl,
    getToken: tokenProvider
  });
  const { tenants, loading: tenantsLoading } = useTenants();

  const totalTenants = tenants.length;
  const statusCounter = tenants.reduce(
    (acc, t) => {
      const key = t.status.toLowerCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const onboarding = statusCounter.onboarding ?? 0;
  const ativos = statusCounter.ativo ?? statusCounter.active ?? 0;
  const suspensos = statusCounter.suspenso ?? statusCounter.suspended ?? 0;
  const encerrados = statusCounter.encerrado ?? statusCounter.closed ?? statusCounter.ended ?? 0;

  const topTenants = tenants.slice(0, 5);

  return (
    <Layout title="Aza8 Hub" description="Visão operacional do hub e dos clientes">
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Tenants" value={totalTenants} helper="Total cadastrados" />
        <StatCard label="Ativos" value={ativos} helper="Em produção" />
        <StatCard label="Onboarding" value={onboarding} helper="Em implantação" />
        <StatCard label="Suspensos/Encerrados" value={suspensos + encerrados} helper="Atenção" tone="warning" />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Clientes recentes</h2>
              <Text tone="muted">Atalhos para revisão rápida</Text>
            </div>
            <Button asChild variant="secondary">
              <Link href="/tenants">Ver todos</Link>
            </Button>
          </div>
          {tenantsLoading && <Text tone="muted" className="mt-4">Carregando tenants…</Text>}
          {!tenantsLoading && topTenants.length === 0 && (
            <Text tone="muted" className="mt-4">Nenhum tenant disponível ou permissões insuficientes.</Text>
          )}
          {!tenantsLoading && topTenants.length > 0 && (
            <div className="mt-4 overflow-hidden rounded-lg border border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">Plano</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topTenants.map((tenant) => (
                    <tr key={tenant.id} className="border-t border-slate-800">
                      <td className="px-4 py-3 font-medium">{tenant.name}</td>
                      <td className="px-4 py-3 text-slate-400">{tenant.slug}</td>
                      <td className="px-4 py-3">{tenant.plan}</td>
                      <td className="px-4 py-3 capitalize">{tenant.status?.toLowerCase()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-xl font-semibold">Admin rápido</h2>
          <div className="space-y-3 text-sm text-slate-200">
            <QuickLink href="/tenants" label="Gestão de clientes" helper="Criar, editar, acompanhar status" />
            <QuickLink href="/tenants/new" label="Novo tenant" helper="Onboarding guiado" />
            <QuickLink href="/rbac" label="Papéis e permissões" helper="Revisar RBAC do hub" />
            <QuickLink href="/audit" label="Auditoria" helper="Eventos críticos e trilhas" />
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-xl font-semibold">Usuário atual</h2>
          {loading && <Text tone="muted">Carregando perfil…</Text>}
          {error && <Text tone="muted">Não foi possível carregar o perfil.</Text>}
          {data && (
            <div className="space-y-2 text-sm text-slate-200">
              <p className="font-semibold text-slate-50">{data.user.name}</p>
              <p className="text-slate-300">{data.user.email}</p>
              <p className="text-slate-300">Papel: {data.role ?? 'N/D'}</p>
              <p className="text-slate-400">
                Contexto: {data.tenantContext.isHubRequest ? 'Hub' : data.tenantContext.tenantSlug ?? 'N/D'}
              </p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold">Checklist operacional</h2>
          <Text tone="muted">Acesso rápido aos pilares do hub admin.</Text>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <ChecklistItem title="Identidade e acesso" helper="SSO, sessão, RBAC do hub" />
            <ChecklistItem title="Clientes e planos" helper="Status, plano, habilitação de ferramentas" />
            <ChecklistItem title="Ferramentas" helper="Catálogo e toggles por tenant" />
            <ChecklistItem title="Governança e auditoria" helper="Eventos críticos registrados" />
          </div>
        </div>
      </section>
    </Layout>
  );
};

const StatCard = ({ label, value, helper, tone = 'default' }: { label: string; value: number; helper?: string; tone?: 'default' | 'warning' }) => {
  const base = tone === 'warning' ? 'bg-amber-500/10 border-amber-500/50 text-amber-100' : 'bg-slate-900/60 border-slate-800';
  return (
    <div className={`rounded-xl border p-4 ${base}`}>
      <p className="text-sm text-slate-300">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
      {helper && <p className="text-xs text-slate-400">{helper}</p>}
    </div>
  );
};

const QuickLink = ({ href, label, helper }: { href: string; label: string; helper: string }) => (
  <Link href={href} className="block rounded-lg border border-slate-800 bg-slate-900/40 p-3 transition hover:border-slate-700 hover:bg-slate-900/70">
    <p className="font-semibold text-slate-50">{label}</p>
    <p className="text-xs text-slate-400">{helper}</p>
  </Link>
);

const ChecklistItem = ({ title, helper }: { title: string; helper: string }) => (
  <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
    <p className="font-semibold text-slate-100">{title}</p>
    <p className="text-xs text-slate-400">{helper}</p>
  </div>
);
