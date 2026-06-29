import React from 'react';
import { AddAdminForm } from '@/components/dashboard/admins/AddAdminForm';

export default function AddAdminPage() {
  return (
    /* 
      Renders the page with a clean background matching 
      the Figma overlay/modal presentation.
    */
    <main className="min-h-screen w-full bg-[#F4F4F5] flex items-center justify-center p-6">
      <AddAdminForm />
    </main>
  );
}