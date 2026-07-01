export const BACKEND_API_URL =
  process.env.BACKEND_API_URL || 'https://trios.viaspark.site/api/v1';

export const SESSION_COOKIE = 'trios_session_token';

export const USE_MOCK_FALLBACK =
  process.env.USE_MOCK_FALLBACK === 'true' || process.env.USE_MOCK_FALLBACK === '1';
