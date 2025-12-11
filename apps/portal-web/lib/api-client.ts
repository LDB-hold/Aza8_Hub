import { createApiClient, createCookieTokenProvider } from '@aza8/auth-client';

import { webConfig } from '../config/web-config';

export const apiClient = createApiClient({
  baseUrl: webConfig.apiUrl,
  getToken: createCookieTokenProvider()
});
