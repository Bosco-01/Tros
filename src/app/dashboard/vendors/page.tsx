import React from 'react';
import { Topbar } from '@/components/layout/topbar';
import { VendorFilters } from '@/components/dashboard/vendors/VendorFilters';
import { VendorsTable } from '@/components/dashboard/vendors/VendorsTable';
import { mockVendors } from '@/data/vendors';

export default function AllVendorsPage() {
  return (
    <>
      <Topbar title="All Vendors" />
      
      {/* 
        Main content wrapper with a slightly grey background 
        so the pure white filter containers and table row states stand out.
      */}
      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        
        {/* Rounded filter bar and tag bar */}
        <VendorFilters />

        {/* Dynamic Data Table */}
        <div className="w-full">
          <VendorsTable data={mockVendors} />
        </div>

      </main>
    </>
  );
}