'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Topbar } from '@/components/layout/topbar';
import { EventUsersFilter } from '@/components/dashboard/events/EventUsersFilter';
import { EventUserCard } from '@/components/dashboard/events/EventUserCard';
import { adminService } from '@/services/adminService';
import { unwrapList } from '@/lib/api-helpers';
import type { AdminEventBooking, AdminEventDetail } from '@/types/admin';
import type { EventUserCardData } from '@/data/event-users';
import { LoadingState, ErrorState, EmptyState, PageShell } from '@/components/ui/AsyncStates';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=faces';

function mapBookingToCard(booking: AdminEventBooking): EventUserCardData {
  const qty = booking.quantity ?? 1;
  return {
    id: booking.booking_reference || booking.booking_id,
    name: booking.user_name || booking.user_email || 'Attendee',
    ticketQty: `${qty} ticket${qty === 1 ? '' : 's'}`,
    dateTime: booking.booked_at || '',
    avatarUrl: booking.profile_picture || DEFAULT_AVATAR,
  };
}

export default function EventUsersPage() {
  const params = useParams();
  const eventId = decodeURIComponent(String(params.id || ''));
  const [event, setEvent] = useState<AdminEventDetail | null>(null);
  const [bookings, setBookings] = useState<AdminEventBooking[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    setError('');
    try {
      const [detail, bookingRes] = await Promise.all([
        adminService.getEventDetail(eventId),
        adminService.listEventBookings(eventId, 1, 100),
      ]);
      setEvent(detail);
      setBookings(unwrapList<AdminEventBooking>(bookingRes));
    } catch (err) {
      setEvent(null);
      setBookings([]);
      setError(err instanceof Error ? err.message : 'Failed to load event attendees');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    void load();
  }, [load]);

  const cards = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings
      .map(mapBookingToCard)
      .filter((card) => {
        if (!q) return true;
        return card.name.toLowerCase().includes(q) || card.id.toLowerCase().includes(q);
      });
  }, [bookings, search]);

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
            <Link
              href={`/dashboard/events/${eventId}`}
              className="text-neutral-900 hover:text-[#6312E1] transition-colors truncate max-w-[200px] sm:max-w-none"
            >
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
              <EventUsersFilter
                totalCount={bookings.length}
                search={search}
                onSearchChange={setSearch}
              />
              {cards.length === 0 ? (
                <EmptyState message="No attendees found for this event." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cards.map((card) => (
                    <EventUserCard key={card.id} data={card} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </PageShell>
    </>
  );
}
