'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Topbar } from '@/components/layout/topbar';
import { TransactionsTable } from '@/components/dashboard/transactions/TransactionsTable';
import { adminService } from '@/services/adminService';
import { unwrapList, unwrapTotal } from '@/lib/api-helpers';
import { mapTransactionToRow } from '@/lib/mappers';
import type { TransactionRowData, TransactionRow } from '@/types/admin';
import { LoadingState, ErrorState, PageShell } from '@/components/ui/AsyncStates';

export default function TransactionsPage() {
  const [rows, setRows] = useState<TransactionRowData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.listTransactions(page, 20);
      const list = unwrapList<TransactionRow>(res).map(mapTransactionToRow);
      setRows(list);
      setTotalPages(Math.max(1, Math.ceil(unwrapTotal(res, list.length) / 20)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <Topbar title="Transactions" />
      <PageShell title="Transactions" subtitle="All platform payments across users and vendors.">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : (
          <TransactionsTable data={rows} page={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </PageShell>
    </>
  );
}
