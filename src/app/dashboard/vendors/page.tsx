'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Topbar } from '@/components/layout/topbar';
import { VendorFilters } from '@/components/dashboard/vendors/VendorFilters';
import { VendorsTable } from '@/components/dashboard/vendors/VendorsTable';
import { adminService } from '@/services/adminService';
import { unwrapList, unwrapTotal } from '@/lib/api-helpers';
import { mapVendorToRow } from '@/lib/mappers';
import type { VendorRowData, AdminVendor } from '@/types/admin';
import { LoadingState, ErrorState, PageShell } from '@/components/ui/AsyncStates';

export default function AllVendorsPage() {
  const [rows, setRows] = useState<VendorRowData[]>([]);
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
      setRows(list);
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

  return (
    <>
      <Topbar title="All Vendors" />
      <PageShell>
        <VendorFilters
          search={search}
          status={status}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          onStatusChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          onSubmit={() => void load()}
        />

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : (
          <VendorsTable data={rows} page={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </PageShell>
    </>
  );
}
