import React from 'react';
import Link from 'next/link';
import type { VendorRowData } from '@/types/admin';
import { Pagination, EmptyState, StatusBadge } from '@/components/ui/AsyncStates';

interface VendorsTableProps {
  data: VendorRowData[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const VendorsTable: React.FC<VendorsTableProps> = ({
  data,
  page = 1,
  totalPages = 1,
  onPageChange,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col max-w-[1100px]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[960px]">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-neutral-100">
              <th className="px-4 sm:px-6 py-4 text-sm font-bold text-neutral-900">Vendor ID</th>
              <th className="px-4 sm:px-6 py-4 text-sm font-bold text-neutral-900">Full Name</th>
              <th className="px-4 sm:px-6 py-4 text-sm font-bold text-neutral-900">Business</th>
              <th className="px-4 sm:px-6 py-4 text-sm font-bold text-neutral-900">E-Mail</th>
              <th className="px-4 sm:px-6 py-4 text-sm font-bold text-neutral-900">Subscription</th>
              <th className="px-4 sm:px-6 py-4 text-sm font-bold text-neutral-900">Amount</th>
              <th className="px-4 sm:px-6 py-4 text-sm font-bold text-neutral-900">Event Post</th>
              <th className="px-4 sm:px-6 py-4 text-sm font-bold text-neutral-900">Status</th>
              <th className="px-4 sm:px-6 py-4 text-sm font-bold text-neutral-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <EmptyState message="No vendors found." />
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-neutral-100 last:border-none hover:bg-neutral-50/50 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-4 text-sm text-neutral-600 font-medium truncate max-w-[100px]">
                    {row.id}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-neutral-600 font-medium">{row.fullName}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-neutral-600 font-medium truncate max-w-[140px]" title={row.businessName}>
                    {row.businessName}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-neutral-600 font-medium truncate max-w-[140px]" title={row.email}>
                    {row.email}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <StatusBadge value={row.subscription} />
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-neutral-600 font-bold">{row.amount}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <StatusBadge value={row.eventPost} />
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <StatusBadge value={row.status} />
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <Link href={`/dashboard/vendors/${encodeURIComponent(row.id)}`}>
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-semibold text-neutral-700 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors whitespace-nowrap"
                      >
                        View More
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {onPageChange && (
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
};
