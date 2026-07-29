import React from 'react';
import Link from 'next/link';
import { Topbar } from '@/components/layout/topbar';

export default function CreateVendorPage() {
  return (
    <>
      <Topbar title="Create Vendor" />
      <main className="min-h-screen w-full bg-[#F4F4F5] flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-neutral-100 p-8 shadow-sm text-center">
          <h1 className="text-xl font-bold text-neutral-900 mb-3">Vendor self-registration only</h1>
          <p className="text-sm text-neutral-600 leading-relaxed mb-6">
            Admins cannot create vendor accounts from the dashboard. Vendors must register in the
            Trios app and complete their profile (KYC). You can review and approve vendors from the
            Vendor Directory.
          </p>
          <Link
            href="/dashboard/vendors"
            className="inline-flex h-11 px-6 items-center justify-center rounded-full bg-[#6312E1] text-white font-bold text-sm hover:bg-[#520cbd]"
          >
            Back to vendors
          </Link>
        </div>
      </main>
    </>
  );
}
