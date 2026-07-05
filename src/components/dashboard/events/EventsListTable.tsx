import React from "react";
import Link from "next/link";
import { EventRowData } from "@/data/events-list";

interface EventsListTableProps {
  data: EventRowData[];
}

const getCategoryStyles = (category: string) => {
  switch (category) {
    case "Nightlife":
      return "bg-[#F4DBFF] text-[#B815F5]";
    case "Music":
      return "bg-[#FDEBCE] text-[#B96A00]";
    case "Hotel":
      return "bg-[#E5ECFF] text-[#2563EB]";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-[#BEF2CB] text-[#168E33]";
    case "Pending":
      return "bg-[#E4E4E7] text-[#52525B]";
    case "Declined":
      return "bg-[#FFE8E8] text-[#D82F2F]";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
};

export const EventsListTable: React.FC<EventsListTableProps> = ({ data }) => {
  return (
    <div className="w-full bg-white rounded-3xl border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col max-w-[1100px]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-neutral-100">
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">
                Category
              </th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">
                Title
              </th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">
                Event Type
              </th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">
                Price
              </th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">
                Date and Time
              </th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">
                Vendor name/ ID
              </th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">
                Status
              </th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={`${row.id}-${index}`}
                className="border-b border-neutral-100 last:border-none hover:bg-neutral-50/50 transition-colors"
              >
                {/* Category Badge */}
                <td className="px-6 py-5">
                  <span
                    className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold leading-none ${getCategoryStyles(row.category)}`}
                  >
                    {row.category}
                  </span>
                </td>

                <td className="px-6 py-5 text-[15px] text-neutral-600 font-medium">
                  {row.title}
                </td>
                <td className="px-6 py-5 text-[15px] text-neutral-600 font-medium">
                  {row.eventType}
                </td>
                <td className="px-6 py-5 text-[15px] text-neutral-600 font-bold">
                  {row.price}
                </td>

                {/* Date & Time */}
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-bold text-neutral-950">
                      {row.date}
                    </span>
                    <span className="text-[13px] font-medium text-neutral-500">
                      {row.time}
                    </span>
                  </div>
                </td>

                {/* Vendor name/ ID */}
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-bold text-neutral-950">
                      {row.vendorName}
                    </span>
                    <span className="text-[13px] font-medium text-neutral-500">
                      {row.vendorId}
                    </span>
                  </div>
                </td>

                {/* Status Badge */}
                <td className="px-6 py-5">
                  <span
                    className={`inline-flex px-4 py-1.5 rounded-lg text-xs font-bold leading-none ${getStatusStyles(row.status)}`}
                  >
                    {row.status}
                  </span>
                </td>

                {/* View More Link Action */}
                <td className="px-6 py-5">
                  <Link href={`/dashboard/events/${row.id}`}>
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

      {/* Pagination Footer */}
      <div className="px-8 py-5 border-t border-neutral-100 flex items-center justify-between bg-white mt-auto select-none">
        <span className="text-[15px] font-semibold text-neutral-900">
          1 of 102
        </span>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-lg bg-[#6312e1] text-white text-sm font-bold flex items-center justify-center shadow-sm shadow-[#6312E1]/10">
            1
          </button>
          {[2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className="w-9 h-9 rounded-lg bg-[#F4F4F5] text-neutral-700 text-sm font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center"
            >
              {page}
            </button>
          ))}
          <span className="w-9 h-9 flex items-center justify-center bg-[#F4F4F5] text-neutral-700 rounded-lg font-bold text-sm tracking-widest">
            ...
          </span>
          <button className="w-10 h-9 rounded-lg bg-[#F4F4F5] text-neutral-700 text-sm font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center">
            102
          </button>
        </div>
        <div className="w-16 hidden md:block"></div>
      </div>
    </div>
  );
};
