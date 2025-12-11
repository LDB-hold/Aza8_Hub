'use client';

import { useCallback, useEffect, useState } from 'react';

import { apiClient } from './api-client';

interface CurrentTenantResponse {
  tenant: {
    id: string;
    name: string;
    slug: string;
    plan: string;
    status: string;
  } | null;
  context: {
    tenantId: string | null;
    tenantSlug: string | null;
    isHubRequest: boolean;
  };
}

export const useCurrentTenant = () => {
  const [data, setData] = useState<CurrentTenantResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTenant = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<CurrentTenantResponse>('/tenants/current');
      setData(response);
    } catch (err) {
      setError(err as Error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTenant();
  }, [fetchTenant]);

  return { data, loading, error, refresh: fetchTenant };
};
