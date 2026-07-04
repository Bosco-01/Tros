"use client";

import React from "react";
import { Search, ChevronDown, X } from "lucide-react";

interface EventsListFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  activeFilters: string[];
  onRemoveFilter: (filter: string) => void;
  onSearchClick?: () => void;
}

export const EventsListFilters: React.FC<EventsListFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  activeFilters,
  onRemoveFilter,
  onSearchClick,
}) => {
  return (
    <div className="flex flex-col gap-6 mb-8 w-full max-w-[1100px] select-none animate-in fade-in duration-300">
      {/* Search Input, Dropdown, and Button Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
        {/* Category Search Input */}
        <div className="relative flex-1 w-full">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Category"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSearchClick?.();
              }
            }}
            className="w-full h-14 pl-14 pr-6 bg-white border border-neutral-100 rounded-full text-[15px] font-medium text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all shadow-sm shadow-neutral-100/50"
          />
        </div>

        {/* Status Dropdown Select */}
        <div className="relative w-full sm:w-[260px]">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full h-14 px-6 bg-white border border-neutral-100 rounded-full flex items-center justify-between text-[15px] font-medium text-neutral-500 hover:bg-neutral-50 transition-colors shadow-sm shadow-neutral-100/50 focus:outline-none appearance-none pr-12 cursor-pointer font-bold"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Declined">Declined</option>
          </select>
          <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
            <ChevronDown className="w-4 h-4" />
          </span>
        </div>

        {/* Search Button */}
        <button
          onClick={() => onSearchClick?.()}
          className="w-full sm:w-auto h-14 px-10 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold text-[15px] rounded-full transition-colors shadow-sm shadow-[#6312E1]/10"
        >
          Search
        </button>
      </div>

      {/* Filter Tag Bar */}
      {activeFilters.length > 0 && (
        <div className="w-full bg-white rounded-[24px] p-5 border border-neutral-100 flex items-center gap-4 shadow-sm shadow-neutral-100/50 flex-wrap">
          <span className="text-base font-bold text-neutral-900 leading-none">
            Filter:
          </span>

          <div className="flex flex-wrap items-center gap-3">
            {activeFilters.map((filter) => (
              <div
                key={filter}
                className="flex items-center gap-2 bg-white border border-neutral-200 px-4 py-2 rounded-xl text-sm font-bold text-neutral-900 select-none"
              >
                <span>{filter}</span>
                <button
                  onClick={() => onRemoveFilter(filter)}
                  type="button"
                  className="text-neutral-400 hover:text-neutral-900 transition-colors focus:outline-none"
                  aria-label={`Remove ${filter} filter`}
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
