import React from 'react';
import { Topbar } from '@/components/layout/topbar'; // Note: Matches your lowercase layout file on disk
import { SupportFilters } from '@/components/dashboard/support/SupportFilters';
import { SupportTicketsTable } from '@/components/dashboard/support/SupportTicketsTable';
import { mockSupportTickets } from '@/data/support';

export default function SupportPlatformPage() {
  return (
    <>
      {/* 
        Specifies the main topbar title as "Support" 
        matching the mockup screenshot header perfectly.
      */}
      <Topbar title="Support" />
      
      {/* 
        Main content wrapper with slightly grey background 
        so the pure white filter bars and table frames stand out.
      */}
      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        
        {/* Rounded filter and switcher pills */}
        <SupportFilters />

        {/* Dynamic Ticket Database */}
        <div className="w-full">
          <SupportTicketsTable data={mockSupportTickets} />
        </div>

      </main>
    </>
  );
}