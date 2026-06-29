import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Topbar } from '@/components/layout/topbar';

import { TransactionDetailsGrid } from '@/components/dashboard/transactions/TransactionDetailsGrid';
import { TransactionActionButtons } from '@/components/dashboard/transactions/TransactionActionButtons';

import { mockTransactionDetails } from '@/data/transaction-details';

export default function TransactionSummaryPage() {
  return (
    <>
      <Topbar title="Transactions" />
      
      {/* 
        Main content wrapper with slightly grey background 
        so the pure white form inputs stand out.
      */}
      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        <div className="max-w-[1100px]">
          
          {/* Breadcrumbs matching layout specification */}
          <div className="flex items-center gap-2 text-[15px] font-medium mb-10 select-none">
            <Link href="/dashboard/transactions" className="text-neutral-900 hover:text-[#6312E1] transition-colors">
              Transactions
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-900">Transaction Summary</span>
          </div>

          {/* Form field inputs grid */}
          <TransactionDetailsGrid data={mockTransactionDetails} />

          {/* Print, Downloads, and Close Buttons */}
          <TransactionActionButtons />

        </div>
      </main>
    </>
  );
}