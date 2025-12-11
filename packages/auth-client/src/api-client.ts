export interface ApiClientOptions {
  baseUrl: string;
  getToken?: () => string | null | Promise<string | null>;
}

export interface ApiClient {
  get: <T>(path: string, init?: RequestInit) => Promise<T>;
  post: <T>(path: string, body?: unknown, init?: RequestInit) => Promise<T>;
}

const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

const withToken = async (headers: HeadersInit = {}, getToken?: ApiClientOptions['getToken']) => {
  const result = getToken ? await getToken() : null;
  if (!result) {
    return headers;
  }

  return {
    ...(headers as Record<string, string>),
    Authorization: `Bearer ${result}`
  };
};

export const createApiClient = ({ baseUrl, getToken }: ApiClientOptions): ApiClient => {
  const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
    const headers = await withToken(init.headers, getToken);
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  };

  const get = <T>(path: string, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: 'GET'
    });

  const post = <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        ...jsonHeaders,
        ...(init?.headers as Record<string, string>)
      }
    });

  return { get, post };
};
