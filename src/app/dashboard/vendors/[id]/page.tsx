import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Topbar } from '@/components/layout/topbar';

import { VendorProfileHeader } from '@/components/dashboard/vendors/VendorProfileHeader';
import { VendorDetailsGrid } from '@/components/dashboard/vendors/VendorDetailsGrid';
import { VendorEventsTable } from '@/components/dashboard/vendors/VendorEventsTable';

import { mockVendorProfile, mockVendorEvents } from '@/data/vendor-details';

export default function VendorDetailsPage() {
  return (
    <>
      <Topbar title="All Vendors" />
      
      {/* 
        Main content wrapper with grey background 
        to ensure visual pop of white input containers.
      */}
      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        <div className="max-w-[1100px]">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[15px] font-medium mb-10">
            <Link href="/dashboard/vendors" className="text-neutral-900 hover:text-[#6312E1] transition-colors">
              All Vendors
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-900">{mockVendorProfile.fullName}</span>
          </div>

          {/* Profile block */}
          <VendorProfileHeader data={mockVendorProfile} />

          {/* Form grid, Statuses, and Locations */}
          <VendorDetailsGrid data={mockVendorProfile} />

          {/* Vendor specific Event list */}
          <VendorEventsTable data={mockVendorEvents} />

        </div>
      </main>
    </>
  );
}