import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Topbar } from '@/components/layout/topbar'; // Note: Match your lowercase file layout configuration
import { AddPackageForm } from '@/components/dashboard/subscriptions/AddPackageForm';

export default function AddSubscriptionPackagePage() {
  return (
    <>
      <Topbar title="Subscriptions" />
      
      {/* 
        Main content wrapper with slightly grey background 
        so the pure white layout forms and benefit rows stand out.
      */}
      <main className="flex-1 p-4 md:p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        <div className="max-w-[1100px]">
          
          {/* Breadcrumbs matching layout specification */}
          <div className="flex items-center gap-2 text-[15px] font-medium mb-10 select-none">
            <Link href="/dashboard/subscriptions" className="text-neutral-900 hover:text-[#6312E1] transition-colors">
              Subscription
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-900">Add new package</span>
          </div>

          {/* Interactive Dynamic Form */}
          <AddPackageForm />

        </div>
      </main>
    </>
  );
}