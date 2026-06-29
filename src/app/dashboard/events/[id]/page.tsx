import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";

import { EventBanner } from "@/components/dashboard/events/EventBanner";
import { EventDetailsGrid } from "@/components/dashboard/events/EventDetailsGrid";
import { RefundFormCard } from "@/components/dashboard/events/RefundFormCard";
import { EventActionButtons } from "@/components/dashboard/events/EventActionButtons";

import { mockEventDetails } from "@/data/event-details";

export default function EventDetailsPage() {
  return (
    <>
      <Topbar title="Event Details" />

      {/* 
        Main content wrapper with slightly grey background 
        to ensure visual pop of white input containers.
      */}
      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        <div className="max-w-[1100px]">
          {/* Breadcrumbs matching layout specification */}
          <div className="flex items-center gap-2 text-[15px] font-medium mb-10 select-none">
            <Link
              href="/dashboard/vendors"
              className="text-neutral-900 hover:text-[#6312E1] transition-colors"
            >
              All Vendors
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-900">John Doe</span>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-900">{mockEventDetails.title}</span>
          </div>

          {/* Large Header Banner */}
          <EventBanner url={mockEventDetails.bannerUrl} />

          {/* Field Attribute Grid */}
          <EventDetailsGrid
            data={mockEventDetails}
            eventId={mockEventDetails.id}
          />

          {/* Refund accordion placeholder */}
          <RefundFormCard />

          {/* Mint and Pink Action buttons */}
          <EventActionButtons />
        </div>
      </main>
    </>
  );
}
