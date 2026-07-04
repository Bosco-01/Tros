'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, FileCheck, CheckCircle2, XCircle } from 'lucide-react';
import { Topbar } from '@/components/layout/topbar';
import { VendorProfileHeader } from '@/components/dashboard/vendors/VendorProfileHeader';
import { VendorDetailsGrid } from '@/components/dashboard/vendors/VendorDetailsGrid';
import { UserEventsTable } from '@/components/dashboard/users/UserEventsTable';
import { adminService } from '@/services/adminService';
import { unwrapList, unwrapEntity } from '@/lib/api-helpers';
import { mapVendorToProfile, mapAdminEventToRow } from '@/lib/mappers';
import type {
  AdminEvent,
  AdminVendorDetail,
  VendorKYC,
  VendorProfileData,
  EventRowData,
} from '@/types/admin';
import { ErrorState } from '@/components/ui/AsyncStates';

export default function VendorDetailsPage() {
  const params = useParams();
  const vendorId = String(params?.id ?? '');

  const [profile, setProfile] = useState<VendorProfileData | null>(null);
  const [events, setEvents] = useState<EventRowData[]>([]);
  const [kycData, setKycData] = useState<VendorKYC | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!vendorId) return;

    const fetchVendorData = async () => {
      setLoading(true);
      setError('');

      try {
        const [vendorRes, kycRes, eventsRes] = await Promise.all([
          adminService.getVendorDetail(vendorId),
          adminService.getVendorKYC(vendorId),
          adminService.getVendorEvents(vendorId, 1, 50),
        ]);

        const vendor = unwrapEntity<AdminVendorDetail>(vendorRes) as AdminVendorDetail;
        const eventsList = unwrapList<AdminEvent>(eventsRes);
        const kycPayload = unwrapEntity<VendorKYC>(kycRes);

        setProfile(mapVendorToProfile(vendor, eventsList.length));
        setEvents(eventsList.map(mapAdminEventToRow));
        setKycData(kycPayload);

        const statusValue = (vendor?.verification_status || '').toString().toLowerCase();
        if (statusValue.includes('approve')) setVerificationStatus('approved');
        else if (statusValue.includes('reject')) setVerificationStatus('rejected');
        else setVerificationStatus('pending');
      } catch (err) {
        console.error('Failed to load vendor details', err);
        setError(err instanceof Error ? err.message : 'Failed to load vendor details');
      } finally {
        setLoading(false);
      }
    };

    void fetchVendorData();
  }, [vendorId]);

  const handleUpdateVerification = async (status: 'approved' | 'rejected') => {
    if (!vendorId) return;
    setActionLoading(true);
    setSuccess('');

    try {
      await adminService.updateVendorStatus(vendorId, {
        verification_status: status,
        is_active: status === 'approved',
      });
      setVerificationStatus(status);
      setSuccess(`Vendor account verification status updated to ${status} successfully!`);
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      console.error('Failed to update vendor status', err);
      setError(err instanceof Error ? err.message : 'Failed to update vendor status');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FDFDFE] min-h-screen">
        <svg className="animate-spin h-10 w-10 text-[#6312E1]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <>
      <Topbar title="Vendor Details" />
      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        <div className="max-w-[1100px] w-full">
          {error || !profile ? (
            <ErrorState message={error || 'Vendor not found'} onRetry={() => void window.location.reload()} />
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm font-medium mb-6 sm:mb-10 flex-wrap">
                <Link href="/dashboard/vendors" className="text-neutral-900 hover:text-[#6312E1]">
                  All Vendors
                </Link>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
                <span className="text-neutral-900">{profile.fullName}</span>
              </div>

              <VendorProfileHeader data={profile} />
              <VendorDetailsGrid data={profile} />

              <div className="w-full bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col gap-6 mb-10 select-none animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-neutral-50 pb-4">
                  <h3 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-[#6312E1]" /> KYC Document Verification Review
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-500">Current Verification:</span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                      verificationStatus === 'approved'
                        ? 'bg-[#E5F5E8] text-[#168E33]'
                        : verificationStatus === 'rejected'
                        ? 'bg-[#FFE8E8] text-[#D82F2F]'
                        : 'bg-[#E4E4E7] text-[#52525B]'
                    }`}>
                      {verificationStatus}
                    </span>
                  </div>
                </div>

                {kycData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2.5">
                      <span className="text-xs font-bold text-neutral-500 pl-1">Uploaded NIN Document</span>
                      <div className="w-full h-[220px] rounded-2xl overflow-hidden border border-neutral-100 bg-neutral-900 relative">
                        {kycData.nin_url ? (
                          <Image src={kycData.nin_url} alt="NIN" fill className="object-cover opacity-90" unoptimized />
                        ) : null}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <span className="text-xs font-bold text-neutral-500 pl-1">Uploaded CAC Business Document</span>
                      <div className="w-full h-[220px] rounded-2xl overflow-hidden border border-neutral-100 bg-neutral-900 relative">
                        {kycData.cac_url ? (
                          <Image src={kycData.cac_url} alt="CAC" fill className="object-cover opacity-90" unoptimized />
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-neutral-600">No KYC documents are available for this vendor.</div>
                )}

                {success && (
                  <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold transition-all">
                    {success}
                  </div>
                )}

                <div className="flex items-center gap-4 max-w-[400px] mt-2">
                  <button
                    onClick={() => void handleUpdateVerification('approved')}
                    disabled={actionLoading || verificationStatus === 'approved'}
                    className="flex-1 h-11 bg-[#BEF2CB] hover:bg-[#a6f0b8] disabled:opacity-50 text-[#168E33] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all select-none active:scale-[0.99]"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Verify KYC
                  </button>
                  <button
                    onClick={() => void handleUpdateVerification('rejected')}
                    disabled={actionLoading || verificationStatus === 'rejected'}
                    className="flex-1 h-11 bg-[#FFE8E8] hover:bg-[#fbdada] disabled:opacity-50 text-[#D82F2F] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all select-none active:scale-[0.99]"
                  >
                    <XCircle className="w-4 h-4" /> Reject KYC
                  </button>
                </div>
              </div>

              <UserEventsTable data={events} />
            </>
          )}
        </div>
      </main>
    </>
  );
}
