import React from 'react';
import { TicketDetailsForm } from '@/components/dashboard/support/TicketDetailsForm';
import { mockTicketDetails } from '@/data/ticket-details';

export default function TicketDetailsPage() {
  return (
    <>
      {/* 
        Main content wrapper with slightly grey background 
        so the pure white layout form stands out.
      */}
      <main className="min-h-screen w-full bg-[#F4F4F5] flex items-center justify-center p-6">
        <TicketDetailsForm data={mockTicketDetails} />
      </main>
    </>
  );
}