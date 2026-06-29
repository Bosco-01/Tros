import React from 'react';
import { VendorProfileData } from '@/data/vendor-details';

interface VendorProfileHeaderProps {
  data: VendorProfileData;
}

export const VendorProfileHeader: React.FC<VendorProfileHeaderProps> = ({ data }) => {
  return (
    <div className="flex items-center gap-6 mb-8">
      <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
        <img
          src={data.avatarUrl}
          alt={data.fullName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
          {data.fullName}
        </h2>
        <p className="text-[15px] font-medium text-neutral-900">
          Registered Date: <span className="font-normal text-neutral-600">{data.registeredDate}</span>
        </p>
      </div>
    </div>
  );
};