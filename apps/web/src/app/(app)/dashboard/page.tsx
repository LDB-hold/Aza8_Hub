import Link from 'next/link';
import { requireSession } from '@lib/auth';
import { getTenantContextFromHeaders } from '@lib/tenant';
import { ToolCard, type Tool } from '@components/ToolCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';

const tools: Tool[] = [
  { name: 'Tasks', description: 'Collaborate on task lists and workflows', status: 'ga' },
  { name: 'Files', description: 'Secure file exchange with your team', status: 'beta' },
  { name: 'Requests', description: 'Track inbound client requests', status: 'ga' },
  { name: 'Reports', description: 'Generate operational insights', status: 'soon' }
];

const recentActivity = [
  { title: 'New file uploaded', by: 'alex@acme.com', time: '2h ago' },
  { title: 'Task status changed', by: 'maria@acme.com', time: '6h ago' },
  { title: 'Request approved', by: 'ops@aza8.com', time: '1d ago' }
];

export default async function DashboardPage() {
  const session = await requireSession('/dashboard');
  const tenant = getTenantContextFromHeaders();

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <p className="text-sm text-slate-500">Welcome back, {session.user.name}</p>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-600">Tenant: {tenant.tenantKey} ({tenant.isHub ? 'Hub' : 'Portal'})</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.name} tool={tool} />
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Navegação rápida</CardTitle>
          <CardDescription>Acesse as principais áreas do portal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <NavLink href="/dashboard" label="Dashboard" helper="Resumo e ferramentas" />
            <NavLink href="/tools/tasks" label="Tasks" helper="Listas e status" />
            <NavLink href="/tools/files" label="Files" helper="Uploads e versões" />
            <NavLink href="/tools/requests" label="Requests" helper="Solicitações e aprovações" />
            <NavLink href="/tools/reports" label="Reports" helper="Indicadores operacionais" />
            <NavLink href="/team/members" label="Team" helper="Membros e papéis" />
            <NavLink href="/team/invitations" label="Convites" helper="Convidar usuários" />
            <NavLink href="/settings/profile" label="Perfil" helper="Dados pessoais e sessão" />
            <NavLink href="/settings/organization" label="Organização" helper="Dados do cliente" />
            <NavLink href="/settings/billing" label="Billing" helper="Plano e faturamento" />
            <NavLink href="/audit" label="Audit" helper="Eventos registrados" />
          </div>
        </CardContent>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Updates from your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100">
              {recentActivity.map((item) => (
                <div key={item.title} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.by}</p>
                  </div>
                  <span className="text-xs text-slate-400">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session</CardTitle>
            <CardDescription>Authentication summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            <div className="flex justify-between"><span>Email</span><span className="font-medium">{session.user.email}</span></div>
            <div className="flex justify-between"><span>Tenant</span><span className="font-medium">{tenant.tenantKey}</span></div>
            <div className="flex justify-between"><span>Area</span><span className="font-medium">{tenant.isHub ? 'Hub' : 'Portal'}</span></div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function NavLink({ href, label, helper }: { href: string; label: string; helper: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col rounded-lg border border-slate-200 px-4 py-3 text-sm transition hover:border-slate-300 hover:shadow-sm"
    >
      <span className="font-semibold text-slate-900">{label}</span>
      <span className="text-xs text-slate-500">{helper}</span>
    </Link>
  );
}
