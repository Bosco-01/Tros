import React from 'react';
import { VendorEventRowData } from '@/data/vendor-details';

interface VendorEventsTableProps {
  data: VendorEventRowData[];
}

const getCategoryStyles = (category: string) => {
  switch (category) {
    case 'Nightlife':
      return 'bg-[#F4DBFF] text-[#B815F5]';
    case 'Music':
      return 'bg-[#FDEBCE] text-[#B96A00]';
    default:
      return 'bg-neutral-100 text-neutral-700';
  }
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-[#BEF2CB] text-[#168E33]';
    case 'Closed':
      return 'bg-[#E4E4E7] text-[#52525B]';
    case 'Cancelled':
      return 'bg-[#FFE8E8] text-[#D82F2F]';
    default:
      return 'bg-neutral-100 text-neutral-700';
  }
};

export const VendorEventsTable: React.FC<VendorEventsTableProps> = ({ data }) => {
  return (
    <div className="w-full flex flex-col gap-4 max-w-[1100px]">
      
      {/* Section Title */}
      <h3 className="text-base font-bold text-neutral-950 mt-4 px-1">All Events</h3>

      {/* Table Card Wrapper */}
      <div className="w-full bg-white rounded-3xl p-3 shadow-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#F8F9FA]">
                <th className="px-6 py-5 text-[15px] font-bold text-neutral-900 first:rounded-l-2xl">Category</th>
                <th className="px-6 py-5 text-[15px] font-bold text-neutral-900">Title</th>
                <th className="px-6 py-5 text-[15px] font-bold text-neutral-900">Event Type</th>
                <th className="px-6 py-5 text-[15px] font-bold text-neutral-900">Price</th>
                <th className="px-6 py-5 text-[15px] font-bold text-neutral-900">Date and Time</th>
                <th className="px-6 py-5 text-[15px] font-bold text-neutral-900">Status</th>
                <th className="px-6 py-5 text-[15px] font-bold text-neutral-900">Total Users</th>
                <th className="px-6 py-5 text-[15px] font-bold text-neutral-900">Ratings/reviews</th>
                <th className="px-6 py-5 text-[15px] font-bold text-neutral-900 last:rounded-r-2xl">View More</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b border-neutral-100 last:border-none hover:bg-neutral-50/50 transition-colors">
                  
                  {/* Category */}
                  <td className="px-6 py-5">
                    <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold ${getCategoryStyles(row.category)}`}>
                      {row.category}
                    </span>
                  </td>

                  {/* Title & Type */}
                  <td className="px-6 py-5 text-[14px] text-neutral-700 font-medium">{row.title}</td>
                  <td className="px-6 py-5 text-[14px] text-neutral-700 font-medium">{row.eventType}</td>
                  <td className="px-6 py-5 text-[14px] text-neutral-700 font-medium">{row.price}</td>

                  {/* Date & Time */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[14px] font-bold text-neutral-900">{row.date}</span>
                      <span className="text-[13px] font-medium text-neutral-500">{row.time}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <span className={`inline-flex px-4 py-1.5 rounded-lg text-xs font-bold ${getStatusStyles(row.status)}`}>
                      {row.status}
                    </span>
                  </td>

                  {/* Total Users */}
                  <td className="px-6 py-5 text-[14px] text-neutral-700 font-medium">{row.totalUsers}</td>

                  {/* Ratings & Reviews Column */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5 text-[14px] font-bold text-neutral-900">
                      {/* Orange star icon */}
                      <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      <span>{row.rating.toFixed(1)}</span>
                      <span className="text-neutral-500 font-medium">({row.reviewsCount})</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-5">
                    <button className="px-4 py-2 text-sm font-semibold text-neutral-700 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors whitespace-nowrap">
                      View More
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};