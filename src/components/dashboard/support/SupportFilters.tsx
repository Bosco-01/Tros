'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

export const SupportFilters: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All Tickets (885)');

  const filters = [
    'All Tickets (885)',
    'Answered (400)',
    'Pending (250)',
    'Closed (150)',
  ];

  return (
    <div className="flex flex-col gap-6 mb-8 w-full max-w-[1100px] select-none">
      
      {/* Search Bar Row */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
        {/* Ticket Search Input */}
        <div className="relative flex-1 w-full">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Tickets"
            className="w-full h-14 pl-14 pr-6 bg-white border border-neutral-100 rounded-full text-[15px] font-medium text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all shadow-sm shadow-neutral-100/30"
          />
        </div>

        {/* Purple Search Button */}
        <button className="w-full sm:w-auto h-14 px-10 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold text-[15px] rounded-full transition-colors shadow-sm shadow-[#6312E1]/10">
          Search
        </button>
      </div>

      {/* Switcher Tab State Pills */}
      <div className="flex flex-wrap gap-4">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-8 py-2.5 rounded-full font-bold text-[14px] transition-all duration-200 border ${
              activeFilter === filter
                ? 'bg-[#6312E1] border-[#6312E1] text-white shadow-sm shadow-[#6312E1]/10'
                : 'bg-white border-neutral-100 text-neutral-700 hover:bg-neutral-50 shadow-sm shadow-neutral-100/50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

    </div>
  );
};