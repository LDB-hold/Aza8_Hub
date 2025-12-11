'use client';

import { useCallback, useEffect, useState } from 'react';

import { apiClient } from './api-client';

export interface TenantSummary {
  id: string;
  name: string;
  slug: string;
  plan: string;
  status: string;
}

export const useTenants = () => {
  const [tenants, setTenants] = useState<TenantSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<TenantSummary[]>('/tenants');
      setTenants(response);
    } catch (err) {
      setError(err as Error);
      setTenants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTenants();
  }, [fetchTenants]);

  return { tenants, loading, error, refresh: fetchTenants };
};
