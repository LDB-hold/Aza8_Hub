import { headers as nextHeaders } from 'next/headers';

export type TenantContext = {
  tenantKey: string;
  isHub: boolean;
};

const HUB_PREFIX = 'hub.';
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);

export function parseTenantFromHost(host?: string | null): TenantContext {
  const safeHost = host ?? 'localhost';
  const isHubHost = safeHost.startsWith(HUB_PREFIX) || LOCAL_HOSTS.has(safeHost);
  const tenantKey = isHubHost ? 'hub' : safeHost.split('.')[0] ?? 'hub';
  return { tenantKey, isHub: tenantKey === 'hub' };
}

export function getTenantContextFromHeaders(h?: Headers): TenantContext {
  const hdrs = h ?? nextHeaders();
  const tenantKey = hdrs.get('x-tenant-key');
  const isHub = hdrs.get('x-is-hub');
  if (tenantKey) {
    return { tenantKey, isHub: isHub === 'true' };
  }
  return parseTenantFromHost(hdrs.get('host'));
}
