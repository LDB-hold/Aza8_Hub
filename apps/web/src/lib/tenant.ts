export type TenantContext = {
  tenantKey: string;
  isHub: boolean;
};

const HUB_PREFIX = 'hub.';
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', 'hub.localhost']);

const stripPort = (value?: string | null) => (value ? value.split(':')[0] : 'localhost');

export function parseTenantFromHost(host?: string | null): TenantContext {
  const normalized = stripPort(host);
  const isHubHost = normalized.startsWith(HUB_PREFIX) || LOCAL_HOSTS.has(normalized);
  const tenantKey = isHubHost ? 'hub' : normalized.split('.')[0] || 'hub';
  return { tenantKey, isHub: tenantKey === 'hub' };
}

export function getTenantContextFromHeaders(h?: Headers): TenantContext {
  const hdrs = h ?? getRuntimeHeaders();
  const tenantKeyHeader = hdrs?.get('x-tenant-slug') || hdrs?.get('x-tenant-key');
  const isHubHeader = hdrs?.get('x-is-hub');
  if (tenantKeyHeader) {
    return { tenantKey: tenantKeyHeader, isHub: isHubHeader === 'true' || tenantKeyHeader === 'hub' };
  }
  const host = hdrs?.get('host') ?? (typeof window !== 'undefined' ? window.location.host : undefined);
  return parseTenantFromHost(host);
}

export const buildTenantHeaders = (tenant: TenantContext): HeadersInit => {
  const headers = new Headers();
  headers.set('x-tenant-slug', tenant.tenantKey);
  headers.set('x-tenant-key', tenant.tenantKey);
  headers.set('x-is-hub', tenant.isHub ? 'true' : 'false');
  return headers;
};

function getRuntimeHeaders(): Headers | null {
  if (typeof window !== 'undefined') return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { headers } = require('next/headers') as { headers: () => Headers };
    return headers();
  } catch {
    return null;
  }
}
