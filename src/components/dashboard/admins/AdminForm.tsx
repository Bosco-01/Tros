'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { AdminProfileData } from '@/data/admins';

interface AdminFormProps {
  initialData: AdminProfileData;
}

export const AdminForm: React.FC<AdminFormProps> = ({ initialData }) => {
  const [formData, setFormData] = useState<AdminProfileData>(initialData);
  const [password, setPassword] = useState('supersecretpassword123');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: keyof AdminProfileData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    // Mock API saving trigger
    setTimeout(() => {
      setIsSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000); // clear success msg after 2s
    }, 1000);
  };

  return (
    <form onSubmit={handleSave} className="w-full max-w-[1100px] flex flex-col gap-6">
      
      {/* Section Title */}
      <h3 className="text-base font-bold text-neutral-950 mt-4 leading-none select-none">
        Your Profile
      </h3>

      {/* Responsive 3x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-500">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="bg-white rounded-xl px-5 h-14 border border-neutral-100/60 font-bold text-neutral-900 text-[16px] w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all shadow-sm shadow-neutral-100/30"
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-500">Phone Number</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="bg-white rounded-xl px-5 h-14 border border-neutral-100/60 font-bold text-neutral-900 text-[16px] w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all shadow-sm shadow-neutral-100/30"
          />
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-500">E-mail</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="bg-white rounded-xl px-5 h-14 border border-neutral-100/60 font-bold text-neutral-900 text-[16px] w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all shadow-sm shadow-neutral-100/30"
          />
        </div>

        {/* Role (Read-only for platform protection) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-500">Role</label>
          <input
            type="text"
            value={formData.role}
            readOnly
            className="bg-white/80 rounded-xl px-5 h-14 border border-neutral-100/60 font-bold text-neutral-500 text-[16px] w-full focus:outline-none select-none"
          />
        </div>

        {/* Job Title */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-500">Job Title</label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
            className="bg-white rounded-xl px-5 h-14 border border-neutral-100/60 font-bold text-neutral-900 text-[16px] w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all shadow-sm shadow-neutral-100/30"
          />
        </div>

        {/* Password (Interactive hidden toggle) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-500">Password</label>
          <div className="relative bg-white rounded-xl h-14 border border-neutral-100/60 px-5 flex items-center justify-between shadow-sm shadow-neutral-100/30">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent font-bold text-neutral-900 w-full outline-none text-[16px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-neutral-950 focus:outline-none flex items-center justify-center p-1 hover:bg-neutral-50 rounded-lg transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-[18px] h-[18px] stroke-[2.2]" />
              ) : (
                <Eye className="w-[18px] h-[18px] stroke-[2.2]" />
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Success/Saving Visual Indicators */}
      {success && (
        <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold self-start transition-all">
          Profile Changes Saved Successfully!
        </div>
      )}

      {/* Save Button CTA inside a wrapper to prevent stretching */}
      <div className="flex items-center mt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="h-12 px-10 bg-[#BEF2CB] hover:bg-[#a6f0b8] text-[#168E33] font-bold text-[15px] rounded-xl transition-all shadow-sm shadow-[#168E33]/5 select-none active:scale-[0.99] flex items-center justify-center min-w-[140px]"
        >
          {isSaving ? (
            <svg className="animate-spin h-5 w-5 text-[#168E33]" fill="none" viewBox="0 0 24 24">
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