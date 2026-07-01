const DEFAULT_BACKEND = 'https://trios.viaspark.site/api/v1';

/** Ensure BACKEND_API_URL always ends with /api/v1 (common Vercel misconfig omits it). */
export function normalizeBackendApiUrl(raw?: string): string {
  const value = (raw?.trim() || DEFAULT_BACKEND).replace(/\/+$/, '');
  if (value.endsWith('/api/v1')) return value;
  if (value.endsWith('/api')) return `${value}/v1`;
  return `${value}/api/v1`;
}

export const BACKEND_API_URL = normalizeBackendApiUrl(process.env.BACKEND_API_URL);

export const SESSION_COOKIE = 'trios_session_token';

export const USE_MOCK_FALLBACK =
  process.env.USE_MOCK_FALLBACK === 'true' || process.env.USE_MOCK_FALLBACK === '1';
