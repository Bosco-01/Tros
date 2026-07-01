'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Topbar } from '@/components/layout/topbar';
import { UserProfileHeader } from '@/components/dashboard/users/UserProfileHeader';
import { UserDetailsGrid } from '@/components/dashboard/users/UserDetailsGrid';
import { UserEventsTable } from '@/components/dashboard/users/UserEventsTable';
import { adminService } from '@/services/adminService';
import { unwrapList } from '@/lib/api-helpers';
import { mapBookingToEventRow, mapUserToProfile } from '@/lib/mappers';
import type { UserProfileData, EventRowData, UserBooking } from '@/types/admin';
import { LoadingState, ErrorState, PageShell } from '@/components/ui/AsyncStates';

export default function UserDetailsPage() {
  const params = useParams();
  const userId = decodeURIComponent(String(params.id));
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [bookings, setBookings] = useState<EventRowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [user, bookingsRes] = await Promise.all([
        adminService.getUserDetail(userId),
        adminService.getUserBookings(userId, 1, 20),
      ]);
      const bookingList = unwrapList<UserBooking>(bookingsRes);
      setProfile(mapUserToProfile(user, bookingList.length));
      setBookings(bookingList.map(mapBookingToEventRow));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'User not found');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleStatus = async () => {
    if (!profile) return;
    setStatusLoading(true);
    try {
      const nextActive = profile.status !== 'Active';
      await adminService.updateUserStatus(userId, nextActive);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update status');
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <>
      <Topbar title="User Details" />
      {loading ? (
        <LoadingState />
      ) : error || !profile ? (
        <ErrorState message={error || 'User not found'} onRetry={load} />
      ) : (
        <PageShell>
          <div className="max-w-[1100px] w-full">
            <div className="flex items-center gap-2 text-sm font-medium mb-6 sm:mb-10 flex-wrap">
              <Link href="/dashboard/users" className="text-neutral-900 hover:text-[#6312E1]">
                All Users
              </Link>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
              <span className="text-neutral-900">{profile.fullName}</span>
            </div>

            <UserProfileHeader data={profile} />
            <UserDetailsGrid data={profile} />

            <div className="flex gap-3 mb-6">
              <button
                type="button"
                disabled={statusLoading}
                onClick={() => void toggleStatus()}
                className="px-5 py-2.5 rounded-xl bg-[#6312E1] text-white text-sm font-bold disabled:opacity-60"
              >
                {profile.status === 'Active' ? 'Deactivate User' : 'Activate User'}
              </button>
            </div>

            <UserEventsTable data={bookings} />
          </div>
        </PageShell>
      )}
    </>
  );
}
