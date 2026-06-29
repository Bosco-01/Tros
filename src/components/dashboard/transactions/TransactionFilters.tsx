'use client';

import React, { useState } from 'react';
import { Calendar, ChevronDown, Search } from 'lucide-react';

export const TransactionFilters: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Vendors' | 'Users'>('Vendors');
  const [activeState, setActiveState] = useState<'All' | 'Pending' | 'Successful' | 'Failed'>('All');

  return (
    <div className="flex flex-col gap-6 mb-8 w-full max-w-[1100px] select-none">
      
      {/* Tab Selectors (Vendors vs Users) */}
      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab('Vendors')}
          className={`px-8 py-2.5 rounded-full font-bold text-[15px] transition-all duration-200 ${
            activeTab === 'Vendors'
              ? 'bg-[#6312E1] text-white shadow-sm'
              : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-100'
          }`}
        >
          Vendors
        </button>
        <button
          onClick={() => setActiveTab('Users')}
          className={`px-8 py-2.5 rounded-full font-bold text-[15px] transition-all duration-200 ${
            activeTab === 'Users'
              ? 'bg-[#6312E1] text-white shadow-sm'
              : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-100'
          }`}
        >
          Users
        </button>
      </div>

      {/* Date Filter & Name Input Fields row */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
        
        {/* Date Range Selection Pill */}
        <div className="relative w-full sm:w-[320px] h-14 px-6 bg-white border border-neutral-100 rounded-full flex items-center justify-between text-[14px] font-bold text-neutral-900 shadow-sm shadow-neutral-100/50 cursor-pointer hover:bg-neutral-50 transition-colors">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-neutral-700" />
            <span>Feb 01 2026 - Feb 30 2026</span>
          </div>
          <ChevronDown className="w-4 h-4 text-neutral-500" />
        </div>

        {/* Custom Nested "Search by Name" input container */}
        <div className="flex items-center gap-2 bg-white border border-neutral-100 shadow-sm shadow-neutral-100/50 rounded-full h-14 px-6 flex-1 w-full">
          <Search className="w-5 h-5 text-neutral-500" />
          <span className="text-[15px] text-neutral-500 font-bold whitespace-nowrap">Search by:</span>
          <input
            type="text"
            placeholder="Name"
            className="bg-[#F4F4F5] rounded-full h-9 px-5 text-sm font-bold text-neutral-900 w-full outline-none border-none placeholder-neutral-500 focus:ring-1 focus:ring-[#6312E1]/20"
          />
        </div>

        {/* Search submit button */}
        <button className="w-full sm:w-auto h-14 px-10 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold text-[15px] rounded-full transition-colors shadow-sm shadow-[#6312E1]/10">
          Search
        </button>

      </div>

      {/* Status Filter States bar */}
      <div className="flex flex-wrap gap-4">
        {(['All', 'Pending', 'Successful', 'Failed'] as const).map((state) => (
          <button
            key={state}
            onClick={() => setActiveState(state)}
            className={`px-8 py-2 rounded-full font-bold text-[14px] transition-all duration-200 border ${
              activeState === state
                ? 'bg-[#6312E1] border-[#6312E1] text-white'
                : 'bg-white border-neutral-100 text-neutral-700 hover:bg-neutral-50 shadow-sm shadow-neutral-100/50'
            }`}
          >
            {state}
          </button>
        ))}
      </div>

    </div>
  );
};