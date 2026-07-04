'use client';

import React, { useState, useEffect } from 'react';
import { Send, History, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '@/services/apiClient';

interface BroadcastMessage {
  title: string;
  content: string;
  channel: 'SMS' | 'EMAIL' | 'IN_APP';
  recipients?: string;
  created_at?: string;
}

export const AdminBroadcasts: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [channel, setChannel] = useState<'SMS' | 'EMAIL' | 'IN_APP'>('EMAIL');
  const [recipients, setRecipients] = useState('all');

  const [history, setHistory] = useState<BroadcastMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const fetchBroadcastHistory = async () => {
    try {
      // Calls GET /admin/broadcasts
      const data = await apiFetch<{ history?: BroadcastMessage[] }>('/admin/broadcasts?page=1&limit=20');
      if (data.history) setHistory(data.history);
    } catch (err) {
      console.warn('Failed to retrieve broadcasts. Staging fallback metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBroadcastHistory();
  }, []);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!title.trim() || !content.trim()) {
      setError('Please fill in both Title and Content fields.');
      return;
    }

    setSending(true);
    try {
      // Calls POST /admin/broadcasts payload DTO
      await apiFetch('/admin/broadcasts', {
        method: 'POST',
        body: JSON.stringify({
          channel,
          content,
          recipients,
          title,
        }),
      });

      setSuccess(true);
      
      // Update local listing state dynamically
      setHistory(prev => [{ title, content, channel, recipients }, ...prev]);
      
      setTitle('');
      setContent('');
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch broadcast message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
      
      {/* 1. Dispatch/Create Form */}
      <form onSubmit={handleSendBroadcast} className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col gap-5 h-fit">
        <h3 className="text-base font-bold text-neutral-900 leading-none mb-1 flex items-center gap-2 select-none">
          <Send className="w-5 h-5 text-[#6312E1]" /> Dispatch Broadcast Message
        </h3>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-neutral-500">Channel</label>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value as any)}
            className="h-12 px-4 bg-white border border-neutral-300 rounded-xl font-bold text-sm focus:outline-none focus:border-[#6312E1] cursor-pointer"
          >
            <option value="EMAIL">EMAIL</option>
            <option value="SMS">SMS</option>
            <option value="IN_APP">IN_APP</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-neutral-500">Recipients Filter</label>
          <input
            type="text"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="all, vendors, or users"
            className="h-12 px-4 border border-neutral-300 rounded-xl font-semibold text-sm focus:outline-none focus:border-[#6312E1]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-neutral-500">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Alert subject heading"
            className="h-12 px-4 border border-neutral-300 rounded-xl font-semibold text-sm focus:outline-none focus:border-[#6312E1]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-neutral-500">Content Message</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your system announcement text here..."
            rows={4}
            className="p-4 border border-neutral-300 rounded-xl font-semibold text-sm focus:outline-none focus:border-[#6312E1] resize-none"
          />
        </div>

        {success && (
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Broadcast message sent and recorded successfully!
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={sending}
          className="h-12 bg-[#6312E1] hover:bg-[#520cbd] disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 select-none"
        >
          {sending ? 'Dispatching...' : 'Send Broadcast'}
        </button>
      </form>

      {/* 2. Sent History Log */}
      <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col gap-5 max-h-[580px] overflow-y-auto custom-scrollbar">
        <h3 className="text-base font-bold text-neutral-900 leading-none mb-1 flex items-center gap-2 select-none">
          <History className="w-5 h-5 text-[#6312E1]" /> Dispatch History
        </h3>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <svg className="animate-spin h-6 w-6 text-[#6312E1]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {history.map((msg, idx) => (
              <div key={idx} className="border border-neutral-100 p-4 rounded-2xl bg-neutral-50/50 flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-extrabold text-[#6312E1] bg-purple-50 px-2 py-1 rounded-md">{msg.channel}</span>
                  <span className="text-neutral-400 font-medium">To: {msg.recipients}</span>
                </div>
                <h4 className="text-sm font-bold text-neutral-900">{msg.title}</h4>
                <p className="text-xs font-semibold text-neutral-600 leading-relaxed">{msg.content}</p>
              </div>
            ))}

            {history.length === 0 && (
              <div className="text-center py-12 text-xs font-semibold text-neutral-400">
                No sent broadcasts logged yet.
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};