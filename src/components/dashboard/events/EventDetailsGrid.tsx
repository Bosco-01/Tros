import React from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { EventDetailsData } from '@/data/event-details';

interface EventDetailsGridProps {
  data: EventDetailsData;
  eventId: string; // Added dynamic eventId prop
}

const DetailField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[15px] font-medium text-neutral-500">{label}</label>
    <div className="bg-white rounded-xl px-5 h-14 flex items-center justify-between text-[16px] font-bold text-neutral-900 w-full shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] border border-neutral-100/50">
      {children}
    </div>
  </div>
);

export const EventDetailsGrid: React.FC<EventDetailsGridProps> = ({ data, eventId }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8 w-full max-w-[1100px]">
      
      {/* Row 1: Category & Event Type */}
      <DetailField label="Category">
        <span>{data.category}</span>
      </DetailField>
      
      <DetailField label="Event Type">
        <span>{data.eventType}</span>
      </DetailField>

      {/* Row 2: Title & Total Users (Linked to nested Event Users page) */}
      <DetailField label="Title">
        <span>{data.title}</span>
      </DetailField>

      <DetailField label="Total Users">
        <span>{data.totalUsers}</span>
        {/* Dynamic redirection link added here */}
        <Link 
          href={`/dashboard/events/${eventId}/users`}
          className="text-sm font-semibold text-neutral-500 flex items-center hover:text-[#6312E1] transition-colors focus:outline-none select-none"
        >
          View all Users <ChevronRight className="w-4 h-4 ml-0.5" />
        </Link>
      </DetailField>

      {/* Row 3: Price & Date and Time */}
      <DetailField label="Price">
        <span>{data.price}</span>
      </DetailField>

      <DetailField label="Date and Time">
        <span>{data.dateTime}</span>
      </DetailField>

      {/* Row 4: Status & Ratings/Reviews */}
      <DetailField label="Status">
        <span className="text-neutral-950">{data.status}</span>
        <ChevronDown className="w-4 h-4 text-neutral-500" />
      </DetailField>

      <DetailField label="Ratings and Reviews">
        <div className="flex items-center gap-1.5 text-neutral-900">
          <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          <span>{data.rating.toFixed(1)}</span>
          <span className="text-neutral-500 font-medium">({data.reviewsCount})</span>
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-400" />
      </DetailField>

    </div>
  );
};