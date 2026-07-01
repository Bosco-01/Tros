'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Topbar } from '@/components/layout/topbar';
import { EventsTable } from '@/components/dashboard/events/EventsTable';
import { adminService } from '@/services/adminService';
import { unwrapList, unwrapTotal } from '@/lib/api-helpers';
import { mapAdminEventToRow } from '@/lib/mappers';
import type { EventRowData, AdminEvent } from '@/types/admin';
import { LoadingState, ErrorState, PageShell } from '@/components/ui/AsyncStates';

export default function AllEventsPage() {
  const [rows, setRows] = useState<EventRowData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.listEvents(page, 20);
      const list = unwrapList<AdminEvent>(res).map(mapAdminEventToRow);
      setRows(list);
      setTotalPages(Math.max(1, Math.ceil(unwrapTotal(res, list.length) / 20)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <Topbar title="All Events" />
      <PageShell title="Events Directory" subtitle="Manage platform events and cancellation requests.">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : (
          <EventsTable data={rows} page={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </PageShell>
    </>
  );
}
