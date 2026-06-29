import React from 'react';
import { ChevronDown } from 'lucide-react';
import { UserProfileData } from '@/data/user-details';

interface UserDetailsGridProps {
  data: UserProfileData;
}

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[15px] font-medium text-neutral-700">{label}</label>
    <div className="bg-white rounded-xl px-5 py-4 text-[16px] font-bold text-neutral-900 w-full shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] border border-neutral-100/50">
      {value}
    </div>
  </div>
);

export const UserDetailsGrid: React.FC<UserDetailsGridProps> = ({ data }) => {
  return (
    <div className="w-full border-t border-b border-neutral-200/80 py-8 mb-10">
      
      {/* 2x2 Grid for Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
        <Field label="User ID" value={data.id} />
        <Field label="Full Name" value={data.fullName} />
        <Field label="E-Mail Address" value={data.email} />
        <Field label="Phone Number" value={data.phone} />
      </div>

      {/* Bottom Status & Events Row with vertical divider */}
      <div className="flex flex-col md:flex-row items-center border-t border-neutral-200/80 pt-8 gap-8 md:gap-0">
        
        {/* Left Side: Status */}
        <div className="flex items-center gap-6 w-full md:w-1/2 md:pr-12">
          <span className="text-[15px] font-medium text-neutral-700">Status:</span>
          <button className="flex items-center gap-3 bg-[#BEF2CB] hover:bg-[#a6f0b8] text-[#168E33] px-5 py-2.5 rounded-lg font-bold text-[15px] transition-colors focus:outline-none">
            {data.status} <ChevronDown className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Right Side: Events Count */}
        <div className="flex items-center gap-6 w-full md:w-1/2 md:pl-12 md:border-l md:border-neutral-300">
          <span className="text-[15px] font-medium text-neutral-700">Number of Events Registered For:</span>
          <span className="font-bold text-[17px] text-neutral-900">{data.eventsCount} Events</span>
        </div>

      </div>
    </div>
  );
};