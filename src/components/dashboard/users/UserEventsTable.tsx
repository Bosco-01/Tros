import React from "react";
import { EventRowData } from "@/data/user-details";

interface UserEventsTableProps {
  data: EventRowData[];
}

const getCategoryStyles = (category: string) => {
  switch (category) {
    case "Nightlife":
      return "bg-[#F4DBFF] text-[#B815F5]";
    case "Music":
      return "bg-[#FDEBCE] text-[#B96A00]";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
};

export const UserEventsTable: React.FC<UserEventsTableProps> = ({ data }) => {
  return (
    <div className="w-full bg-white rounded-3xl p-3 shadow-sm border border-neutral-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#F8F9FA]">
              {/* Rounded corners for the pill-like table header */}
              <th className="px-6 py-5 text-[15px] font-bold text-neutral-900 first:rounded-l-2xl">
                Category
              </th>
              <th className="px-6 py-5 text-[15px] font-bold text-neutral-900">
                Title
              </th>
              <th className="px-6 py-5 text-[15px] font-bold text-neutral-900">
                Event Type
              </th>
              <th className="px-6 py-5 text-[15px] font-bold text-neutral-900">
                Price
              </th>
              <th className="px-6 py-5 text-[15px] font-bold text-neutral-900">
                Date and Time
              </th>
              <th className="px-6 py-5 text-[15px] font-bold text-neutral-900">
                Vendor name/ ID
              </th>
              <th className="px-6 py-5 text-[15px] font-bold text-neutral-900 last:rounded-r-2xl">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={row.id}
                className="border-b border-neutral-100 last:border-none hover:bg-neutral-50/50 transition-colors"
              >
                {/* Category Badge */}
                <td className="px-6 py-5">
                  <span
                    className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold ${getCategoryStyles(row.category)}`}
                  >
                    {row.category}
                  </span>
                </td>

                <td className="px-6 py-5 text-[14px] text-neutral-700 font-medium">
                  {row.title}
                </td>
                <td className="px-6 py-5 text-[14px] text-neutral-700 font-medium">
                  {row.eventType}
                </td>
                <td className="px-6 py-5 text-[14px] text-neutral-700 font-medium">
                  {row.price}
                </td>

                {/* Date & Time */}
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-bold text-neutral-900">
                      {row.date}
                    </span>
                    <span className="text-[13px] font-medium text-neutral-500">
                      {row.time}
                    </span>
                  </div>
                </td>

                {/* Vendor Name & ID */}
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-bold text-neutral-900">
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
                    className={`inline-flex px-4 py-1.5 rounded-lg text-xs font-bold ${
                      row.status === "Active"
                        ? "bg-[#BEF2CB] text-[#168E33]"
                        : "bg-[#E4E4E7] text-[#52525B]"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
