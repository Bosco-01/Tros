'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Topbar } from '@/components/layout/topbar';
import { UsersTable } from '@/components/dashboard/UsersTable';
import { adminService } from '@/services/adminService';
import { unwrapList, unwrapTotal } from '@/lib/api-helpers';
import { mapUserToRow } from '@/lib/mappers';
import type { UserRowData, AppUser } from '@/types/admin';
import { LoadingState, ErrorState, PageShell } from '@/components/ui/AsyncStates';

export default function AllUsersPage() {
  const [rows, setRows] = useState<UserRowData[]>([]);
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
      const res = await adminService.listUsers({
        page,
        limit: 20,
        search: search || undefined,
        status: status || undefined,
      });
      const list = unwrapList<AppUser>(res).map(mapUserToRow);
      const total = unwrapTotal(res, list.length);
      setRows(list);
      setTotalPages(Math.max(1, Math.ceil(total / 20)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <Topbar title="All Users" />
      <PageShell title="User Management" subtitle="View and manage all registered users on the platform.">
        <div className="flex flex-col sm:flex-row gap-3 mb-6 max-w-[1100px]">
          <input
            type="search"
            placeholder="Search name or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 h-12 px-4 rounded-xl border border-neutral-200 text-sm"
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="h-12 px-4 rounded-xl border border-neutral-200 text-sm bg-white"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            type="button"
            onClick={() => void load()}
            className="h-12 px-6 bg-[#6312E1] text-white font-bold rounded-xl text-sm"
          >
            Search
          </button>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : (
          <UsersTable data={rows} page={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </PageShell>
    </>
  );
}
