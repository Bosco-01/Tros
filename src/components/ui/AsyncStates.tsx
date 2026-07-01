import React from 'react';

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[240px] p-8">
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin h-10 w-10 text-[#6312E1]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-sm font-medium text-neutral-500">{label}</p>
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[240px] p-8">
      <div className="max-w-md text-center">
        <p className="text-red-600 font-semibold mb-3">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-5 py-2.5 bg-[#6312E1] text-white rounded-xl text-sm font-bold hover:bg-[#520cbd] transition-colors"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center min-h-[160px] p-8 text-center">
      <p className="text-neutral-500 font-medium">{message}</p>
    </div>
  );
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="px-4 sm:px-8 py-4 sm:py-5 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
      <span className="text-sm font-semibold text-neutral-900">
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 h-9 rounded-lg bg-[#F4F4F5] text-neutral-700 text-sm font-bold disabled:opacity-40"
        >
          Prev
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-bold flex items-center justify-center ${
              p === page ? 'bg-[#6312e1] text-white' : 'bg-[#F4F4F5] text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 h-9 rounded-lg bg-[#F4F4F5] text-neutral-700 text-sm font-bold disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 p-4 sm:p-6 md:p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar w-full min-w-0">
      {(title || subtitle) && (
        <div className="mb-4 sm:mb-6 flex flex-col gap-1 max-w-[1100px]">
          {title && <h2 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">{title}</h2>}
          {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
        </div>
      )}
      {children}
    </main>
  );
}

export function StatusBadge({ value, className = '' }: { value: string; className?: string }) {
  const normalized = value.toLowerCase();
  let styles = 'bg-neutral-100 text-neutral-700';
  if (['active', 'approved', 'successful', 'resolved', 'open'].includes(normalized)) {
    styles = 'bg-[#E5F5E8] text-[#168E33]';
  } else if (['inactive', 'rejected', 'declined', 'failed', 'closed'].includes(normalized)) {
    styles = 'bg-[#FFE8E8] text-[#D82F2F]';
  } else if (['pending', 'in_progress', 'on_hold', 'pending_cancellation'].includes(normalized)) {
    styles = 'bg-[#FFF4E5] text-[#B45309]';
  }

  return (
    <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold capitalize ${styles} ${className}`}>
      {value.replace(/_/g, ' ')}
    </span>
  );
}
