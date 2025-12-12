export type Setter<T> = (value: T | ((prev: T) => T)) => void;

export type TenantsApi = {
  get: <T>(path: string, init?: RequestInit) => Promise<T>;
  post: <T>(path: string, body?: unknown, init?: RequestInit) => Promise<T>;
};

export interface TenantSummary {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  plan?: string;
  status?: string;
}

const BASE_PATH = '/hub/tenants';

export const fetchTenantsData = async (
  api: TenantsApi,
  setTenants: Setter<TenantSummary[]>,
  setLoading: Setter<boolean>,
  setError: Setter<Error | null>
) => {
  setLoading(true);
  setError(null);

  try {
    const response = await api.get<TenantSummary[]>(BASE_PATH, { credentials: 'include' });
    const normalized = response.map((tenant) => ({
      ...tenant,
      plan: tenant.plan ?? 'N/D',
      status: tenant.status ?? 'ativo'
    }));
    setTenants(normalized);
  } catch (err) {
    setError(err as Error);
    setTenants([]);
  } finally {
    setLoading(false);
  }
};

export const createTenant = async (
  api: TenantsApi,
  payload: { name: string; slug: string }
) => {
  return api.post<TenantSummary>(BASE_PATH, payload, {
    credentials: 'include'
  });
};
