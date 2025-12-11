import { useEffect, useMemo, useState } from 'react';
import { CurrentUserContext } from '@aza8/core-domain';

import { ApiClientOptions, createApiClient } from './api-client';

export interface UseCurrentUserOptions extends ApiClientOptions {
  enabled?: boolean;
}

export interface UseCurrentUserResult {
  data: CurrentUserContext | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export const useCurrentUser = ({
  baseUrl,
  getToken,
  enabled = true
}: UseCurrentUserOptions): UseCurrentUserResult => {
  const client = useMemo(() => createApiClient({ baseUrl, getToken }), [baseUrl, getToken]);
  const [data, setData] = useState<CurrentUserContext | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = async () => {
    if (!enabled) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await client.get<CurrentUserContext>('/me');
      setData(response);
    } catch (err) {
      setError(err as Error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl]);

  return {
    data,
    loading,
    error,
    refresh: fetchUser
  };
};
