import React from 'react';
import Link from 'next/link';
import { TransactionRowData } from '@/data/transactions';

interface TransactionsTableProps {
  data: TransactionRowData[];
}

const getStatusStyles = (status: 'Successful' | 'Declined' | 'Pending') => {
  switch (status) {
    case 'Successful':
      return 'bg-[#E5F5E8] text-[#168E33]';
    case 'Declined':
      return 'bg-[#FFE8E8] text-[#D82F2F]';
    case 'Pending':
      return 'bg-[#E4E4E7] text-[#52525B]';
    default:
      return 'bg-neutral-100 text-neutral-700';
  }
};

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ data }) => {
  return (
    <div className="w-full bg-white rounded-3xl border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col max-w-[1100px]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-neutral-100">
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Customer Name</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Transaction ID</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Payment Title</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Amount</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Date</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Payment Type</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Status</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">View More</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="border-b border-neutral-100 last:border-none hover:bg-neutral-50/50 transition-colors"
              >
                <td className="px-6 py-5 text-[15px] text-neutral-600 font-medium">{row.customerName}</td>
                <td className="px-6 py-5 text-[15px] text-neutral-600 font-medium">{row.transactionId}</td>
                <td className="px-6 py-5 text-[15px] text-neutral-600 font-medium truncate max-w-[180px]" title={row.paymentTitle}>
                  {row.paymentTitle}
                </td>
                <td className="px-6 py-5 text-[15px] text-neutral-600 font-bold">{row.amount}</td>
                <td className="px-6 py-5 text-[15px] text-neutral-600 font-medium">{row.date}</td>
                
                <td className="px-6 py-5">
                  <span className="inline-flex px-4 py-1.5 rounded-lg text-xs font-bold bg-[#E4E4E7] text-[#52525B]">
                    {row.paymentType}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusStyles(row.status)}`}>
                    {row.status}
                  </span>
                </td>

                {/* View More dynamically linking to Transaction Summary details page */}
                <td className="px-6 py-5">
                  <Link href={`/dashboard/transactions/${row.transactionId.replace('#', '')}`}>
                    <button className="px-4 py-2 text-sm font-semibold text-neutral-700 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors whitespace-nowrap">
                      View More
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-8 py-5 border-t border-neutral-100 flex items-center justify-between bg-white mt-auto">
        <span className="text-[15px] font-semibold text-neutral-900">1 of 3</span>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-lg bg-[#6312e1] text-white text-sm font-bold flex items-center justify-center shadow-sm shadow-[#6312E1]/10">1</button>
          {[2, 3].map((page) => (
            <button key={page} className="w-9 h-9 rounded-lg bg-[#F4F4F5] text-neutral-700 text-sm font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center">
              {page}
            </button>
          ))}
        </div>
        <div className="w-16 hidden md:block"></div>
      </div>
    </div>
  );
};