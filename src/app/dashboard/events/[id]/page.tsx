'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Topbar } from '@/components/layout/topbar'; // Note: Matches lowercase filename on disk

import { EventDetailsManager } from '@/components/dashboard/events/EventDetailsManager';
import { EventReviewsSection } from '@/components/dashboard/events/EventReviewsSection';

import { mockEventDetails, mockEventReviews, EventDetailsData } from '@/data/event-details';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailsPage({ params }: PageProps) {
  // Gracefully unwrap dynamic route parameters under React 19 rules
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  const [eventData, setEventData] = useState<EventDetailsData>(mockEventDetails);
  const [success, setSuccess] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSaveData = (updated: EventDetailsData) => {
    setEventData(updated);
  };

  const handleCreateWorkflow = () => {
    setIsCreating(true);
    setSuccess('');
    
    // Simulate endpoint registration success
    setTimeout(() => {
      setIsCreating(false);
      setSuccess('Event successfully launched on the live platform!');
      setTimeout(() => setSuccess(''), 2500);
    }, 1200);
  };

  return (
    <>
      <Topbar title="All Events" />
      
      {/* 
        Main content wrapper with slightly grey background 
        so the pure white layout forms and rating lists stand out.
      */}
      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        <div className="max-w-[1100px]">
          
          {/* Breadcrumbs matching design specifications */}
          <div className="flex items-center gap-2 text-[15px] font-medium mb-10 select-none">
            <Link href="/dashboard/vendors" className="text-neutral-900 hover:text-[#6312E1] transition-colors">
              All Vendors
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-900">John Doe</span>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-900">{eventData.title}</span>
          </div>

          {/* Unified dynamic Details Manager (View + Edit states) */}
          <EventDetailsManager initialData={eventData} onSave={handleSaveData} />

          {/* New Ratings and Reviews Section */}
          <EventReviewsSection reviews={mockEventReviews} averageRating={eventData.rating} />

          {/* Success toast alerts */}
          {success && (
            <div className="mt-8 p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold max-w-[540px] transition-all">
              {success}
            </div>
          )}

          {/* 
            ========================================================================
            ADMIN-CREATED EVENT WORKFLOW ACTIONS
            Approve/Disapprove buttons replaced with Create/Cancel triggers
            ========================================================================
          */}
          <div className="flex items-center gap-6 w-full max-w-[540px] mt-8">
            {/* Create Trigger */}
            <button 
              onClick={handleCreateWorkflow}
              disabled={isCreating}
              className="flex-1 h-12 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold text-base rounded-2xl transition-all active:scale-[0.99] flex items-center justify-center shadow-sm shadow-[#6312E1]/5"
            >
              {isCreating ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                'Create'
              )}
            </button>

            {/* Cancel Trigger */}
            <Link href="/dashboard/events" className="flex-1">
              <button 
                type="button"
                className="w-full h-12 bg-[#FFE8E8] hover:bg-[#fbdada] text-[#D82F2F] font-bold text-base rounded-2xl transition-all active:scale-[0.99] flex items-center justify-center shadow-sm"
              >
                Cancel
              </button>
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}