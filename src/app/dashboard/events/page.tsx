import React from 'react';
import { Topbar } from '@/components/layout/topbar';
import Link from 'next/link';

export default function AllEventsPage() {
  return (
    <>
      <Topbar title="All Events" />
      <main className="flex-1 p-8 bg-[#F8F9FA] flex flex-col items-center justify-center text-center">
        <div className="max-w-md bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-[#F4ECFF] rounded-2xl flex items-center justify-center text-[#6312E1] mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Events Directory</h2>
          <p className="text-sm text-neutral-500">Click the button below to view the detailed visual specification layout we designed.</p>
          <Link href="/dashboard/events/001294" className="w-full mt-2">
            <button className="w-full h-12 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold rounded-xl transition-colors">
              Go to Event Details
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}