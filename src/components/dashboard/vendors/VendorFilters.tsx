'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

export const VendorFilters: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>('All Vendors');

  return (
    <div className="flex flex-col gap-6 mb-8 w-full max-w-[1100px]">
      
      {/* Search Input, Dropdown, and Button Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
        
        {/* Vendor Name Search Input */}
        <div className="relative flex-1 w-full">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Vendor name"
            className="w-full h-14 pl-14 pr-6 bg-white border border-neutral-100 rounded-full text-[15px] font-medium text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all shadow-sm shadow-neutral-100/50"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative w-full sm:w-[260px]">
          <button className="w-full h-14 px-6 bg-white border border-neutral-100 rounded-full flex items-center justify-between text-[15px] font-medium text-neutral-500 hover:bg-neutral-50 transition-colors shadow-sm shadow-neutral-100/50">
            <span>Status</span>
            <ChevronDown className="w-4 h-4 text-neutral-500" />
          </button>
        </div>

        {/* Search Button */}
        <button className="w-full sm:w-auto h-14 px-10 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold text-[15px] rounded-full transition-colors shadow-sm shadow-[#6312E1]/10">
          Search
        </button>

      </div>

      {/* Filter Tag Bar */}
      {activeFilter && (
        <div className="w-full bg-white rounded-[24px] p-5 border border-neutral-100 flex items-center gap-4 shadow-sm shadow-neutral-100/50">
          <span className="text-base font-bold text-neutral-900 leading-none">Filter:</span>
          
          {/* Active Filter Badge */}
          <div className="flex items-center gap-2 bg-white border border-neutral-200 px-4 py-2 rounded-xl text-sm font-bold text-neutral-900 select-none">
            <span>{activeFilter}</span>
            <button
              onClick={() => setActiveFilter(null)}
              className="text-neutral-400 hover:text-neutral-900 transition-colors focus:outline-none"
              aria-label="Remove filter"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};