import React from 'react';
import { CreateVendorForm } from '@/components/dashboard/vendors/CreateVendorForm';

export default function CreateVendorPage() {
  return (
    /* 
      Renders the page with a clean background matching 
      the Figma overlay/modal presentation perfectly.
    */
    <main className="min-h-screen w-full bg-[#F4F4F5] flex items-center justify-center p-6">
      <CreateVendorForm />
    </main>
  );
}