import React from 'react';
import { Search } from 'lucide-react';

type EventUsersFilterProps = {
  totalCount?: number;
  search?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;
};

export const EventUsersFilter: React.FC<EventUsersFilterProps> = ({
  totalCount,
  search = '',
  onSearchChange,
  onSearchSubmit,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 w-full max-w-[1100px]">
      <h3 className="text-base font-bold text-neutral-950 px-1 whitespace-nowrap">
        {typeof totalCount === 'number' ? `All Users (${totalCount})` : 'All Users'}
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
        <div className="relative w-full sm:w-[260px]">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search name"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearchSubmit?.();
            }}
            className="w-full h-12 pl-12 pr-5 bg-white border border-neutral-100 rounded-full text-[14px] font-medium text-neutral-950 placeholder-neutral-500 focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all"
          />
        </div>

        <button
          type="button"
          onClick={() => onSearchSubmit?.()}
          className="w-full sm:w-auto h-12 px-8 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold text-[14px] rounded-full transition-colors select-none"
        >
          Search
        </button>
      </div>
    </div>
  );
};
