import { apiBaseUrl } from './config';
import { parseTenantFromHost } from './tenant';

const jsonHeaders = { 'Content-Type': 'application/json' };

const resolveTenantSlug = () => {
  if (typeof window === 'undefined') return 'hub';
  const { tenantKey } = parseTenantFromHost(window.location.host);
  return tenantKey;
};

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
};

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const tenantSlug = resolveTenantSlug();
  const res = await fetch(`${apiBaseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      ...jsonHeaders,
      'x-tenant-slug': tenantSlug
    },
    credentials: 'include',
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed (${res.status})`);
  }

  return (await res.json()) as T;
}
