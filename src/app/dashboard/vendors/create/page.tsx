import React from 'react';
import { Topbar } from '@/components/layout/topbar';
import { CreateVendorForm } from '@/components/dashboard/vendors/CreateVendorForm';

export default function CreateVendorPage() {
  return (
    <>
      <Topbar title="Create Vendor" />
      <main className="min-h-screen w-full bg-[#F4F4F5] flex items-start justify-center p-6 md:p-10">
        <CreateVendorForm />
      </main>
    </>
  );
}
