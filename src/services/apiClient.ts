export class APIError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  serverToken?: string
): Promise<T> {
  const isClient = typeof window !== 'undefined';
  
  let url = '';
  const headers = new Headers(options.headers || {});
  
  if (isClient) {
    url = `/api${endpoint}`; 
  } else {
    const backendUrl = process.env.BACKEND_API_URL || 'https://api.trios.com';
    url = `${backendUrl}${endpoint}`;
    
    if (serverToken) {
      headers.set('Authorization', `Bearer ${serverToken}`);
    }
  }

  headers.set('Accept', 'application/json');
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new APIError(data.message || 'An API error occurred', response.status);
  }

  return data as T;
}