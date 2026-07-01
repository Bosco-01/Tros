'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Topbar } from '@/components/layout/topbar';
import { EventBanner } from '@/components/dashboard/events/EventBanner';
import { EventActionButtons } from '@/components/dashboard/events/EventActionButtons';
import { adminService } from '@/services/adminService';
import type { AdminEventDetail } from '@/types/admin';
import { formatCurrency, formatDate } from '@/lib/api-helpers';
import { LoadingState, ErrorState, PageShell } from '@/components/ui/AsyncStates';

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = decodeURIComponent(String(params.id));
  const [event, setEvent] = useState<AdminEventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getEventDetail(eventId);
      setEvent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Event not found');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleApproveCancellation = async () => {
    try {
      await adminService.approveEventCancellation(eventId);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    }
  };

  return (
    <>
      <Topbar title="Event Details" />
      {loading ? (
        <LoadingState />
      ) : error || !event ? (
        <ErrorState message={error || 'Event not found'} onRetry={load} />
      ) : (
        <PageShell>
          <div className="max-w-[1100px] w-full">
            <div className="flex items-center gap-2 text-sm font-medium mb-6 flex-wrap">
              <Link href="/dashboard/events" className="hover:text-[#6312E1]">
                All Events
              </Link>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
              <span>{event.title}</span>
            </div>

            <EventBanner url={event.cover_image_url || ''} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-6">
              {[
                ['Category', event.category],
                ['Event Type', event.event_type],
                ['Title', event.title],
                ['Vendor', event.vendor_name],
                ['Price', formatCurrency(event.price)],
                ['Date', formatDate(event.date_time)],
                ['Status', event.status],
                ['Venue', event.venue_name || '—'],
                ['Address', event.venue_address || '—'],
                ['Total Users', String(event.total_users)],
                ['Rating', `${event.rating} (${event.review_count} reviews)`],
              ].map(([label, value]) => (
                <div key={label} className="bg-white rounded-xl border border-neutral-100 p-4">
                  <p className="text-sm text-neutral-500 mb-1">{label}</p>
                  <p className="font-bold text-neutral-900">{value}</p>
                </div>
              ))}
            </div>

            {event.description && (
              <div className="bg-white rounded-xl border border-neutral-100 p-4 mb-6">
                <p className="text-sm text-neutral-500 mb-2">Description</p>
                <p className="text-neutral-800 leading-relaxed">{event.description}</p>
              </div>
            )}

            {event.status === 'pending_cancellation' && (
              <EventActionButtons onApprove={handleApproveCancellation} />
            )}
          </div>
        </PageShell>
      )}
    </>
  );
}
