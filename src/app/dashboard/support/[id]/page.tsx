'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { TicketDetailsForm } from '@/components/dashboard/support/TicketDetailsForm';
import { adminService } from '@/services/adminService';
import { mapSupportTicketToDetails } from '@/lib/mappers';
import type { TicketDetailsData } from '@/data/ticket-details';
import { LoadingState, ErrorState } from '@/components/ui/AsyncStates';

export default function TicketDetailsPage() {
  const params = useParams();
  const ticketId = String(params.id || '');
  const [data, setData] = useState<TicketDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!ticketId) return;
    setLoading(true);
    setError('');
    try {
      const ticket = await adminService.getSupportTicket(ticketId);
      setData(mapSupportTicketToDetails(ticket));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ticket');
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <main className="min-h-screen w-full bg-[#F4F4F5] flex items-center justify-center p-4 md:p-6">
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : data ? (
        <TicketDetailsForm data={data} ticketId={ticketId} />
      ) : null}
    </main>
  );
}
