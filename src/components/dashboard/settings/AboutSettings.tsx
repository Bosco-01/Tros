'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/services/apiClient';
import { settingsToMap } from '@/lib/api-helpers';

export const AboutSettings: React.FC = () => {
  const [companyName, setCompanyName] = useState('Trio');
  const [aboutDescription, setAboutDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch the current settings from the backend database on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = settingsToMap(await apiFetch('/admin/settings'));
        if (settings.about_company_name) {
          setCompanyName(settings.about_company_name);
        }
        if (settings.about_description) {
          setAboutDescription(settings.about_description);
        }
      } catch (err) {
        console.warn('[Settings] Failed to fetch live database settings. Falling back to local default values.');
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
      // 1. Update the Company Name key
      await apiFetch('/admin/settings/about_company_name', {
        method: 'PATCH',
        body: JSON.stringify({ value: companyName }),
      });

      // 2. Update the About Description key
      await apiFetch('/admin/settings/about_description', {
        method: 'PATCH',
        body: JSON.stringify({ value: aboutDescription }),
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
      
      {/* Title */}
      <h3 className="text-lg font-bold text-neutral-950 tracking-tight leading-none select-none border-b border-neutral-50 pb-4 mb-2">
        About Us
      </h3>

      {/* Form Inputs Stack */}
      <div className="flex flex-col gap-5 w-full max-w-[420px]">
        
        {/* Company Name Input */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-semibold text-neutral-500">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="h-14 px-5 bg-white border border-neutral-300 rounded-xl text-sm font-bold text-neutral-900 w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all"
          />
        </div>

        {/* About Description Textarea */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-semibold text-neutral-500">
            About Description
          </label>
          <textarea
            value={aboutDescription}
            onChange={(e) => setAboutDescription(e.target.value)}
            rows={6}
            placeholder="Type your company description here..."
            className="p-5 bg-white border border-neutral-300 rounded-xl text-sm font-bold text-neutral-900 w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] resize-none transition-all"
          />
        </div>

      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold self-start transition-all select-none">
          About Us updated successfully!
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold self-start transition-all select-none">
          {error}
        </div>
      )}

      {/* Save Button CTA */}
      <div className="flex items-center mt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="h-11 px-10 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold text-[15px] rounded-xl transition-all shadow-sm shadow-[#6312E1]/10 select-none active:scale-[0.99] flex items-center justify-center min-w-[140px]"
        >
          {isSaving ? (
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>

    </form>
  );
};