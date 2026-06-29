'use client';

import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export const ReportFilters: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Monthly');

  return (
    <div className="flex flex-col gap-6 mb-8 w-full max-w-[1100px] select-none">
      
      {/* Time Frame Switcher Tabs */}
      <div className="flex gap-4">
        {(['Weekly', 'Monthly', 'Yearly'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
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
        
        {/* Date Selection Dropdown */}
        <div className="relative w-full sm:w-[320px] h-14 px-6 bg-white border border-neutral-100 rounded-full flex items-center justify-between text-[14px] font-bold text-neutral-900 shadow-sm shadow-neutral-100/50 cursor-pointer hover:bg-neutral-50 transition-colors">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-neutral-700" />
            <span>Feb 01 2026 - Feb 30 2026</span>
          </div>
          <ChevronDown className="w-4 h-4 text-neutral-500" />
        </div>

        {/* Purple Search Trigger */}
        <button className="w-full sm:w-auto h-14 px-10 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold text-[15px] rounded-full transition-colors shadow-sm shadow-[#6312E1]/10">
          Search
        </button>

      </div>

    </div>
  );
};