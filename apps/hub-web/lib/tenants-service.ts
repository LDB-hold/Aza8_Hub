export type Setter<T> = (value: T | ((prev: T) => T)) => void;

export type TenantsApi = {
  get: <T>(path: string) => Promise<T>;
};

export interface TenantSummary {
  id: string;
  name: string;
  slug: string;
  plan: string;
  status: string;
}

export const fetchTenantsData = async (
  api: TenantsApi,
  setTenants: Setter<TenantSummary[]>,
  setLoading: Setter<boolean>,
  setError: Setter<Error | null>
) => {
  setLoading(true);
  setError(null);

  try {
    const response = await api.get<TenantSummary[]>('/tenants');
    setTenants(response);
  } catch (err) {
    setError(err as Error);
    setTenants([]);
  } finally {
    setLoading(false);
  }
};
