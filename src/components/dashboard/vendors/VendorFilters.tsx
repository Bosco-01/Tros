'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface VendorFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSubmit: () => void;
}

export const VendorFilters: React.FC<VendorFiltersProps> = ({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onSubmit,
}) => {
  const activeFilter = status ? `Status: ${status}` : search ? `Search: ${search}` : null;

  return (
    <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8 w-full max-w-[1100px]">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full">
        <div className="relative flex-1 w-full">
          <span className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-neutral-500">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Vendor name"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-12 sm:h-14 pl-12 sm:pl-14 pr-4 sm:pr-6 bg-white border border-neutral-100 rounded-full text-sm sm:text-[15px] font-medium focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1]"
          />
        </div>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full sm:w-[220px] h-12 sm:h-14 px-4 bg-white border border-neutral-100 rounded-full text-sm font-medium"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <button
          type="button"
          onClick={onSubmit}
          className="w-full sm:w-auto h-12 sm:h-14 px-8 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold text-sm sm:text-[15px] rounded-full"
        >
          Search
        </button>
      </div>

      {activeFilter && (
        <div className="w-full bg-white rounded-2xl p-4 border border-neutral-100 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-neutral-900">Filter:</span>
          <div className="flex items-center gap-2 border border-neutral-200 px-3 py-1.5 rounded-xl text-sm font-bold">
            <span>{activeFilter}</span>
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onStatusChange('');
              }}
              aria-label="Clear filters"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
