import React from 'react';
import { AdminUserRow } from '@/data/admins';

interface AdminUsersTableProps {
  data: AdminUserRow[];
}

export const AdminUsersTable: React.FC<AdminUsersTableProps> = ({ data }) => {
  return (
    <div className="w-full bg-white rounded-3xl border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col max-w-[1100px]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-neutral-100">
              <th className="px-8 py-5 text-sm font-bold text-neutral-900">ID</th>
              <th className="px-8 py-5 text-sm font-bold text-neutral-900">Name</th>
              <th className="px-8 py-5 text-sm font-bold text-neutral-900">Phone Number</th>
              <th className="px-8 py-5 text-sm font-bold text-neutral-900">E-Mail</th>
              <th className="px-8 py-5 text-sm font-bold text-neutral-900">Role</th>
              <th className="px-8 py-5 text-sm font-bold text-neutral-900">Job Title</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="border-b border-neutral-100 last:border-none hover:bg-neutral-50/50 transition-colors"
              >
                <td className="px-8 py-5 text-[15px] text-neutral-600 font-medium">{row.id}</td>
                <td className="px-8 py-5 text-[15px] text-neutral-600 font-medium">{row.name}</td>
                <td className="px-8 py-5 text-[15px] text-neutral-600 font-medium">{row.phone}</td>
                <td className="px-8 py-5 text-[15px] text-neutral-600 font-medium">{row.email}</td>
                
                {/* Soft Grey Role Badge */}
                <td className="px-8 py-5">
                  <span className="inline-flex px-4 py-1.5 rounded-lg text-xs font-bold bg-[#E4E4E7] text-[#52525B] whitespace-nowrap">
                    {row.role}
                  </span>
                </td>

                <td className="px-8 py-5 text-[15px] text-neutral-600 font-medium">{row.jobTitle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Text-based pagination footer matching mockup specification */}
      <div className="px-8 py-5 border-t border-neutral-100 flex items-center justify-between bg-white mt-auto select-none">
        {/* Prev Button */}
        <button className="text-[15px] font-bold text-neutral-900 hover:text-[#6312E1] transition-colors focus:outline-none">
          Prev
        </button>

        {/* Page fraction display */}
        <span className="text-[15px] font-bold text-neutral-950">
          1/2
        </span>

        {/* Next Button */}
        <button className="text-[15px] font-bold text-neutral-900 hover:text-[#6312E1] transition-colors focus:outline-none">
          Next
        </button>
      </div>

    </div>
  );
};