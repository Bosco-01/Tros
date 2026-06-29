import React from 'react';
import Link from 'next/link';

export const SubscriptionHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between gap-4 mb-8 w-full max-w-[1100px] select-none">
      
      {/* Section Title */}
      <h2 className="text-xl md:text-[22px] font-bold text-neutral-950 tracking-tight">
        Available Packages
      </h2>

      {/* [+] Add Package Pill Button wrapping Next.js Router */}
      <Link href="/dashboard/subscriptions/add">
        <button className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-neutral-100 shadow-sm shadow-neutral-100/30 rounded-full hover:bg-neutral-50 transition-colors focus:outline-none">
          {/* Rounded square plus icon */}
          <div className="w-5 h-5 bg-[#6312E1] text-white flex items-center justify-center rounded-md font-bold text-xs">
            +
          </div>
          <span className="text-sm font-bold text-neutral-800">Add Package</span>
        </button>
      </Link>

    </div>
  );
};