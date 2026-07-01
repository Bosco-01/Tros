'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Topbar } from '@/components/layout/topbar';
import { EventUsersFilter } from '@/components/dashboard/events/EventUsersFilter';
import { adminService } from '@/services/adminService';
import type { AdminEventDetail } from '@/types/admin';
import { LoadingState, ErrorState, EmptyState, PageShell } from '@/components/ui/AsyncStates';

export default function EventUsersPage() {
  const params = useParams();
  const eventId = decodeURIComponent(String(params.id || ''));
  const [event, setEvent] = useState<AdminEventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getEventDetail(eventId);
      setEvent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load event');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <Topbar title="Event Details" />
      <PageShell>
        <div className="max-w-[1100px] w-full">
          <div className="flex flex-wrap items-center gap-2 text-sm sm:text-[15px] font-medium mb-8 sm:mb-10 select-none">
            <Link href="/dashboard/events" className="text-neutral-900 hover:text-[#6312E1] transition-colors">
              Events
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-500 flex-shrink-0" />
            <Link href={`/dashboard/events/${eventId}`} className="text-neutral-900 hover:text-[#6312E1] transition-colors truncate max-w-[200px] sm:max-w-none">
              {event?.title || eventId}
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-500 flex-shrink-0" />
            <span className="text-neutral-900">Users</span>
          </div>

          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : (
            <>
              <EventUsersFilter />
              <EmptyState message="Event attendee list is not exposed by the admin API yet. Use user bookings for per-user event history." />
            </>
          )}
        </div>
      </PageShell>
    </>
  );
}
