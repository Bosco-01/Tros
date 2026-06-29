'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, Edit2 } from 'lucide-react';

export const AddPackageForm: React.FC = () => {
  const [planName, setPlanName] = useState('Premium Plan');
  const [billingAmount, setBillingAmount] = useState('# 10,000');
  const [benefits, setBenefits] = useState<string[]>([
    '+20% event promotion',
    '+20% advanced analysis',
    '+20% event promotion',
    '+20% event promotion',
  ]);

  const handleAddBenefit = () => {
    setBenefits([...benefits, '+20% new custom benefit description']);
  };

  const handleDeleteBenefit = (index: number) => {
    setBenefits(benefits.filter((_, idx) => idx !== index));
  };

  const handleBenefitChange = (index: number, val: string) => {
    const updated = [...benefits];
    updated[index] = val;
    setBenefits(updated);
  };

  return (
    <div className="w-full max-w-[1100px] flex flex-col gap-6">
      <h2 className="text-2xl md:text-[26px] font-bold text-neutral-950 tracking-tight">
        Add New Package
      </h2>

      {/* Form Fields: Plan Name & Amount inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-4">
        
        {/* Plan Name */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-neutral-500">Plan Name</label>
          <div className="relative bg-white rounded-xl h-14 border border-neutral-100 px-5 flex items-center justify-between shadow-sm">
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="bg-transparent font-bold text-neutral-900 w-full outline-none text-[16px]"
            />
            <Edit2 className="w-4 h-4 text-neutral-500 cursor-pointer" />
          </div>
        </div>

        {/* Billing Amount */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-neutral-500">Billing Amount / Per Month</label>
          <div className="relative bg-white rounded-xl h-14 border border-neutral-100 px-5 flex items-center justify-between shadow-sm">
            <input
              type="text"
              value={billingAmount}
              onChange={(e) => setBillingAmount(e.target.value)}
              className="bg-transparent font-bold text-neutral-900 w-full outline-none text-[16px]"
            />
            <Edit2 className="w-4 h-4 text-neutral-500 cursor-pointer" />
          </div>
        </div>

      </div>

      {/* Interactive "Add Benefits" trigger card */}
      <div
        onClick={handleAddBenefit}
        className="w-full h-16 bg-white border border-neutral-100/60 rounded-2xl flex items-center px-6 gap-3.5 shadow-sm shadow-neutral-100/30 cursor-pointer hover:bg-neutral-50/50 transition-colors select-none mb-2"
      >
        <div className="w-5 h-5 bg-[#6312E1] text-white flex items-center justify-center rounded font-bold text-xs">
          +
        </div>
        <span className="text-[15px] font-bold text-neutral-800">Add Benefits</span>
      </div>

      {/* Map list of editable benefits */}
      <div className="flex flex-col gap-4 mb-8">
        {benefits.map((benefit, idx) => (
          <div
            key={idx}
            className="w-full h-16 bg-white border border-neutral-100/40 rounded-2xl flex items-center justify-between px-6 shadow-sm shadow-neutral-100/20"
          >
            <input
              type="text"
              value={benefit}
              onChange={(e) => handleBenefitChange(idx, e.target.value)}
              className="bg-transparent font-medium text-neutral-700 w-full outline-none text-[15px]"
            />
            <button
              onClick={() => handleDeleteBenefit(idx)}
              className="text-red-500 hover:text-red-700 transition-colors focus:outline-none"
              aria-label="Delete benefit"
            >
              {/* Red trashcan delete icon */}
              <Trash2 className="w-[18px] h-[18px] stroke-[2.2] text-[#D82F2F]" />
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Action buttons */}
      <div className="flex items-center gap-6 max-w-[400px]">
        {/* Soft mint green CTA button (matches literal Figma name label "Add User") */}
        <button className="flex-1 h-12 bg-[#BEF2CB] hover:bg-[#a6f0b8] text-[#168E33] font-bold text-[15px] rounded-xl transition-all shadow-sm shadow-[#168E33]/5">
          Add User
        </button>

        {/* Gray Cancel navigation back button */}
        <Link href="/dashboard/subscriptions" className="flex-1">
          <button className="w-full h-12 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-[15px] rounded-xl transition-colors select-none">
            Cancel
          </button>
        </Link>
      </div>

    </div>
  );
};