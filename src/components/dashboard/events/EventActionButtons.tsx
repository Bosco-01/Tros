import React from 'react';

export const EventActionButtons: React.FC = () => {
  return (
    <div className="flex items-center gap-6 w-full max-w-[540px] mt-2">
      {/* Mint green styled Approve button */}
      <button className="flex-1 h-14 bg-[#C6F7D0] hover:bg-[#b3f2be] text-[#168E33] font-bold text-base rounded-2xl transition-all active:scale-[0.99] shadow-sm shadow-[#168E33]/5">
        Approve
      </button>

      {/* Soft pink styled Disapprove button */}
      <button className="flex-1 h-14 bg-[#FAD4D4] hover:bg-[#f6c2c2] text-[#D82F2F] font-bold text-base rounded-2xl transition-all active:scale-[0.99] shadow-sm shadow-[#D82F2F]/5">
        Disapprove
      </button>
    </div>
  );
};