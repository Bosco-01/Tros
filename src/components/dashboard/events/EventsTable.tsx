import React from 'react';
import Link from 'next/link';
import type { EventRowData } from '@/types/admin';
import { Pagination, EmptyState, StatusBadge } from '@/components/ui/AsyncStates';

interface EventsTableProps {
  data: EventRowData[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const EventsTable: React.FC<EventsTableProps> = ({
  data,
  page = 1,
  totalPages = 1,
  onPageChange,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-neutral-100">
              <th className="px-4 sm:px-6 py-4 text-sm font-bold">Title</th>
              <th className="px-4 sm:px-6 py-4 text-sm font-bold">Category</th>
              <th className="px-4 sm:px-6 py-4 text-sm font-bold">Vendor</th>
              <th className="px-4 sm:px-6 py-4 text-sm font-bold">Price</th>
              <th className="px-4 sm:px-6 py-4 text-sm font-bold">Date</th>
              <th className="px-4 sm:px-6 py-4 text-sm font-bold">Status</th>
              <th className="px-4 sm:px-6 py-4 text-sm font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <EmptyState message="No events found." />
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50/50">
                  <td className="px-4 sm:px-6 py-4 text-sm font-medium">{row.title}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm">{row.category}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm">{row.vendorName}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm font-bold">{row.price}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm">{row.date}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <StatusBadge value={row.status} />
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <Link href={`/dashboard/events/${encodeURIComponent(row.id)}`}>
                      <button type="button" className="px-4 py-2 text-sm font-semibold border border-neutral-200 rounded-lg hover:bg-neutral-50">
                        View
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {onPageChange && <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />}
    </div>
  );
};
