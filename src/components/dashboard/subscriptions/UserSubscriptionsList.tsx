'use client';

import React, { useState } from 'react';
import { UserSubscriptionRow } from '@/data/subscriptions';

interface UserSubscriptionsListProps {
  data: UserSubscriptionRow[];
}

export const UserSubscriptionsList: React.FC<UserSubscriptionsListProps> = ({ data }) => {
  const [activePlanFilter, setActivePlanFilter] = useState<'Free Plan' | 'Basic Plan' | 'Premium Plan'>('Basic Plan');

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1100px] select-none">
      
      {/* Subscriptions Switcher State Pills */}
      <div className="flex flex-wrap gap-4">
        {(['Free Plan', 'Basic Plan', 'Premium Plan'] as const).map((plan) => (
          <button
            key={plan}
            onClick={() => setActivePlanFilter(plan)}
            className={`px-8 py-2 rounded-full font-bold text-[14px] transition-all duration-200 border ${
              activePlanFilter === plan
                ? 'bg-[#6312E1] border-[#6312E1] text-white shadow-sm shadow-[#6312E1]/10'
                : 'bg-white border-neutral-100 text-neutral-700 hover:bg-neutral-50 shadow-sm shadow-neutral-100/50'
            }`}
          >
            {plan}
          </button>
        ))}
      </div>

      {/* Subscription List Table */}
      <div className="w-full bg-white rounded-3xl border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-neutral-100">
                <th className="px-8 py-5 text-sm font-bold text-neutral-900">User ID</th>
                <th className="px-8 py-5 text-sm font-bold text-neutral-900">Customer Name</th>
                <th className="px-8 py-5 text-sm font-bold text-neutral-900">Subscription Plan</th>
                <th className="px-8 py-5 text-sm font-bold text-neutral-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-neutral-100 last:border-none hover:bg-neutral-50/50 transition-colors"
                >
                  <td className="px-8 py-5 text-[15px] text-neutral-600 font-medium">{row.userId}</td>
                  <td className="px-8 py-5 text-[15px] text-neutral-600 font-medium">{row.customerName}</td>
                  
                  {/* Subscription Plan Badge */}
                  <td className="px-8 py-5">
                    <span className="inline-flex px-4 py-1.5 rounded-lg text-xs font-bold bg-[#FFE8D6] text-[#FF5C00]">
                      {row.plan}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="px-8 py-5">
                    <span className="inline-flex px-4 py-1.5 rounded-lg text-xs font-bold bg-[#E5F5E8] text-[#168E33]">
                      {row.status}
                    </span>
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