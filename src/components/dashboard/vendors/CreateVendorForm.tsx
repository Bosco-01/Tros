'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { X, Upload, ChevronDown } from 'lucide-react';
import { apiFetch } from '@/services/apiClient';

export const CreateVendorForm: React.FC = () => {
  const [vendorName, setVendorName] = useState('');
  const [address, setAddress] = useState('');
  const [vendorType, setVendorType] = useState('Hotel');
  const [ninFile, setNinFile] = useState<File | null>(null);
  const [cacFile, setCacFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const ninInputRef = useRef<HTMLInputElement>(null);
  const cacInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!vendorName.trim()) {
      setError('Please enter the Vendor Name.');
      return;
    }
    if (!address.trim()) {
      setError('Please enter the Business Address.');
      return;
    }
    if (!ninFile) {
      setError('Please upload the National Identification Number (NIN) document.');
      return;
    }
    if (!cacFile) {
      setError('Please upload the Corporate Affairs Commission (CAC) document.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Complete Vendor Profile API expects multipart/form-data payload
      const formData = new FormData();
      formData.append('business_name', vendorName);
      formData.append('address', address);
      formData.append('business_description', `${vendorType} onboarding profile`);
      formData.append('state', 'Lagos'); // Default required values
      formData.append('city', 'Ikeja');
      formData.append('cac_registered_number', 'CAC-TEMP-1234');
      formData.append('nin', nin);
      formData.set('cac', cac);

      await apiFetch('/admin/vendors', {
        method: 'POST',
        body: formData,
      });

      setSuccess(true);
      setResponseDataDefaults();
    } catch (err) {
      setError('Failed to create vendor account. Please verify backend service.');
    } finally {
      setIsSending(false);
    }
  };

  const handleStartFileSelector = (field: 'nin' | 'cac') => {
    const input = document.getElementById(field) as HTMLInputElement;
    input?.click();
  };

  const handleFileChange = (field: 'nin' | 'cac', file: File | null) => {
    if (field === 'nin') setNinFile(file);
    if (field === 'cac') setCacFile(file);
  };

  const setResponseDataDefaults = () => {
    setVendorName('');
    setAddress('');
    setVendorType('Hotel');
    setNinFile(null);
    setCacFile(null);
  };

  const UploadBlock = ({
    label,
    field,
    file,
  }: {
    label: string;
    field: 'nin' | 'cac';
    file: File | null;
  }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-neutral-500">{label}</label>
      <div 
        onClick={() => handleStartFileSelector(field)}
        className={`relative w-full h-[72px] px-5 bg-white border border-dashed rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
          file ? 'border-[#6312E1] bg-[#6312E1]/[0.01]' : 'border-neutral-300 hover:border-neutral-400'
        }`}
      >
        <div className="flex items-center gap-3">
          <Upload className={`w-5 h-5 ${file ? 'text-[#6312E1]' : 'text-neutral-500'}`} />
          <span className={`text-[15px] font-bold truncate max-w-[240px] md:max-w-[340px] ${file ? 'text-neutral-900' : 'text-neutral-500'}`}>
            {file ? file.name : `Choose file for ${label}`}
          </span>
        </div>
        <button 
          type="button" 
          className="px-4 h-9 bg-neutral-100 text-xs font-bold text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
        >
          Select File
        </button>
        <input
          id={field}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => handleFileChange(field, e.target.files ? e.target.files[0] : null)}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-[#F8F9FA] rounded-[24px] p-8 md:p-10 w-full max-w-[640px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-neutral-100 flex flex-col relative select-none">
      
      {/* Header containing the X close button */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
          Create Vendor
        </h2>
        <Link 
          href="/dashboard/vendors" 
          className="text-neutral-400 hover:text-neutral-900 transition-colors focus:outline-none"
          aria-label="Close"
        >
          <X className="w-6 h-6 stroke-[2.2]" />
        </Link>
      </div>

      {/* Inputs container */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Vendor Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-neutral-500">Vendor Name</label>
          <input
            type="text"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            className="bg-white rounded-xl px-5 h-14 border border-neutral-100/50 font-bold text-neutral-900 text-[16px] w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all"
          />
        </div>

        {/* Address */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-neutral-500">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-white rounded-xl px-5 h-14 border border-neutral-100/50 font-bold text-neutral-900 text-[16px] w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all"
          />
        </div>

        {/* Vendor Type Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-neutral-500">Vendor Type</label>
          <div className="relative w-full">
            <select
              value={vendorType}
              onChange={(e) => setVendorType(e.target.value)}
              className="bg-white rounded-xl px-5 h-14 border border-neutral-100/50 font-bold text-neutral-900 text-[16px] w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all appearance-none cursor-pointer pr-12"
            >
              <option value="Hotel">Hotel</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Event">Event</option>
            </select>
            <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
              <ChevronDown className="w-5 h-5 stroke-[2.2]" />
            </span>
          </div>
        </div>

        {/* NIN Document Upload */}
        <UploadBlock label="NIN Document" field="nin" file={ninFile} />

        {/* CAC Document Upload */}
        <UploadBlock label="CAC Document" field="cac" file={cacFile} />

        {success && (
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold transition-all">
            Vendor manually onboarded successfully!
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold transition-all">
            {error}
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="flex items-center gap-6 mt-4 w-full">
          {/* Add User Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 h-12 bg-[#BEF2CB] hover:bg-[#a6f0b8] text-[#168E33] font-bold text-[15px] rounded-xl transition-all shadow-sm shadow-[#168E33]/5 active:scale-[0.99] flex items-center justify-center select-none"
          >
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5 text-[#168E33]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              'Add User'
            )}
          </button>

          {/* Cancel Button */}
          <Link href="/dashboard/vendors" className="flex-1">
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