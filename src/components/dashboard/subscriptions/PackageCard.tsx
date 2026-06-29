import React from 'react';
import { Check, Edit3 } from 'lucide-react';
import { SubscriptionPackage } from '@/data/subscriptions';

interface PackageCardProps {
  data: SubscriptionPackage;
}

export const PackageCard: React.FC<PackageCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col justify-between min-h-[480px]">
      
      {/* Banner Title */}
      <div className={`w-full py-3.5 text-center text-white text-base font-bold ${data.headerBg} select-none`}>
        {data.name}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Pricing tag */}
        <div className="flex items-baseline gap-1.5 border-b border-neutral-100 pb-5 mb-5 select-none">
          <span className="text-2xl font-extrabold text-neutral-950">{data.price}</span>
          <span className="text-[13px] font-medium text-neutral-500">/ monthly</span>
        </div>

        {/* Feature List */}
        <ul className="flex flex-col gap-4 mb-8 flex-1">
          {data.features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-3 text-sm text-neutral-600 font-medium select-none">
              {/* Purple checklist check icon */}
              <Check className="w-4 h-4 text-[#6312E1] stroke-[2.8]" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Edit Pencil CTA Button */}
        <button className="w-28 h-10 bg-[#6312E1] hover:bg-[#520cbd] text-white rounded-xl text-[13px] font-bold transition-colors flex items-center justify-center gap-1.5 mx-auto shadow-sm shadow-[#6312E1]/10">
          <Edit3 className="w-3.5 h-3.5 fill-current" />
          <span>Edit</span>
        </button>
      </div>

    </div>
  );
};