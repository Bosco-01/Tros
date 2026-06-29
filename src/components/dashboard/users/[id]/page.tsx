import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";

import { UserProfileHeader } from "@/components/dashboard/users/UserProfileHeader";
import { UserDetailsGrid } from "@/components/dashboard/users/UserDetailsGrid";
import { UserEventsTable } from "@/components/dashboard/users/UserEventsTable";

import { mockUserProfile, mockUserEvents } from "@/data/user-details";

export default function UserDetailsPage() {
  return (
    <>
      <Topbar title="All Users" />
      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        <div className="max-w-[1100px]">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[15px] font-medium mb-10">
            <Link
              href="/dashboard/users"
              className="text-neutral-900 hover:text-[#6312E1] transition-colors"
            >
              All Users
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-900">{mockUserProfile.fullName}</span>
          </div>

          <UserProfileHeader data={mockUserProfile} />
          <UserDetailsGrid data={mockUserProfile} />
          <UserEventsTable data={mockUserEvents} />
        </div>
      </main>
    </>
  );
}
