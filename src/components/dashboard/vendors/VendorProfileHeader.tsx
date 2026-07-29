import React from 'react';
import type { VendorProfileData } from '@/types/admin';
import { AVATAR_PLACEHOLDER, avatarOrPlaceholder } from '@/lib/media';

interface VendorProfileHeaderProps {
  data: VendorProfileData;
}

export const VendorProfileHeader: React.FC<VendorProfileHeaderProps> = ({ data }) => {
  const src = avatarOrPlaceholder(data.avatarUrl);

  return (
    <div className="flex items-center gap-6 mb-8">
      <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={data.fullName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = AVATAR_PLACEHOLDER;
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
          {data.fullName}
        </h2>
        <p className="text-[15px] font-medium text-neutral-900">
          Registered Date:{' '}
          <span className="font-normal text-neutral-600">{data.registeredDate}</span>
        </p>
      </div>
    </div>
  );
};
