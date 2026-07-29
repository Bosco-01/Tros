'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Topbar } from '@/components/layout/topbar';
import { VendorFilters } from '@/components/dashboard/vendors/VendorFilters';
import { VendorsTable } from '@/components/dashboard/vendors/VendorsTable';
import { adminService } from '@/services/adminService';
import { unwrapList, unwrapTotal } from '@/lib/api-helpers';
import { mapVendorToRow } from '@/lib/mappers';
import type { VendorRowData, AdminVendor } from '@/types/admin';
import { LoadingState, ErrorState, PageShell } from '@/components/ui/AsyncStates';

export default function AllVendorsPage() {
  const [vendors, setVendors] = useState<VendorRowData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.listVendors({
        page,
        limit: 20,
        search: search || undefined,
        status: status || undefined,
      });

      const list = unwrapList<AdminVendor>(res).map(mapVendorToRow);
      const total = unwrapTotal(res, list.length);

      // Merge any newly created local vendors from localStorage if present
      let combinedList = list;
      if (page === 1) {
        const stored = localStorage.getItem('trios_custom_vendors');
        if (stored) {
          try {
            const customVendors = JSON.parse(stored);
            combinedList = [...customVendors, ...list];
          } catch (e) {
            console.error('Failed to parse local vendors:', e);
          }
        }
      }

      setVendors(combinedList);
      setTotalPages(Math.max(1, Math.ceil(total / 20)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSearchSubmit = () => {
    setPage(1);
    void load();
  };

  return (
    <>
      <Topbar title="All Vendors" />
      <PageShell>
        <div className="flex items-center justify-between gap-4 mb-8 w-full max-w-[1100px] select-none">
          <h2 className="text-xl md:text-[22px] font-bold text-neutral-900 tracking-tight">
            Vendor Directory
          </h2>
          <Link href="/dashboard/vendors/create">
            <button className="flex items-center gap-2.5 px-6 py-3 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold text-sm rounded-full transition-colors focus:outline-none shadow-sm shadow-[#6312E1]/10">
              <div className="w-5 h-5 bg-white text-[#6312E1] flex items-center justify-center rounded-md font-extrabold text-xs">
                +
              </div>
              <span>Create Vendor</span>
            </button>
          </Link>
        </div>

        <VendorFilters
          search={search}
          status={status}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          onStatusChange={(val) => {
            setStatus(val);
            setPage(1);
          }}
          onSubmit={handleSearchSubmit}
        />

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : (
          <div className="w-full">
            <VendorsTable
              data={vendors}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </PageShell>
    </>
  );
}