'use client';

import React from 'react';

interface EventActionButtonsProps {
  onApprove?: () => void | Promise<void>;
  onReject?: () => void | Promise<void>;
}

export const EventActionButtons: React.FC<EventActionButtonsProps> = ({ onApprove, onReject }) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full max-w-[540px] mt-2">
      <button
        type="button"
        onClick={() => void onApprove?.()}
        className="flex-1 h-14 bg-[#C6F7D0] hover:bg-[#b3f2be] text-[#168E33] font-bold text-base rounded-2xl transition-all"
      >
        Approve Cancellation
      </button>
      {onReject && (
        <button
          type="button"
          onClick={() => void onReject?.()}
          className="flex-1 h-14 bg-[#FAD4D4] hover:bg-[#f6c2c2] text-[#D82F2F] font-bold text-base rounded-2xl transition-all"
        >
          Reject
        </button>
      )}
    </div>
  );
};
