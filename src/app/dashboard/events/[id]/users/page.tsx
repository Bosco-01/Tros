import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Topbar } from '@/components/layout/topbar';

import { EventUsersFilter } from '@/components/dashboard/events/EventUsersFilter';
import { EventUserCard } from '@/components/dashboard/events/EventUserCard';

import { mockEventUsers } from '@/data/event-users';
import { mockEventDetails } from '@/data/event-details';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventUsersPage({ params }: PageProps) {
  // Resolve dynamic promise parameter
  const resolvedParams = await params;
  const eventId = resolvedParams.id;

  return (
    <>
      <Topbar title="Event Details" />
      
      {/* 
        Main content wrapper with slightly grey background 
        so the pure white user cards stand out.
      */}
      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        <div className="max-w-[1100px]">
          
          {/* Breadcrumbs matching visual layout */}
          <div className="flex items-center gap-2 text-[15px] font-medium mb-10 select-none">
            <Link href="/dashboard/vendors" className="text-neutral-900 hover:text-[#6312E1] transition-colors">
              All Vendors
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-900">John Doe</span>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
            <Link href={`/dashboard/events/${eventId}`} className="text-neutral-900 hover:text-[#6312E1] transition-colors">
              {mockEventDetails.title}
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-900">Users</span>
          </div>

          {/* Search/Filter bar headers */}
          <EventUsersFilter />

          {/* User Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {mockEventUsers.map((user, index) => (
              <EventUserCard key={index} data={user} />
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between w-full mt-4">
            <span className="text-[15px] font-semibold text-neutral-900">1 of 88</span>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-lg bg-[#6312e1] text-white text-sm font-bold flex items-center justify-center">1</button>
              {[2, 3, 4, 5].map((page) => (
                <button key={page} className="w-9 h-9 rounded-lg bg-[#F4F4F5] text-neutral-700 text-sm font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center">
                  {page}
                </button>
              ))}
              <span className="w-9 h-9 flex items-center justify-center bg-[#F4F4F5] text-neutral-700 rounded-lg font-bold text-sm tracking-widest">...</span>
              <button className="w-10 h-9 rounded-lg bg-[#F4F4F5] text-neutral-700 text-sm font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center">
                88
              </button>
            </div>
            <div className="w-16 hidden md:block"></div>
          </div>

        </div>
      </main>
    </>
  );
}