'use client';

import { Layout, Text } from '@aza8/ui';

import { useTenants } from '../lib/use-tenants';

export const TenantsTable = () => {
  const { tenants, loading, error, refresh } = useTenants();

  return (
    <Layout
      title="Tenants"
      description="Hub-only listing guarded by RBAC and tenancy context"
    >
      {loading && <Text tone="muted">Loading tenant catalog…</Text>}
      {error && (
        <Text tone="muted">
          Failed to load tenants. <button onClick={() => refresh()}>Retry</button>
        </Text>
      )}
      {!loading && tenants.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/70 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="border-t border-slate-800">
                  <td className="px-4 py-3">{tenant.name}</td>
                  <td className="px-4 py-3 text-slate-400">{tenant.slug}</td>
                  <td className="px-4 py-3">{tenant.plan}</td>
                  <td className="px-4 py-3 capitalize">{tenant.status.toLowerCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && tenants.length === 0 && !error && (
        <Text tone="muted">No tenants to display.</Text>
      )}
    </Layout>
  );
};
