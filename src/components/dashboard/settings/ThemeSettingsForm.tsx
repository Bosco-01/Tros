'use client';

import React, { useState } from 'react';
import { ThemeColorConfig } from '@/data/settings';

interface ThemeSettingsFormProps {
  initialConfig: ThemeColorConfig;
}

export const ThemeSettingsForm: React.FC<ThemeSettingsFormProps> = ({ initialConfig }) => {
  const [config, setConfig] = useState<ThemeColorConfig>(initialConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleColorChange = (field: keyof ThemeColorConfig, value: string) => {
    setConfig({ ...config, [field]: value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    // Mock API saving trigger
    setTimeout(() => {
      setIsSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 1000);
  };

  // Color row builder with dynamic background matching the current hex input state
  const ColorInputRow = ({
    label,
    field,
    value,
  }: {
    label: string;
    field: keyof ThemeColorConfig;
    value: string;
  }) => (
    <div className="flex flex-col gap-1 w-full max-w-[420px]">
      <span className="text-[13px] font-medium text-neutral-500">{label}</span>
      <div className="flex items-center gap-4">
        {/* Dynamic Color Box */}
        <div
          className="w-20 h-11 rounded-lg border border-neutral-100 flex-shrink-0 transition-colors duration-300"
          style={{ backgroundColor: value }}
        />
        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => handleColorChange(field, e.target.value)}
          className="h-11 px-4 border border-neutral-300 rounded-lg text-sm font-bold text-neutral-900 w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all"
        />
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSave} className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex-1 w-full flex flex-col gap-6">
      
      <h3 className="text-lg font-bold text-neutral-950 tracking-tight leading-none select-none border-b border-neutral-50 pb-4 mb-2">
        Themes & Colors
      </h3>

      <div className="flex flex-col gap-5">
        <ColorInputRow
          label="Primary Color"
          field="primaryColor"
          value={config.primaryColor}
        />
        <ColorInputRow
          label="Secondary Color"
          field="secondaryColor"
          value={config.secondaryColor}
        />
        <ColorInputRow
          label="Accent Color"
          field="accentColor"
          value={config.accentColor}
        />
        <ColorInputRow
          label="Background Color"
          field="backgroundColor"
          value={config.backgroundColor}
        />
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold self-start transition-all">
          Theme colors updated successfully!
        </div>
      )}

      {/* Save Button CTA */}
      <div className="flex items-center mt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="h-11 px-10 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold text-[15px] rounded-xl transition-all shadow-sm shadow-[#6312E1]/10 active:scale-[0.99] flex items-center justify-center min-w-[140px]"
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