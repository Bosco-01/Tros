import React from 'react';
import { Topbar } from '@/components/layout/topbar'; // Note: Match your exact lowercase on-disk config if needed
import { TransactionFilters } from '@/components/dashboard/transactions/TransactionFilters';
import { TransactionsTable } from '@/components/dashboard/transactions/TransactionsTable';
import { mockTransactions } from '@/data/transactions';

export default function TransactionsPage() {
  return (
    <>
      <Topbar title="Transactions" />
      
      {/* 
        Main content wrapper with slightly grey background 
        so the pure white filter containers and table row states stand out.
      */}
      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        
        {/* Toggle Pills, Search Groups, and Filters */}
        <TransactionFilters />

        {/* Dynamic Data Table */}
        <div className="w-full">
          <TransactionsTable data={mockTransactions} />
        </div>

      </main>
    </>
  );
}