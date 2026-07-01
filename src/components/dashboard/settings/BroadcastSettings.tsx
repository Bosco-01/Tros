'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { unwrapList, formatDate } from '@/lib/api-helpers';
import type { BroadcastItem } from '@/types/admin';

export const BroadcastSettings: React.FC = () => {
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>([]);
  const [channel, setChannel] = useState('push');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recipients, setRecipients] = useState('all');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.listBroadcasts(1, 20);
      setBroadcasts(unwrapList(res) as BroadcastItem[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load broadcasts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSuccess(false);
    setError('');
    try {
      await adminService.sendBroadcast({ channel, title, content, recipients });
      setTitle('');
      setContent('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send broadcast');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex-1 w-full flex flex-col gap-6">
      <h3 className="text-lg font-bold text-neutral-950 tracking-tight leading-none border-b border-neutral-50 pb-4 mb-2">
        Broadcasts
      </h3>

      <form onSubmit={handleSend} className="flex flex-col gap-4 max-w-[560px]">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-500">Channel</label>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="h-12 px-4 border border-neutral-200 rounded-xl font-bold text-neutral-900"
          >
            <option value="push">Push</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-500">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="h-12 px-4 border border-neutral-200 rounded-xl font-bold text-neutral-900"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-500">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            className="px-4 py-3 border border-neutral-200 rounded-xl font-medium text-neutral-900 resize-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-500">Recipients</label>
          <input
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="all"
            className="h-12 px-4 border border-neutral-200 rounded-xl font-bold text-neutral-900"
          />
        </div>
        {success && <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold">Broadcast sent!</div>}
        {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{error}</div>}
        <button
          type="submit"
          disabled={sending}
          className="h-11 px-8 bg-[#6312E1] hover:bg-[#520cbd] disabled:opacity-60 text-white font-bold rounded-xl self-start"
        >
          {sending ? 'Sending...' : 'Send Broadcast'}
        </button>
      </form>

      <div className="mt-4">
        <h4 className="text-sm font-bold text-neutral-700 mb-3">Recent Broadcasts</h4>
        {loading ? (
          <p className="text-sm text-neutral-500">Loading...</p>
        ) : broadcasts.length === 0 ? (
          <p className="text-sm text-neutral-500">No broadcasts yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {broadcasts.map((b, i) => (
              <div key={b.broadcast_id || b.id || i} className="border border-neutral-100 rounded-xl p-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-neutral-900">{b.title}</span>
                  <span className="text-xs font-semibold text-neutral-500 uppercase">{b.channel}</span>
                </div>
                <p className="text-sm text-neutral-600">{b.content}</p>
                {b.created_at && (
                  <p className="text-xs text-neutral-400 mt-2">{formatDate(b.created_at)}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
