import React from 'react';
import { EventUserCardData } from '@/data/event-users';

interface EventUserCardProps {
  data: EventUserCardData;
}

export const EventUserCard: React.FC<EventUserCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-[24px] p-6 border border-neutral-100 flex items-center gap-6 shadow-sm shadow-neutral-100/5 hover:border-neutral-200 transition-colors">
      
      {/* Round User Avatar */}
      <div className="w-[84px] h-[84px] rounded-full overflow-hidden flex-shrink-0 bg-neutral-100 border border-neutral-50">
        <img
          src={data.avatarUrl}
          alt={data.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Stacked Text Attributes */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <h4 className="text-[17px] font-bold text-neutral-950 leading-none">{data.name}</h4>
        <span className="text-[14px] font-medium text-neutral-500">{data.id}</span>
        
        {/* Ticket Quantity */}
        <p className="text-[14px] font-medium text-neutral-500">
          Ticket Qty: <span className="font-bold text-neutral-950">{data.ticketQty}</span>
        </p>

        {/* Date / Time */}
        <span className="text-[14px] font-medium text-neutral-500 leading-none">{data.dateTime}</span>
      </div>

    </div>
  );
};