import React from 'react';
import { CreateEventForm } from '@/components/dashboard/events/CreateEventForm';

export default function CreateEventPage() {
  return (
    /* 
      Renders the page with a clean background matching 
      the Figma overlay/modal presentation perfectly.
    */
    <main className="min-h-screen w-full bg-[#F4F4F5] flex items-center justify-center p-6">
      <CreateEventForm />
    </main>
  );
}