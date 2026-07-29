'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

interface ReportFiltersProps {
  activeTab?: 'Weekly' | 'Monthly' | 'Yearly';
  onTabChange?: (tab: 'Weekly' | 'Monthly' | 'Yearly') => void;
  from?: string;
  to?: string;
  onFromChange?: (value: string) => void;
  onToChange?: (value: string) => void;
  onSearch?: () => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  activeTab = 'Monthly',
  onTabChange = () => {},
  from = '',
  to = '',
  onFromChange = () => {},
  onToChange = () => {},
  onSearch = () => {},
}) => {
  return (
    <div className="flex flex-col gap-6 mb-8 w-full max-w-[1100px] select-none">
      
      {/* Time Frame Switcher Tabs */}
      <div className="flex gap-4">
        {(['Weekly', 'Monthly', 'Yearly'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`px-8 py-2.5 rounded-full font-bold text-[15px] transition-all duration-200 border ${
              activeTab === tab
                ? 'bg-[#6312E1] border-[#6312E1] text-white shadow-sm shadow-[#6312E1]/10'
                : 'bg-white border-neutral-100 text-neutral-600 hover:bg-neutral-50 shadow-sm shadow-neutral-100/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Date picker row */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
        
        {/* Date Selection Inputs */}
        <div className="flex items-center gap-3 w-full sm:w-auto bg-white border border-neutral-100 px-5 h-14 rounded-full shadow-sm shadow-neutral-100/50 text-sm font-medium">
          <Calendar className="w-5 h-5 text-neutral-700 shrink-0" />
          <input
            type="date"
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            className="bg-transparent focus:outline-none text-neutral-900 font-bold text-xs sm:text-sm"
          />
          <span className="text-neutral-400 font-bold">-</span>
          <input
            type="date"
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            className="bg-transparent focus:outline-none text-neutral-900 font-bold text-xs sm:text-sm"
          />
        </div>

        {/* Purple Search Trigger */}
        <button
          type="button"
          onClick={onSearch}
          className="w-full sm:w-auto h-14 px-10 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold text-[15px] rounded-full transition-colors shadow-sm shadow-[#6312E1]/10"
        >
          Search
        </button>

      </div>

    </div>
  );
};