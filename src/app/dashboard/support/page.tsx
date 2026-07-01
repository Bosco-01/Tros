'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Topbar } from '@/components/layout/topbar';
import { SupportFilters } from '@/components/dashboard/support/SupportFilters';
import { SupportTicketsTable } from '@/components/dashboard/support/SupportTicketsTable';
import { adminService } from '@/services/adminService';
import { unwrapList } from '@/lib/api-helpers';
import { mapSupportTicketToRow } from '@/lib/mappers';
import type { SupportTicket } from '@/types/admin';
import type { SupportTicketRow } from '@/data/support';
import { LoadingState, ErrorState, EmptyState, PageShell } from '@/components/ui/AsyncStates';

export default function SupportPlatformPage() {
  const [tickets, setTickets] = useState<SupportTicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.listSupportTickets(1, 50);
      setTickets((unwrapList(res) as SupportTicket[]).map(mapSupportTicketToRow));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <Topbar title="Support" />
      <PageShell>
        <SupportFilters />
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : tickets.length === 0 ? (
          <EmptyState message="No support tickets found." />
        ) : (
          <div className="w-full">
            <SupportTicketsTable data={tickets} />
          </div>
        )}
      </PageShell>
    </>
  );
}
