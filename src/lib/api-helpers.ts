import type { PaginatedResponse, AdminVendorDetail, AdminEvent } from '@/types/admin';

/** Known array property names in Trios admin API envelopes. */
const LIST_ARRAY_KEYS = [
  'users',
  'vendors',
  'events',
  'transactions',
  'subscriptions',
  'tickets',
  'admins',
  'reports',
  'broadcasts',
  'bookings',
  'faqs',
  'plans',
  'items',
  'results',
] as const;

function firstArray<T>(obj: Record<string, unknown>): T[] | null {
  for (const key of LIST_ARRAY_KEYS) {
    const val = obj[key];
    if (Array.isArray(val)) return val as T[];
  }
  if (Array.isArray(obj.data)) return obj.data as T[];
  return null;
}

/**
 * Extract list items from Trios API envelopes, e.g.
 * `{ data: { users: [...], total_users: 24 } }` or `{ faqs: [...] }`.
 */
export function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (!payload || typeof payload !== 'object') return [];

  const root = payload as Record<string, unknown>;
  const top = firstArray<T>(root);
  if (top) return top;

  const data = root.data;
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const inner = data as Record<string, unknown>;
    const nested = firstArray<T>(inner);
    if (nested) return nested;
  }

  return [];
}

/** Read total count from `total`, `count`, or `total_users`-style fields. */
export function unwrapTotal(payload: unknown, listLength: number): number {
  if (!payload || typeof payload !== 'object') return listLength;

  const readTotals = (obj: Record<string, unknown>): number | null => {
    if (typeof obj.total === 'number') return obj.total;
    if (typeof obj.count === 'number') return obj.count;
    for (const [key, val] of Object.entries(obj)) {
      if (key.startsWith('total_') && typeof val === 'number') return val;
    }
    return null;
  };

  const root = payload as Record<string, unknown>;
  const rootTotal = readTotals(root);
  if (rootTotal != null) return rootTotal;

  const data = root.data;
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const innerTotal = readTotals(data as Record<string, unknown>);
    if (innerTotal != null) return innerTotal;
  }

  return listLength;
}

export function unwrapPage(payload: unknown, fallback = 1): number {
  if (!payload || typeof payload !== 'object') return fallback;
  const root = payload as Record<string, unknown>;
  if (typeof root.page === 'number') return root.page;
  const data = root.data;
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const page = (data as Record<string, unknown>).page;
    if (typeof page === 'number') return page;
  }
  return fallback;
}

/** Unwrap a single entity from `{ data: { ... } }` or return payload as-is. */
export function unwrapEntity<T>(payload: unknown): T {
  if (!payload || typeof payload !== 'object') return payload as T;
  const root = payload as Record<string, unknown>;

  if (root.data && typeof root.data === 'object' && !Array.isArray(root.data)) {
    const inner = root.data as Record<string, unknown>;
    if (inner.vendor && Array.isArray(inner.data)) {
      return root as T;
    }
    return inner as T;
  }

  return root as T;
}

export interface VendorPageBundle {
  vendor: AdminVendorDetail;
  events: AdminEvent[];
  total_events: number;
}

/** Parse `GET /admin/vendors/{id}/page` where events live in `data.data`. */
export function unwrapVendorPage(payload: unknown): VendorPageBundle | null {
  if (!payload || typeof payload !== 'object') return null;
  const root = payload as Record<string, unknown>;
  const data = root.data;
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;

  const inner = data as Record<string, unknown>;
  if (!inner.vendor || typeof inner.vendor !== 'object') return null;

  return {
    vendor: inner.vendor as AdminVendorDetail,
    events: (Array.isArray(inner.data) ? inner.data : []) as AdminEvent[],
    total_events: typeof inner.total_events === 'number' ? inner.total_events : 0,
  };
}

/** Convert settings array `[{ key, value }]` to a flat map. */
export function settingsToMap(payload: unknown): Record<string, string> {
  if (!payload || typeof payload !== 'object') return {};
  const root = payload as Record<string, unknown>;

  if (Array.isArray(root.settings)) {
    const map: Record<string, string> = {};
    for (const item of root.settings) {
      if (item && typeof item === 'object' && 'key' in item && 'value' in item) {
        const row = item as { key: string; value: unknown };
        map[row.key] = String(row.value ?? '');
      }
    }
    return map;
  }

  const map: Record<string, string> = {};
  for (const [key, val] of Object.entries(root)) {
    if (key === 'message' || key === 'status' || key === 'settings') continue;
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
      map[key] = String(val);
    }
  }
  return map;
}

export function formatCurrency(amount: number | string | undefined): string {
  if (amount == null || amount === '') return '—';
  const n = typeof amount === 'string' ? Number(amount) : amount;
  if (Number.isNaN(n)) return String(amount);
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);
}

export function formatDate(value?: string): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function activeLabel(isActive?: boolean, status?: string): 'Active' | 'Inactive' {
  if (typeof isActive === 'boolean') return isActive ? 'Active' : 'Inactive';
  const s = (status || '').toLowerCase();
  if (s === 'active' || s === 'approved') return 'Active';
  return 'Inactive';
}

export function titleCase(value?: string): string {
  if (!value) return '—';
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
