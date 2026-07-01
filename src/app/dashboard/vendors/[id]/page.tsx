'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Topbar } from '@/components/layout/topbar';
import { VendorProfileHeader } from '@/components/dashboard/vendors/VendorProfileHeader';
import { VendorDetailsGrid } from '@/components/dashboard/vendors/VendorDetailsGrid';
import { VendorEventsTable } from '@/components/dashboard/vendors/VendorEventsTable';
import { adminService } from '@/services/adminService';
import { mapAdminEventToRow, mapVendorToProfile } from '@/lib/mappers';
import type { VendorProfileData, EventRowData } from '@/types/admin';
import { LoadingState, ErrorState, PageShell } from '@/components/ui/AsyncStates';

export default function VendorDetailsPage() {
  const params = useParams();
  const vendorId = decodeURIComponent(String(params.id));
  const [profile, setProfile] = useState<VendorProfileData | null>(null);
  const [events, setEvents] = useState<EventRowData[]>([]);
  const [kycNote, setKycNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [bundle, kyc] = await Promise.all([
        adminService.getVendorPageBundle(vendorId, 1, 20),
        adminService.getVendorKYC(vendorId).catch(() => null),
      ]);
      setProfile(mapVendorToProfile(bundle.vendor, bundle.total_events));
      setEvents((bundle.events || []).map(mapAdminEventToRow));
      if (kyc) {
        setKycNote(
          [kyc.business_name, kyc.cac_registered_number, kyc.verification_status]
            .filter(Boolean)
            .join(' · ') || 'KYC documents on file',
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Vendor not found');
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateStatus = async (verification_status: 'approved' | 'rejected' | 'pending') => {
    setActionLoading(true);
    try {
      await adminService.updateVendorStatus(vendorId, {
        verification_status,
        is_active: verification_status === 'approved',
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update vendor');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <Topbar title="Vendor Details" />
      {loading ? (
        <LoadingState />
      ) : error || !profile ? (
        <ErrorState message={error || 'Vendor not found'} onRetry={load} />
      ) : (
        <PageShell>
          <div className="max-w-[1100px] w-full">
            <div className="flex items-center gap-2 text-sm font-medium mb-6 flex-wrap">
              <Link href="/dashboard/vendors" className="hover:text-[#6312E1]">
                All Vendors
              </Link>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
              <span>{profile.fullName}</span>
            </div>

            <VendorProfileHeader data={profile} />
            <VendorDetailsGrid data={profile} />

            {kycNote && (
              <p className="text-sm text-neutral-600 mb-4 bg-white border border-neutral-100 rounded-xl p-4">
                KYC: {kycNote}
              </p>
            )}

            <div className="flex flex-wrap gap-3 mb-6">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => void updateStatus('approved')}
                className="px-5 py-2.5 rounded-xl bg-[#168E33] text-white text-sm font-bold"
              >
                Approve
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => void updateStatus('rejected')}
                className="px-5 py-2.5 rounded-xl bg-[#D82F2F] text-white text-sm font-bold"
              >
                Reject
              </button>
            </div>

            <VendorEventsTable data={events} />
          </div>
        </PageShell>
      )}
    </>
  );
}
