'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Send } from 'lucide-react';
import { TicketDetailsData } from '@/data/ticket-details';
import { adminService } from '@/services/adminService';

interface TicketDetailsFormProps {
  data: TicketDetailsData;
  ticketId: string;
}

export const TicketDetailsForm: React.FC<TicketDetailsFormProps> = ({ data, ticketId }) => {
  const [response, setResponse] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim()) return;

    setIsSending(true);
    setSuccess(false);
    setError('');

    try {
      await adminService.updateSupportTicketStatus(ticketId, 'resolved');
      setSuccess(true);
      setResponse('');
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-[#F8F9FA] rounded-[24px] p-8 md:p-10 w-full max-w-[640px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-neutral-100 flex flex-col relative select-none">
      
      {/* Header containing the X close button */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
          Ticket Details
        </h2>
        <Link 
          href="/dashboard/support" 
          className="text-neutral-400 hover:text-neutral-900 transition-colors focus:outline-none"
          aria-label="Close"
        >
          <X className="w-6 h-6 stroke-[2.2]" />
        </Link>
      </div>

      {/* Inputs container */}
      <form onSubmit={handleReply} className="flex flex-col gap-6">
        
        {/* Ticket ID */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-neutral-500">Ticket ID</label>
          <input
            type="text"
            readOnly
            value={`# ${data.id}`}
            className="bg-white rounded-xl px-5 h-14 border border-neutral-100/50 font-bold text-neutral-900 text-[16px] w-full focus:outline-none"
          />
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-neutral-500">Subject</label>
          <input
            type="text"
            readOnly
            value={data.subject}
            className="bg-white rounded-xl px-5 h-14 border border-neutral-100/50 font-bold text-neutral-900 text-[16px] w-full focus:outline-none"
          />
        </div>

        {/* Date and Time */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-neutral-500">Date and Time</label>
          <input
            type="text"
            readOnly
            value={data.dateTime}
            className="bg-white rounded-xl px-5 h-14 border border-neutral-100/50 font-bold text-neutral-900 text-[16px] w-full focus:outline-none"
          />
        </div>

        {/* Customer Complaint */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-neutral-500">Customer Complaint</label>
          <div className="bg-white rounded-xl p-5 border border-neutral-100/50 font-bold text-neutral-900 text-[15px] leading-relaxed w-full shadow-sm max-h-[160px] overflow-y-auto custom-scrollbar">
            {data.complaint}
          </div>
        </div>

        {/* Admin Response Textarea */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-neutral-500">Admin Response</label>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Type your response here"
            className="bg-white rounded-xl p-5 h-32 border border-neutral-100/50 font-semibold text-neutral-900 text-[15px] w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] resize-none placeholder-neutral-400 shadow-sm"
          />
        </div>

        {success && (
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold transition-all">
            Ticket marked as resolved!
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold transition-all">
            {error}
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="flex items-center gap-6 mt-4 w-full">
          {/* Reply Submit Button with sending loader state */}
          <button
            type="submit"
            disabled={isSending || !response.trim()}
            className="flex-1 h-12 bg-[#6312E1] hover:bg-[#520cbd] disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-[15px] rounded-xl transition-all shadow-sm shadow-[#6312E1]/10 flex items-center justify-center gap-2"
          >
            {isSending ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <>
                <Send className="w-[16px] h-[16px] stroke-[2.5]" />
                <span>Reply</span>
              </>
            )}
          </button>

          {/* Close back navigation button */}
          <Link href="/dashboard/support" className="flex-1">
            <button className="w-full h-12 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-[15px] rounded-xl transition-colors select-none">
              Close
            </button>
          </Link>
        </div>

      </form>
    </div>
  );
};