'use client';

import { Layout, Text } from '@aza8/ui';
import { createCookieTokenProvider, useCurrentUser } from '@aza8/auth-client';

import { webConfig } from '../config/web-config';
import { useCurrentTenant } from '../lib/use-tenant';

const tokenProvider = createCookieTokenProvider();

export const PortalHome = () => {
  const { data: userData, loading: userLoading, error: userError } = useCurrentUser({
    baseUrl: webConfig.apiUrl,
    getToken: tokenProvider
  });
  const { data: tenantData, loading: tenantLoading } = useCurrentTenant();

  return (
    <Layout
      title={tenantData?.tenant?.name ?? 'Tenant workspace'}
      description="Isolated execution context enforced by the core API"
    >
      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-xl font-semibold">Tenant context</h2>
        {tenantLoading && <Text tone="muted">Resolving tenant…</Text>}
        {tenantData?.tenant && (
          <div className="text-sm text-slate-300">
            <p>Slug: {tenantData.tenant.slug}</p>
            <p>Plan: {tenantData.tenant.plan}</p>
            <p>Status: {tenantData.tenant.status}</p>
          </div>
        )}
        {!tenantLoading && !tenantData?.tenant && (
          <Text tone="muted">No tenant resolved for this host</Text>
        )}
      </section>

      <section className="mt-8 space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-xl font-semibold">Current user</h2>
        {userLoading && <Text tone="muted">Loading user…</Text>}
        {userError && <Text tone="muted">Unable to fetch user.</Text>}
        {userData && (
          <div className="text-sm text-slate-300">
            <p>{userData.user.name}</p>
            <p>{userData.user.email}</p>
            <p>Roles: {userData.roles.join(', ') || 'none'}</p>
          </div>
        )}
      </section>
    </Layout>
  );
};
