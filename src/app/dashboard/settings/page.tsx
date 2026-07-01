'use client';

import React, { useState } from 'react';
import { Topbar } from '@/components/layout/topbar';
import { SettingsMenu } from '@/components/dashboard/settings/SettingsMenu';
import { ThemeSettingsForm } from '@/components/dashboard/settings/ThemeSettingsForm';
import { FAQSettings } from '@/components/dashboard/settings/FAQSettings';
import { ReferralSettings } from '@/components/dashboard/settings/ReferralSettings';
import { AboutSettings } from '@/components/dashboard/settings/AboutSettings';
import { FooterSettings } from '@/components/dashboard/settings/FooterSettings';
import { PolicyTermsSettings } from '@/components/dashboard/settings/PolicyTermsSettings';
import { BroadcastSettings } from '@/components/dashboard/settings/BroadcastSettings';
import { apiFetch } from '@/services/apiClient';
import { mockReviewsCommentsConfig, ReviewsCommentsConfig } from '@/data/reviews-comments';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Policy & Terms');

  return (
    <>
      <Topbar title="Settings" />
      <main className="flex-1 p-4 md:p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        <div className="max-w-[1100px] flex flex-col md:flex-row gap-6 md:gap-8 items-start w-full">
          <SettingsMenu activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="flex-1 w-full min-w-0">
            {activeTab === 'Themes & Colors' && <ThemeSettingsForm />}
            {activeTab === 'FAQ' && <FAQSettings />}
            {activeTab === 'Manage Referrals' && <ReferralSettings />}
            {activeTab === 'About Us' && <AboutSettings />}
            {activeTab === 'Footer & Social Links' && <FooterSettings />}
            {activeTab === 'Reviews & Comments' && <ReviewsCommentsSettings />}
            {activeTab === 'Policy & Terms' && <PolicyTermsSettings />}
            {activeTab === 'Broadcasts' && <BroadcastSettings />}
          </div>
        </div>
      </main>
    </>
  );
}

const ReviewsCommentsSettings: React.FC = () => {
  const [config, setConfig] = useState<ReviewsCommentsConfig>(mockReviewsCommentsConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await apiFetch<Record<string, string>>('/admin/settings');
        setConfig({
          enableReviews: settings.reviews_enabled === 'true',
          moderateComments: settings.comments_moderate === 'true',
        });
      } catch {
        console.warn('[Settings] Failed to fetch live reviews settings.');
      } finally {
        setIsLoading(false);
      }
    };
    void loadSettings();
  }, []);

  const handleToggle = (field: keyof ReviewsCommentsConfig) => {
    setConfig((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);
    setError('');

    try {
      await apiFetch('/admin/settings/reviews_enabled', {
        method: 'PATCH',
        body: JSON.stringify({ value: String(config.enableReviews) }),
      });
      await apiFetch('/admin/settings/comments_moderate', {
        method: 'PATCH',
        body: JSON.stringify({ value: String(config.moderateComments) }),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setError('Failed to save changes. Please verify backend connection.');
    } finally {
      setIsSaving(false);
    }
  };

  const ToggleCard = ({
    title,
    description,
    field,
    checked,
  }: {
    title: string;
    description: string;
    field: keyof ReviewsCommentsConfig;
    checked: boolean;
  }) => (
    <div
      onClick={() => handleToggle(field)}
      className={`w-full max-w-[560px] p-5 border rounded-2xl flex items-center justify-between cursor-pointer select-none transition-all duration-300 ${
        checked ? 'border-[#6312E1] bg-[#6312E1]/[0.02]' : 'border-neutral-300 hover:border-neutral-400 bg-white'
      }`}
    >
      <div className="flex flex-col gap-1 pr-4">
        <h4 className="text-base font-bold text-neutral-900 leading-none">{title}</h4>
        <p className="text-sm font-medium text-neutral-500 leading-normal">{description}</p>
      </div>
      <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${checked ? 'bg-[#6312E1]' : 'bg-neutral-200'}`}>
        <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
      </div>
    </div>
  );

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
        Reviews and Comments
      </h3>
      <div className="flex flex-col gap-4 w-full">
        <ToggleCard title="Enable Reviews" description="Allow users to leave reviews on events" field="enableReviews" checked={config.enableReviews} />
        <ToggleCard title="Moderate Comments" description="Require admin approval before publishing" field="moderateComments" checked={config.moderateComments} />
      </div>
      {success && <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold self-start">Settings updated successfully!</div>}
      {error && <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold self-start">{error}</div>}
      <div className="flex items-center mt-4">
        <button type="submit" disabled={isSaving} className="h-11 px-10 bg-[#6312E1] hover:bg-[#520cbd] disabled:opacity-60 text-white font-bold text-[15px] rounded-xl transition-all shadow-sm shadow-[#6312E1]/10 select-none active:scale-[0.99] flex items-center justify-center min-w-[140px]">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};
