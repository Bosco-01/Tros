import { BACKEND_API_URL } from '@/lib/config';

export const AVATAR_PLACEHOLDER = '/avatar-placeholder.svg';

/** API host without `/api/v1` — static uploads are served from the app root. */
export function mediaBaseUrl(): string {
  return BACKEND_API_URL.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');
}

/** Turn a relative upload path into an absolute URL the browser can load. */
export function resolveMediaUrl(path?: string | null): string {
  if (!path) return '';
  const trimmed = path.trim();
  if (!trimmed) return '';
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }
  // Keep Next.js public assets local (placeholders, etc.)
  if (
    trimmed === AVATAR_PLACEHOLDER ||
    trimmed.startsWith('/avatar-') ||
    trimmed.startsWith('/_next/')
  ) {
    return trimmed;
  }
  const base = mediaBaseUrl();
  return `${base}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`;
}

export function avatarOrPlaceholder(path?: string | null): string {
  const resolved = resolveMediaUrl(path);
  return resolved || AVATAR_PLACEHOLDER;
}

export function isPdfUrl(url?: string | null): boolean {
  if (!url) return false;
  const clean = url.split('?')[0].toLowerCase();
  return clean.endsWith('.pdf');
}

export function isImageUrl(url?: string | null): boolean {
  if (!url) return false;
  const clean = url.split('?')[0].toLowerCase();
  return /\.(jpe?g|png|gif|webp|bmp|svg)$/.test(clean);
}
