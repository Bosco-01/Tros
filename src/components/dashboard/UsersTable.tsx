import React from 'react';
import Link from 'next/link';
import { UserRowData } from '@/data/dashboard';

interface UsersTableProps {
  data: UserRowData[];
}

export const UsersTable: React.FC<UsersTableProps> = ({ data }) => {
  return (
    <div className="w-full bg-white rounded-3xl border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-neutral-100">
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">User ID</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Full Name</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">E-Mail</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Phone Number</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Status</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">View More</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-neutral-100 last:border-none hover:bg-neutral-50/50 transition-colors">
                <td className="px-6 py-5 text-[15px] text-neutral-600 font-medium">{row.id}</td>
                <td className="px-6 py-5 text-[15px] text-neutral-600 font-medium">{row.fullName}</td>
                <td className="px-6 py-5 text-[15px] text-neutral-600 font-medium">{row.email}</td>
                <td className="px-6 py-5 text-[15px] text-neutral-600 font-medium">{row.phone}</td>
                <td className="px-6 py-5">
                  <span className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-bold ${
                    row.status === 'Active' 
                      ? 'bg-[#E5F5E8] text-[#168E33]' 
                      : 'bg-[#FFE8E8] text-[#D82F2F]'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <Link href={`/dashboard/users/${row.id.replace('#', '')}`}>
                    <button className="px-4 py-2 text-sm font-semibold text-neutral-700 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
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
        <span className="text-[15px] font-semibold text-neutral-900">1 of 150</span>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-lg bg-[#6312e1] text-white text-sm font-bold flex items-center justify-center">1</button>
          {[2, 3, 4, 5].map((page) => (
            <button key={page} className="w-9 h-9 rounded-lg bg-[#F4F4F5] text-neutral-700 text-sm font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center">
              {page}
            </button>
          ))}
          <span className="w-9 h-9 flex items-center justify-center bg-[#F4F4F5] text-neutral-700 rounded-lg font-bold text-sm tracking-widest">...</span>
          <button className="w-10 h-9 rounded-lg bg-[#F4F4F5] text-neutral-700 text-sm font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center">
            150
          </button>
        </div>
        <div className="w-16 hidden md:block"></div>
      </div>
    </div>
  );
};