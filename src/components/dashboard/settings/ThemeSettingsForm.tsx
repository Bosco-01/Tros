'use client';

import React, { useEffect, useState } from 'react';
import { ThemeColorConfig, mockThemeConfig } from '@/data/settings';
import { adminService } from '@/services/adminService';

const THEME_KEYS: Record<keyof ThemeColorConfig, string> = {
  primaryColor: 'theme_primary_color',
  secondaryColor: 'theme_secondary_color',
  accentColor: 'theme_accent_color',
  backgroundColor: 'theme_background_color',
};

export const ThemeSettingsForm: React.FC = () => {
  const [config, setConfig] = useState<ThemeColorConfig>(mockThemeConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const settings = await adminService.getSettings();
        setConfig({
          primaryColor: settings.theme_primary_color || mockThemeConfig.primaryColor,
          secondaryColor: settings.theme_secondary_color || mockThemeConfig.secondaryColor,
          accentColor: settings.theme_accent_color || mockThemeConfig.accentColor,
          backgroundColor: settings.theme_background_color || mockThemeConfig.backgroundColor,
        });
      } catch {
        setError('Failed to load theme settings');
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  const handleColorChange = (field: keyof ThemeColorConfig, value: string) => {
    setConfig({ ...config, [field]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);
    setError('');
    try {
      await Promise.all(
        (Object.keys(THEME_KEYS) as Array<keyof ThemeColorConfig>).map((field) =>
          adminService.updateSetting(THEME_KEYS[field], config[field]),
        ),
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setError('Failed to save theme settings');
    } finally {
      setIsSaving(false);
    }
  };

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
        <div
          className="w-20 h-11 rounded-lg border border-neutral-100 flex-shrink-0 transition-colors duration-300"
          style={{ backgroundColor: value }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => handleColorChange(field, e.target.value)}
          className="h-11 px-4 border border-neutral-300 rounded-lg text-sm font-bold text-neutral-900 w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all"
        />
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
        Themes & Colors
      </h3>

      <div className="flex flex-col gap-5">
        <ColorInputRow label="Primary Color" field="primaryColor" value={config.primaryColor} />
        <ColorInputRow label="Secondary Color" field="secondaryColor" value={config.secondaryColor} />
        <ColorInputRow label="Accent Color" field="accentColor" value={config.accentColor} />
        <ColorInputRow label="Background Color" field="backgroundColor" value={config.backgroundColor} />
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold self-start transition-all">
          Theme colors updated successfully!
        </div>
      )}
      {error && (
        <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold self-start transition-all">{error}</div>
      )}

      <div className="flex items-center mt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="h-11 px-10 bg-[#6312E1] hover:bg-[#520cbd] disabled:opacity-60 text-white font-bold text-[15px] rounded-xl transition-all shadow-sm shadow-[#6312E1]/10 active:scale-[0.99] flex items-center justify-center min-w-[140px]"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};
