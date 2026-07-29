'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/services/apiClient';
import { DisputeRowData } from '@/data/disputes';

interface DisputesTableProps {
  data: DisputeRowData[];
}

export const DisputesTable: React.FC<DisputesTableProps> = ({ data }) => {
  const [disputes, setDisputes] = useState<DisputeRowData[]>(data);
  const [loading, setLoading] = useState(true);
  
  // Resolution inline state
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDisputes = async () => {
    try {
      const response = await apiFetch<{ disputes?: DisputeRowData[] }>(
        '/admin/disputes?page=1&limit=50',
      );
      setDisputes(Array.isArray(response.disputes) ? response.disputes : []);
    } catch (error) {
      console.warn('Backend /admin/disputes unreachable.');
      setDisputes(data.length ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, [data]);

  const handleResolveDispute = async (id: string) => {
    if (!adminNote.trim()) return;
    setSubmitting(true);
    
    const cleanId = id.replace('DSP-', '').trim();

    try {
      // Calls PATCH /admin/disputes/{disputeId} payload DTO
      await apiFetch(`/admin/disputes/${cleanId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'resolved',
          admin_note: adminNote,
        }),
      });

      // Update local state dynamically
      setDisputes(prev => prev.map(item => 
        item.dispute_id === id 
          ? { ...item, status: 'resolved', admin_note: adminNote } 
          : item
      ));

      setResolvingId(null);
      setAdminNote('');
    } catch (err) {
      alert('Failed to resolve dispute.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-3xl p-12 border border-neutral-100 flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-[#6312E1]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-3xl border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col max-w-[1100px] select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-neutral-100">
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Dispute ID</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Customer Name</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Transaction ID</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Payment Title</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Amount</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Date</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Status</th>
              <th className="px-6 py-5 text-sm font-bold text-neutral-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {disputes.map((row, index) => {
              const isPending = row.status === 'pending';
              const isResolving = resolvingId === row.dispute_id;
              return (
                <React.Fragment key={`${row.dispute_id}-${index}`}>
                  <tr className="border-b border-neutral-100 last:border-none hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-5 text-[15px] text-neutral-600 font-medium">{row.dispute_id}</td>
                    <td className="px-6 py-5 text-[15px] text-neutral-600 font-medium">{row.customer_name}</td>
                    <td className="px-6 py-5 text-[15px] text-neutral-600 font-medium">{row.transaction_id}</td>
                    <td className="px-6 py-5 text-[15px] text-neutral-600 font-medium">{row.payment_title}</td>
                    <td className="px-6 py-5 text-[15px] text-neutral-600 font-bold">{row.amount}</td>
                    <td className="px-6 py-5 text-[15px] text-neutral-600 font-medium">{row.date}</td>
                    
                    {/* Status Badge */}
                    <td className="px-6 py-5">
                      <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold leading-none ${
                        isPending ? 'bg-[#FFE8E8] text-[#D82F2F]' : 'bg-[#E5F5E8] text-[#168E33]'
                      }`}>
                        {row.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      {isPending ? (
                        <button
                          onClick={() => setResolvingId(isResolving ? null : row.dispute_id)}
                          className="px-4 py-2 text-sm font-semibold text-[#6312E1] border border-[#6312E1]/20 rounded-lg hover:bg-purple-50 transition-colors whitespace-nowrap"
                        >
                          Resolve Dispute
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-neutral-500 text-xs font-bold leading-none">
                          <CheckCircle2 className="w-4 h-4 text-[#168E33]" /> Resolved
                        </div>
                      )}
                    </td>
                  </tr>

                  {/* Inline resolving notes form drawer */}
                  {isResolving && (
                    <tr className="bg-neutral-50/50 animate-in slide-in-from-top duration-300">
                      <td colSpan={8} className="px-8 py-5 border-b border-neutral-100">
                        <div className="flex flex-col gap-3 max-w-lg">
                          <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
                            <MessageSquare className="w-4 h-4 text-[#6312E1]" /> Resolve Dispute note
                          </div>
                          <textarea
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            placeholder="Add administrative resolution note here..."
                            rows={3}
                            className="p-4 border border-neutral-300 bg-white rounded-xl text-sm font-semibold focus:outline-none focus:border-[#6312E1] resize-none"
                          />
                          <div className="flex items-center gap-3 mt-1">
                            <button
                              onClick={() => handleResolveDispute(row.dispute_id)}
                              disabled={submitting || !adminNote.trim()}
                              className="px-4 py-2 bg-[#6312E1] hover:bg-[#520cbd] text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                            >
                              Submit Resolution
                            </button>
                            <button
                              onClick={() => setResolvingId(null)}
                              className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-bold rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* If resolved and has admin note, display as read-only details */}
                  {!isPending && row.admin_note && (
                    <tr className="bg-neutral-50/25">
                      <td colSpan={8} className="px-8 py-4 border-b border-neutral-100 text-xs font-semibold text-neutral-500 leading-relaxed">
                        <div className="flex items-center gap-2 mb-1 text-neutral-400 font-bold">
                          <AlertCircle className="w-4 h-4" /> Admin Resolution Log:
                        </div>
                        {row.admin_note}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-8 py-5 border-t border-neutral-100 flex items-center justify-between bg-white mt-auto select-none">
        <button className="text-[15px] font-bold text-neutral-900 hover:text-[#6312E1] transition-colors focus:outline-none">
          Prev
        </button>
        <span className="text-[15px] font-bold text-neutral-950">1/1</span>
        <button className="text-[15px] font-bold text-neutral-900 hover:text-[#6312E1] transition-colors focus:outline-none">
          Next
        </button>
      </div>
    </div>
  );
};