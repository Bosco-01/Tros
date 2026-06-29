'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export const AddAdminForm: React.FC = () => {
  const [name, setName] = useState('Admin User');
  const [email, setEmail] = useState('Johnadmin@gmail.com');
  const [phone, setPhone] = useState('+234 6879403445');
  const [role, setRole] = useState('DevOps Admin');
  const [jobTitle, setJobTitle] = useState('Customer Support');
  const [isAdding, setIsAdding] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setSuccess(false);

    // Mock successful saving trigger
    setTimeout(() => {
      setIsAdding(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div className="bg-[#F8F9FA] rounded-[24px] p-8 md:p-10 w-full max-w-[640px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-neutral-100 flex flex-col relative select-none">
      
      {/* Header row containing close cross icon */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
          Add New User
        </h2>
        <Link 
          href="/dashboard/admins" 
          className="text-neutral-400 hover:text-neutral-900 transition-colors focus:outline-none"
          aria-label="Close"
        >
          <X className="w-6 h-6 stroke-[2.2]" />
        </Link>
      </div>

      {/* Form Fields container */}
      <form onSubmit={handleAdd} className="flex flex-col gap-6">
        
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-neutral-500">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white rounded-xl px-5 h-14 border border-neutral-100/50 font-bold text-neutral-900 text-[16px] w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all"
          />
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-neutral-500">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white rounded-xl px-5 h-14 border border-neutral-100/50 font-bold text-neutral-900 text-[16px] w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all"
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-neutral-500">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-white rounded-xl px-5 h-14 border border-neutral-100/50 font-bold text-neutral-900 text-[16px] w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all"
          />
        </div>

        {/* Administrative Role */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-neutral-500">Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-white rounded-xl px-5 h-14 border border-neutral-100/50 font-bold text-neutral-900 text-[16px] w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all"
          />
        </div>

        {/* Job Title */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-neutral-500">Job Title</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="bg-white rounded-xl px-5 h-14 border border-neutral-100/50 font-bold text-neutral-900 text-[16px] w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all"
          />
        </div>

        {success && (
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold transition-all">
            New Administrative User added successfully!
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="flex items-center gap-6 mt-4 w-full">
          {/* Add User Submit Button */}
          <button
            type="submit"
            disabled={isAdding}
            className="flex-1 h-12 bg-[#BEF2CB] hover:bg-[#a6f0b8] text-[#168E33] font-bold text-[15px] rounded-xl transition-all shadow-sm shadow-[#168E33]/5 active:scale-[0.99] flex items-center justify-center select-none"
          >
            {isAdding ? (
              <svg className="animate-spin h-5 w-5 text-[#168E33]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              'Add User'
            )}
          </button>

          {/* Cancel Button */}
          <Link href="/dashboard/admins" className="flex-1">
            <button
              type="button"
              className="w-full h-12 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-[15px] rounded-xl transition-colors select-none"
            >
              Cancel
            </button>
          </Link>
        </div>

      </form>

    </div>
  );
};