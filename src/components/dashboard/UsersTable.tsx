import React from 'react';
import Link from 'next/link';
import type { UserRowData } from '@/types/admin';
import { Pagination, EmptyState } from '@/components/ui/AsyncStates';

interface UsersTableProps {
  data: UserRowData[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  data,
  page = 1,
  totalPages = 1,
  onPageChange,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-neutral-100">
              <th className="px-4 sm:px-6 py-4 text-sm font-bold text-neutral-900">User ID</th>
              <th className="px-4 sm:px-6 py-4 text-sm font-bold text-neutral-900">Full Name</th>
              <th className="px-4 sm:px-6 py-4 text-sm font-bold text-neutral-900">E-Mail</th>
              <th className="px-4 sm:px-6 py-4 text-sm font-bold text-neutral-900">Phone</th>
              <th className="px-4 sm:px-6 py-4 text-sm font-bold text-neutral-900">Status</th>
              <th className="px-4 sm:px-6 py-4 text-sm font-bold text-neutral-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState message="No users found." />
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-neutral-100 last:border-none hover:bg-neutral-50/50 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-4 text-sm text-neutral-600 font-medium truncate max-w-[120px]">
                    {row.id}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-neutral-600 font-medium">{row.fullName}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-neutral-600 font-medium truncate max-w-[180px]">
                    {row.email}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-neutral-600 font-medium">{row.phone}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold ${
                        row.status === 'Active'
                          ? 'bg-[#E5F5E8] text-[#168E33]'
                          : 'bg-[#FFE8E8] text-[#D82F2F]'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <Link href={`/dashboard/users/${encodeURIComponent(row.id)}`}>
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
