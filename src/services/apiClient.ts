import { BACKEND_API_URL } from '@/lib/config';

export class APIError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

function extractErrorMessage(data: unknown): string {
  if (!data || typeof data !== 'object') return 'An API error occurred';
  const obj = data as Record<string, unknown>;
  if (typeof obj.message === 'string') return obj.message;
  if (typeof obj.error === 'string') return obj.error;
  return 'An API error occurred';
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
    url = `${BACKEND_API_URL}${endpoint}`;
    
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
    throw new APIError(extractErrorMessage(data), response.status);
  }

  return data as T;
}