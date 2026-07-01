'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Edit2 } from 'lucide-react';
import { adminService } from '@/services/adminService';

export const AddPackageForm: React.FC = () => {
  const router = useRouter();
  const [planName, setPlanName] = useState('');
  const [billingAmount, setBillingAmount] = useState('');
  const [description, setDescription] = useState('');
  const [maxEvents, setMaxEvents] = useState('10');
  const [maxTickets, setMaxTickets] = useState('500');
  const [benefits, setBenefits] = useState<string[]>(['Access to reports', 'Broadcast messages']);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleAddBenefit = () => {
    setBenefits([...benefits, 'New benefit']);
  };

  const handleDeleteBenefit = (index: number) => {
    setBenefits(benefits.filter((_, idx) => idx !== index));
  };

  const handleBenefitChange = (index: number, val: string) => {
    const updated = [...benefits];
    updated[index] = val;
    setBenefits(updated);
  };

  const parsePrice = (raw: string) => {
    const n = Number(raw.replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) ? n : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      await adminService.createSubscriptionPlan({
        name: planName,
        price: parsePrice(billingAmount),
        description: description || benefits.join('; '),
        max_events: Number(maxEvents) || 10,
        max_tickets_per_event: Number(maxTickets) || 500,
        can_access_reports: benefits.some((b) => b.toLowerCase().includes('report')),
        can_broadcast: benefits.some((b) => b.toLowerCase().includes('broadcast')),
      });
      router.push('/dashboard/subscriptions');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create plan');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[1100px] flex flex-col gap-6">
      <h2 className="text-2xl md:text-[26px] font-bold text-neutral-950 tracking-tight">
        Add New Package
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-4">
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-neutral-500">Plan Name</label>
          <div className="relative bg-white rounded-xl h-14 border border-neutral-100 px-5 flex items-center justify-between shadow-sm">
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              required
              className="bg-transparent font-bold text-neutral-900 w-full outline-none text-[16px]"
            />
            <Edit2 className="w-4 h-4 text-neutral-500" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-neutral-500">Billing Amount / Per Month</label>
          <div className="relative bg-white rounded-xl h-14 border border-neutral-100 px-5 flex items-center justify-between shadow-sm">
            <input
              type="text"
              value={billingAmount}
              onChange={(e) => setBillingAmount(e.target.value)}
              required
              placeholder="10000"
              className="bg-transparent font-bold text-neutral-900 w-full outline-none text-[16px]"
            />
            <Edit2 className="w-4 h-4 text-neutral-500" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-neutral-500">Max Events</label>
          <input
            type="number"
            value={maxEvents}
            onChange={(e) => setMaxEvents(e.target.value)}
            className="bg-white rounded-xl h-14 border border-neutral-100 px-5 font-bold text-neutral-900 text-[16px] shadow-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-neutral-500">Max Tickets / Event</label>
          <input
            type="number"
            value={maxTickets}
            onChange={(e) => setMaxTickets(e.target.value)}
            className="bg-white rounded-xl h-14 border border-neutral-100 px-5 font-bold text-neutral-900 text-[16px] shadow-sm"
          />
        </div>
      </div>

      <div
        onClick={handleAddBenefit}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleAddBenefit()}
        className="w-full h-16 bg-white border border-neutral-100/60 rounded-2xl flex items-center px-6 gap-3.5 shadow-sm shadow-neutral-100/30 cursor-pointer hover:bg-neutral-50/50 transition-colors select-none mb-2"
      >
        <div className="w-5 h-5 bg-[#6312E1] text-white flex items-center justify-center rounded font-bold text-xs">+</div>
        <span className="text-[15px] font-bold text-neutral-800">Add Benefits</span>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        {benefits.map((benefit, idx) => (
          <div
            key={idx}
            className="w-full h-16 bg-white border border-neutral-100/40 rounded-2xl flex items-center justify-between px-6 shadow-sm shadow-neutral-100/20"
          >
            <input
              type="text"
              value={benefit}
              onChange={(e) => handleBenefitChange(idx, e.target.value)}
              className="bg-transparent font-medium text-neutral-700 w-full outline-none text-[15px]"
            />
            <button
              type="button"
              onClick={() => handleDeleteBenefit(idx)}
              className="text-red-500 hover:text-red-700 transition-colors focus:outline-none"
              aria-label="Delete benefit"
            >
              <Trash2 className="w-[18px] h-[18px] stroke-[2.2] text-[#D82F2F]" />
            </button>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{error}</div>
      )}

      <div className="flex items-center gap-6 max-w-[400px]">
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 h-12 bg-[#BEF2CB] hover:bg-[#a6f0b8] disabled:opacity-60 text-[#168E33] font-bold text-[15px] rounded-xl transition-all shadow-sm shadow-[#168E33]/5"
        >
          {isSaving ? 'Saving...' : 'Add Package'}
        </button>
        <Link href="/dashboard/subscriptions" className="flex-1">
          <button type="button" className="w-full h-12 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-[15px] rounded-xl transition-colors select-none">
            Cancel
          </button>
        </Link>
      </div>
    </form>
  );
};
