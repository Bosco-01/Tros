'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Topbar } from '@/components/layout/topbar'; // Note: Matches lowercase on-disk config
import { VendorFilters } from '@/components/dashboard/vendors/VendorFilters';
import { VendorsTable } from '@/components/dashboard/vendors/VendorsTable';
import { mockVendors, VendorRowData } from '@/data/vendors';

export default function AllVendorsPage() {
  const [vendors, setVendors] = useState<VendorRowData[]>(mockVendors);

  // Fetch newly created vendors from localStorage on mount and merge them into your table!
  useEffect(() => {
    const stored = localStorage.getItem('trios_custom_vendors');
    if (stored) {
      try {
        const customVendors = JSON.parse(stored);
        // Merge custom vendors at the top of the table list
        setVendors([...customVendors, ...mockVendors]);
      } catch (e) {
        console.error('Failed to parse newly created local storage vendors:', e);
      }
    }
  }, []);

  return (
    <>
      <Topbar title="All Vendors" />
      
      {/* 
        Main content wrapper with slightly grey background 
        so the pure white filter containers and table row states stand out.
      */}
      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        
        {/* Header Title & Actions Row (Aligned top-right under Topbar admin panel) */}
        <div className="flex items-center justify-between gap-4 mb-8 w-full max-w-[1100px] select-none">
          <h2 className="text-xl md:text-[22px] font-bold text-neutral-900 tracking-tight">
            Vendor Directory
          </h2>
          {/* Create Vendor Action Button */}
          <Link href="/dashboard/vendors/create">
            <button className="flex items-center gap-2.5 px-6 py-3 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold text-sm rounded-full transition-colors focus:outline-none shadow-sm shadow-[#6312E1]/10">
              <div className="w-5 h-5 bg-white text-[#6312E1] flex items-center justify-center rounded-md font-extrabold text-xs">
                +
              </div>
              <span>Create Vendor</span>
            </button>
          </Link>
        </div>

        {/* Rounded filter bar and tag bar */}
        <VendorFilters />

        {/* Dynamic Data Table */}
        <div className="w-full">
          <VendorsTable data={vendors} />
        </div>

      </main>
    </>
  );
}