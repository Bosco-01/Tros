import React from 'react';
import Link from 'next/link'; // Added Next.js Link
import { SupportTicketRow } from '@/data/support';

interface SupportTicketsTableProps {
  data: SupportTicketRow[];
}

const getPriorityStylesAndLabel = (priority: 'High' | 'Medium' | 'Low') => {
  switch (priority) {
    case 'High':
      return { className: 'bg-[#FFE8E8] text-[#D82F2F]', label: 'High' };
    case 'Medium':
      return { className: 'bg-[#FFEAD8] text-[#D97706]', label: 'Meduim' }; // Typo preserved
    case 'Low':
      return { className: 'bg-[#FEFCE8] text-[#CA8A04]', label: 'Low' };
    default:
      return { className: 'bg-neutral-100 text-neutral-600', label: priority };
  }
};

const getStatusStyles = (status: 'Pending' | 'Answered' | 'Closed') => {
  switch (status) {
    case 'Answered':
      return 'bg-[#E5F5E8] text-[#168E33]';
    case 'Pending':
    case 'Closed':
      return 'bg-[#E4E4E7] text-[#52525B]';
    default:
      return 'bg-neutral-100 text-neutral-700';
  }
};

export const SupportTicketsTable: React.FC<SupportTicketsTableProps> = ({ data }) => {
  return (
    <div className="w-full bg-white rounded-3xl border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col max-w-[1100px]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-neutral-100">
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Customer Name</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Customer E-mail</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Customer Number</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Ticket ID</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Subject</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Priority</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Status</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const priorityConfig = getPriorityStylesAndLabel(row.priority);
              
              // Standardizes ID string for navigation path formatting
              const cleanedId = row.ticketId.replace('#', '').trim();

              return (
                <tr
                  key={index}
                  className="border-b border-neutral-100 last:border-none hover:bg-neutral-50/50 transition-colors"
                >
                  <td className="px-6 py-5 text-[15px] text-neutral-600 font-medium">{row.customerName}</td>
                  <td className="px-6 py-5 text-[15px] text-neutral-600 font-medium">{row.customerEmail}</td>
                  <td className="px-6 py-5 text-[15px] text-neutral-600 font-medium whitespace-nowrap">{row.customerNumber}</td>
                  <td className="px-6 py-5 text-[15px] text-neutral-600 font-medium">{row.ticketId}</td>
                  <td className="px-6 py-5 text-[15px] text-neutral-600 font-medium truncate max-w-[150px]" title={row.subject}>
                    {row.subject}
                  </td>
                  
                  <td className="px-6 py-5">
                    <span className={`inline-flex px-4 py-1.5 rounded-lg text-xs font-bold leading-none ${priorityConfig.className}`}>
                      {priorityConfig.label}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span className={`inline-flex px-4 py-1.5 rounded-lg text-xs font-bold leading-none ${getStatusStyles(row.status)}`}>
                      {row.status}
                    </span>
                  </td>

                  {/* Dynamic View More redirecting link */}
                  <td className="px-6 py-5">
                    <Link href={`/dashboard/support/${cleanedId}`}>
                      <button className="px-4 py-2 text-sm font-semibold text-neutral-700 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors whitespace-nowrap">
                        View More
                      </button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-8 py-5 border-t border-neutral-100 flex items-center justify-between bg-white mt-auto select-none">
        <span className="text-[15px] font-semibold text-neutral-900">1 of 72</span>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-lg bg-[#6312e1] text-white text-sm font-bold flex items-center justify-center shadow-sm shadow-[#6312E1]/10">1</button>
          {[2, 3, 4, 5].map((page) => (
            <button key={page} className="w-9 h-9 rounded-lg bg-[#F4F4F5] text-neutral-700 text-sm font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center">
              {page}
            </button>
          ))}
          <span className="w-9 h-9 flex items-center justify-center bg-[#F4F4F5] text-neutral-700 rounded-lg font-bold text-sm tracking-widest">...</span>
          <button className="w-10 h-9 rounded-lg bg-[#F4F4F5] text-neutral-700 text-sm font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center">
            72
          </button>
        </div>
        <div className="w-16 hidden md:block"></div>
      </div>
    </div>
  );
};