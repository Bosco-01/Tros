'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/services/apiClient';

export const ReferralSettings: React.FC = () => {
  const [bonusAmount, setBonusAmount] = useState('# 5,000.00');
  const [minReferrals, setMinReferrals] = useState('3');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await apiFetch<Record<string, string>>('/admin/settings');
        if (settings.referral_bonus_amount) {
          setBonusAmount(settings.referral_bonus_amount);
        }
        if (settings.minimum_referral_bonus) {
          setMinReferrals(settings.minimum_referral_bonus);
        }
      } catch (err) {
        console.warn('[Settings] Failed to fetch referrals settings.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);
    setError('');

    try {
      await apiFetch('/admin/settings/referral_bonus_amount', {
        method: 'PATCH',
        body: JSON.stringify({ value: bonusAmount }),
      });

      await apiFetch('/admin/settings/minimum_referral_bonus', {
        method: 'PATCH',
        body: JSON.stringify({ value: minReferrals }),
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError('Failed to save changes. Please verify backend connection.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex-1 w-full flex items-center justify-center h-64 select-none">
        <svg className="animate-spin h-8 w-8 text-[#6312E1]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex-1 w-full flex flex-col gap-6">
      <h3 className="text-lg font-bold text-neutral-950 tracking-tight leading-none select-none border-b border-neutral-50 pb-4 mb-2">
        Manage Referrals
      </h3>

      <div className="flex flex-col gap-5 w-full max-w-[420px]">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-neutral-500">Referral Bonus Amount</label>
          <input
            type="text"
            value={bonusAmount}
            onChange={(e) => setBonusAmount(e.target.value)}
            className="h-14 px-5 bg-white border border-neutral-300 rounded-xl text-sm font-bold text-neutral-900 w-full focus:outline-none focus:border-[#6312E1]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-neutral-500">Minimum Referral of Bonus</label>
          <input
            type="text"
            value={minReferrals}
            onChange={(e) => setMinReferrals(e.target.value)}
            className="h-14 px-5 bg-white border border-neutral-300 rounded-xl text-sm font-bold text-neutral-900 w-full focus:outline-none focus:border-[#6312E1]"
          />
        </div>
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold self-start animate-in fade-in duration-200">
          Referrals settings updated successfully!
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold self-start animate-in fade-in duration-200">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="h-11 px-10 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold text-[15px] rounded-xl transition-all self-start"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};