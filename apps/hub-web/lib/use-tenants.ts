'use client';

import { useCallback, useEffect, useState } from 'react';

import { apiClient } from './api-client';
import { fetchTenantsData, type TenantSummary } from './tenants-service';

export type { TenantSummary } from './tenants-service';

export const useTenants = () => {
  const [tenants, setTenants] = useState<TenantSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTenants = useCallback(() => {
    return fetchTenantsData(apiClient, setTenants, setLoading, setError);
  }, [setTenants, setLoading, setError]);

  useEffect(() => {
    void fetchTenants();
  }, [fetchTenants]);

  return { tenants, loading, error, refresh: fetchTenants };
};
