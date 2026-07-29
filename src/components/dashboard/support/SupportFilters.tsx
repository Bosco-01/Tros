'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

export type SupportFilterKey = 'all' | 'answered' | 'pending' | 'closed';

type SupportFiltersProps = {
  counts?: {
    all: number;
    answered: number;
    pending: number;
    closed: number;
  };
  activeFilter?: SupportFilterKey;
  onFilterChange?: (filter: SupportFilterKey) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;
};

export const SupportFilters: React.FC<SupportFiltersProps> = ({
  counts,
  activeFilter = 'all',
  onFilterChange,
  search = '',
  onSearchChange,
  onSearchSubmit,
}) => {
  const [localActive, setLocalActive] = useState<SupportFilterKey>(activeFilter);

  const current = onFilterChange ? activeFilter : localActive;

  const filters: { key: SupportFilterKey; label: string; count?: number }[] = [
    { key: 'all', label: 'All Tickets', count: counts?.all },
    { key: 'answered', label: 'Answered', count: counts?.answered },
    { key: 'pending', label: 'Pending', count: counts?.pending },
    { key: 'closed', label: 'Closed', count: counts?.closed },
  ];

  const select = (key: SupportFilterKey) => {
    if (onFilterChange) onFilterChange(key);
    else setLocalActive(key);
  };

  return (
    <div className="flex flex-col gap-6 mb-8 w-full max-w-[1100px] select-none">
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
        <div className="relative flex-1 w-full">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search tickets"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearchSubmit?.();
            }}
            className="w-full h-14 pl-14 pr-6 bg-white border border-neutral-100 rounded-full text-[15px] font-medium text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all shadow-sm shadow-neutral-100/30"
          />
        </div>

        <button
          type="button"
          onClick={() => onSearchSubmit?.()}
          className="w-full sm:w-auto h-14 px-10 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold text-[15px] rounded-full transition-colors shadow-sm shadow-[#6312E1]/10"
        >
          Search
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        {filters.map((filter) => {
          const label =
            typeof filter.count === 'number'
              ? `${filter.label} (${filter.count})`
              : filter.label;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => select(filter.key)}
              className={`px-8 py-2.5 rounded-full font-bold text-[14px] transition-all duration-200 border ${
                current === filter.key
                  ? 'bg-[#6312E1] border-[#6312E1] text-white shadow-sm shadow-[#6312E1]/10'
                  : 'bg-white border-neutral-100 text-neutral-700 hover:bg-neutral-50 shadow-sm shadow-neutral-100/50'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
