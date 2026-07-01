import type { PaginatedResponse } from '@/types/admin';

export function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (!payload || typeof payload !== 'object') return [];

  const obj = payload as PaginatedResponse<T> & Record<string, unknown>;
  if (Array.isArray(obj.items)) return obj.items;
  if (Array.isArray(obj.data)) return obj.data;
  if (Array.isArray(obj.results)) return obj.results;

  return [];
}

export function unwrapTotal(payload: unknown, listLength: number): number {
  if (!payload || typeof payload !== 'object') return listLength;
  const obj = payload as PaginatedResponse<unknown>;
  return obj.total ?? obj.count ?? listLength;
}

export function unwrapPage(payload: unknown, fallback = 1): number {
  if (!payload || typeof payload !== 'object') return fallback;
  const obj = payload as PaginatedResponse<unknown>;
  return obj.page ?? fallback;
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
