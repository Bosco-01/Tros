import React from 'react';

interface EventBannerProps {
  url: string;
}

export const EventBanner: React.FC<EventBannerProps> = ({ url }) => {
  return (
    <div className="w-full h-[280px] md:h-[340px] rounded-[2rem] overflow-hidden mb-8 relative shadow-sm select-none bg-neutral-900">
      <img
        src={url}
        alt="Event Banner"
        className="w-full h-full object-cover opacity-80"
      />
      {/* Soft dark overlay to mimic visual lighting */}
      <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
    </div>
  );
};