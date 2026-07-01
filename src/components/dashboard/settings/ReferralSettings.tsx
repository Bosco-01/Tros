'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import type { ReferralConfig } from '@/data/referrals';

export const ReferralSettings: React.FC = () => {
  const [config, setConfig] = useState<ReferralConfig>({ bonusAmount: '', minReferrals: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const settings = await adminService.getSettings();
        setConfig({
          bonusAmount: settings.referral_bonus_amount || '',
          minReferrals: settings.referral_min_count || '',
        });
      } catch {
        setError('Failed to load referral settings');
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  const handleInputChange = (field: keyof ReferralConfig, value: string) => {
    setConfig({ ...config, [field]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);
    setError('');
    try {
      await adminService.updateSetting('referral_bonus_amount', config.bonusAmount);
      await adminService.updateSetting('referral_min_count', config.minReferrals);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setError('Failed to save referral settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-neutral-100 flex-1 w-full flex items-center justify-center h-64">
        <svg className="animate-spin h-8 w-8 text-[#6312E1]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
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
          <label className="text-[14px] font-semibold text-neutral-500">Referral Bonus Amount</label>
          <input
            type="text"
            value={config.bonusAmount}
            onChange={(e) => handleInputChange('bonusAmount', e.target.value)}
            className="h-14 px-5 bg-white border border-neutral-300 rounded-xl text-sm font-bold text-neutral-900 w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-semibold text-neutral-500">Minimum Referrals Required</label>
          <input
            type="text"
            value={config.minReferrals}
            onChange={(e) => handleInputChange('minReferrals', e.target.value)}
            className="h-14 px-5 bg-white border border-neutral-300 rounded-xl text-sm font-bold text-neutral-900 w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all"
          />
        </div>
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold self-start">Settings updated successfully!</div>
      )}
      {error && (
        <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold self-start">{error}</div>
      )}

      <div className="flex items-center mt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="h-11 px-10 bg-[#6312E1] hover:bg-[#520cbd] disabled:opacity-60 text-white font-bold text-[15px] rounded-xl transition-all shadow-sm shadow-[#6312E1]/10 select-none active:scale-[0.99] flex items-center justify-center min-w-[140px]"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};
