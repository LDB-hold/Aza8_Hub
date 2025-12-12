const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3005';

const resolveHostHeader = () => {
  if (typeof window === 'undefined') return 'localhost';
  return window.location.hostname;
};

const resolveTenantSlug = () => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('tenant');
};

export async function apiFetch<T = any>(path: string, init?: RequestInit): Promise<T> {
  const tenantSlug = resolveTenantSlug();
  const headers: Record<string, string> = {
    'x-forwarded-host': resolveHostHeader(),
    ...(init?.headers as Record<string, string> | undefined)
  };
  if (tenantSlug) {
    headers['x-tenant-slug'] = tenantSlug;
  }

  const res = await fetch(`${apiBase}${path}`, {
    ...init,
    headers,
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return (await res.json()) as T;
}

export async function fetchMe() {
  try {
    return await apiFetch('/auth/me');
  } catch {
    return null;
  }
}

export async function quickLogin(email: string) {
  return apiFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
}
