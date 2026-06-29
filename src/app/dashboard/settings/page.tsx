'use client';

import React, { useState } from 'react';
import { Topbar } from '@/components/layout/topbar'; // Note: Lowercase 'topbar' matching file on disk
import { ThemeSettingsForm } from '@/components/dashboard/settings/ThemeSettingsForm'; // Placeholder/previous tab
import { FAQSettings } from '@/components/dashboard/settings/FAQSettings';
import { ReferralSettings } from '@/components/dashboard/settings/ReferralSettings'; // Added Referral import

import { mockThemeConfig } from '@/data/settings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Manage Referrals'); // Set activeTab default to Manage Referrals to match mockup

  return (
    <>
      <Topbar title="Settings" />
      
      {/* 
        Main content wrapper with slightly grey background 
        so the pure white layout forms and menu cards stand out.
      */}
      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        <div className="max-w-[1100px] flex flex-col md:flex-row gap-8 items-start w-full">
          
          {/* Left panel tabs menu list */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col gap-2 w-full md:w-[320px] flex-shrink-0 select-none">
            {[
              'Themes & Colors',
              'FAQ',
              'Manage Referrals',
              'About Us',
              'Footer & Social Links',
              'Reviews & Comments',
              'Policy & Terms',
            ].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full py-4 px-5 rounded-2xl text-left font-bold text-[15px] transition-all duration-200 focus:outline-none ${
                    isActive
                      ? 'bg-[#F4ECFF] text-[#6312E1]'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Right panel forms switching state dynamic outputs */}
          {activeTab === 'Themes & Colors' && (
            <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex-1 text-center select-none">
              <h3 className="text-lg font-bold text-neutral-900 mb-1">Themes & Colors</h3>
              <p className="text-sm text-neutral-500">Design specifications color configuration layout.</p>
            </div>
          )}

          {activeTab === 'FAQ' && (
            <FAQSettings />
          )}

          {activeTab === 'Manage Referrals' && (
            <ReferralSettings />
          )}

          {activeTab !== 'Themes & Colors' && activeTab !== 'FAQ' && activeTab !== 'Manage Referrals' && (
            // Fallback rendering for the other menu items to prevent empty space states
            <div className="bg-white rounded-3xl p-12 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex-1 text-center select-none">
              <h3 className="text-lg font-bold text-neutral-900 mb-1">{activeTab} Parameters</h3>
              <p className="text-sm text-neutral-500">Form configuration controls for {activeTab.toLowerCase()} parameters are being mapped.</p>
            </div>
          )}

        </div>
      </main>
    </>
  );
}