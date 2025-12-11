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

  return (
    <Layout title="Aza8 Hub" description="Operational overview for multi-tenant management">
      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-xl font-semibold">Current user</h2>
        {loading && <Text tone="muted">Loading profile…</Text>}
        {error && <Text tone="muted">Unable to load profile</Text>}
        {data && (
          <div className="space-y-2">
            <Text>{data.user.name}</Text>
            <Text tone="muted">{data.user.email}</Text>
            <Text tone="muted">
              Context: {data.tenantContext.isHubRequest ? 'Hub' : data.tenantContext.tenantSlug ?? 'N/A'}
            </Text>
          </div>
        )}
      </section>

      <section className="mt-8 space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tenants</h2>
          <Button asChild variant="secondary">
            <Link href="/tenants">View all</Link>
          </Button>
        </div>
        {tenantsLoading && <Text tone="muted">Checking tenants…</Text>}
        {!tenantsLoading && tenants.length === 0 && (
          <Text tone="muted">No tenants available or insufficient permissions.</Text>
        )}
        <ul className="space-y-3">
          {tenants.slice(0, 5).map((tenant) => (
            <li key={tenant.id} className="rounded-lg border border-slate-800 p-4">
              <p className="font-medium">{tenant.name}</p>
              <Text tone="muted">Plan: {tenant.plan}</Text>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
};
