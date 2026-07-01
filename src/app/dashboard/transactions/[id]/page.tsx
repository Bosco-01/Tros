'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Topbar } from '@/components/layout/topbar';
import { adminService } from '@/services/adminService';
import { unwrapList } from '@/lib/api-helpers';
import { mapTransactionToRow } from '@/lib/mappers';
import type { TransactionRowData, TransactionRow } from '@/types/admin';
import { LoadingState, ErrorState, PageShell } from '@/components/ui/AsyncStates';

export default function TransactionDetailPage() {
  const params = useParams();
  const txId = decodeURIComponent(String(params.id));
  const [tx, setTx] = useState<TransactionRowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.listTransactions(1, 100);
      const found = unwrapList<TransactionRow>(res)
        .map(mapTransactionToRow)
        .find((r) => r.transactionId === txId || r.transactionId.replace('#', '') === txId);
      if (!found) throw new Error('Transaction not found');
      setTx(found);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction not found');
    } finally {
      setLoading(false);
    }
  }, [txId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <Topbar title="Transaction Details" />
      {loading ? (
        <LoadingState />
      ) : error || !tx ? (
        <ErrorState message={error || 'Not found'} onRetry={load} />
      ) : (
        <PageShell>
          <div className="max-w-[700px]">
            <div className="flex items-center gap-2 text-sm mb-6">
              <Link href="/dashboard/transactions">Transactions</Link>
              <ChevronRight className="w-4 h-4" />
              <span>{tx.transactionId}</span>
            </div>
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 grid gap-4">
              {Object.entries({
                Customer: tx.customerName,
                'Transaction ID': tx.transactionId,
                Title: tx.paymentTitle,
                Amount: tx.amount,
                Date: tx.date,
                Type: tx.paymentType,
                Status: tx.status,
              }).map(([k, v]) => (
                <div key={k}>
                  <p className="text-sm text-neutral-500">{k}</p>
                  <p className="font-bold">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </PageShell>
      )}
    </>
  );
}
