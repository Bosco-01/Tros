'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Topbar } from '@/components/layout/topbar';
import {
  SupportFilters,
  type SupportFilterKey,
} from '@/components/dashboard/support/SupportFilters';
import { SupportTicketsTable } from '@/components/dashboard/support/SupportTicketsTable';
import { DisputesTable } from '@/components/dashboard/support/DisputesTable';
import { adminService } from '@/services/adminService';
import { unwrapList } from '@/lib/api-helpers';
import { mapSupportTicketToRow } from '@/lib/mappers';
import type { SupportTicket } from '@/types/admin';
import type { SupportTicketRow } from '@/data/support';
import type { DisputeRowData } from '@/data/disputes';
import { LoadingState, ErrorState, EmptyState, PageShell } from '@/components/ui/AsyncStates';

type SupportTab = 'tickets' | 'disputes';

function normalizeStatus(status?: string) {
  return (status || '').toLowerCase();
}

export default function SupportPlatformPage() {
  const [tab, setTab] = useState<SupportTab>('tickets');
  const [tickets, setTickets] = useState<SupportTicketRow[]>([]);
  const [disputes, setDisputes] = useState<DisputeRowData[]>([]);
  const [filter, setFilter] = useState<SupportFilterKey>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.listSupportTickets(1, 100);
      setTickets((unwrapList(res) as SupportTicket[]).map(mapSupportTicketToRow));
    } catch (err) {
      setTickets([]);
      setError(err instanceof Error ? err.message : 'Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDisputes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.listDisputes(1, 50);
      const list = unwrapList(res) as DisputeRowData[];
      setDisputes(list);
    } catch (err) {
      setDisputes([]);
      setError(err instanceof Error ? err.message : 'Failed to load disputes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'tickets') void loadTickets();
    else void loadDisputes();
  }, [tab, loadTickets, loadDisputes]);

  const counts = useMemo(() => {
    const answered = tickets.filter((t) =>
      ['answered', 'resolved'].includes(normalizeStatus(t.status)),
    ).length;
    const pending = tickets.filter((t) =>
      ['pending', 'open', 'in_progress'].includes(normalizeStatus(t.status)),
    ).length;
    const closed = tickets.filter((t) =>
      ['closed', 'completed'].includes(normalizeStatus(t.status)),
    ).length;
    return { all: tickets.length, answered, pending, closed };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter((t) => {
      const status = normalizeStatus(t.status);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'answered' && ['answered', 'resolved'].includes(status)) ||
        (filter === 'pending' && ['pending', 'open', 'in_progress'].includes(status)) ||
        (filter === 'closed' && ['closed', 'completed'].includes(status));

      const haystack =
        `${t.ticketId || ''} ${t.subject || ''} ${t.customerName || ''} ${t.customerEmail || ''}`.toLowerCase();
      const matchesSearch = !q || haystack.includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [tickets, filter, search]);

  return (
    <>
      <Topbar title="Support" />
      <PageShell>
        <div className="flex flex-wrap gap-3 mb-6">
          {([
            { key: 'tickets', label: 'Tickets' },
            { key: 'disputes', label: 'Disputes' },
          ] as const).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm border transition-all ${
                tab === item.key
                  ? 'bg-[#6312E1] border-[#6312E1] text-white'
                  : 'bg-white border-neutral-100 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'tickets' ? (
          <>
            <SupportFilters
              counts={counts}
              activeFilter={filter}
              onFilterChange={setFilter}
              search={search}
              onSearchChange={setSearch}
              onSearchSubmit={() => undefined}
            />
            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState message={error} onRetry={loadTickets} />
            ) : filteredTickets.length === 0 ? (
              <EmptyState message="No support tickets found." />
            ) : (
              <div className="w-full">
                <SupportTicketsTable data={filteredTickets} />
              </div>
            )}
          </>
        ) : loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={loadDisputes} />
        ) : (
          <DisputesTable data={disputes} />
        )}
      </PageShell>
    </>
  );
}
