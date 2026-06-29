import React from 'react';

interface SettingsMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    'Themes & Colors',
    'FAQ',
    'Manage Referrals',
    'About Us',
    'Footer & Social Links',
    'Reviews & Comments',
    'Policy & Terms',
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col gap-2 w-full md:w-[320px] flex-shrink-0 select-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
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
  );
};