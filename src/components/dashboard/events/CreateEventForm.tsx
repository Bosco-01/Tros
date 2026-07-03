'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { X, Upload, ChevronDown } from 'lucide-react';
import { apiFetch } from '@/services/apiClient';

export const CreateEventForm: React.FC = () => {
  const [eventType, setEventType] = useState<'Booking Event' | 'Places to Visit'>('Booking Event');
  const [vendorName, setVendorName] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [pricing, setPricing] = useState('Starting from ₦1,000');
  const [dateTime, setDateTime] = useState('');
  const [workingHours, setWorkingHours] = useState('Open now, closes 19:00');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartFileSelector = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedList = Array.from(e.target.files);
      // Append selected files to state list
      setUploadedFiles((prev) => [...prev, ...selectedList]);
    }
  };

  const handleDeleteFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Form Validations
    if (!vendorName.trim()) {
      setError('Please enter the Vendor Name.');
      return;
    }
    if (!eventTitle.trim()) {
      setError('Please enter the Event Title.');
      return;
    }
    if (!location.trim()) {
      setError('Please enter the Location.');
      return;
    }
    if (!address.trim()) {
      setError('Please enter the Address.');
      return;
    }
    if (!pricing.trim()) {
      setError('Please enter the Pricing.');
      return;
    }
    if (eventType === 'Booking Event' && !dateTime.trim()) {
      setError('Please specify the Date and Time.');
      return;
    }
    if (eventType === 'Places to Visit' && !workingHours.trim()) {
      setError('Please specify the Working Hours.');
      return;
    }
    
    // Strict verification check for minimum 3 media uploads
    if (uploadedFiles.length < 3) {
      setError('You must upload at least a minimum of 3 images for the event gallery.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Complete Event creation REST request payload
      const formData = new FormData();
      formData.append('title', eventTitle);
      formData.append('description', `${eventType} onboarding manual upload`);
      formData.append('venue_name', location);
      formData.append('venue_address', address);
      formData.append('category_id', 'temp-category-id-99');
      formData.append('price', pricing);

      // Append conditional fields
      if (eventType === 'Booking Event') {
        formData.append('start_date', dateTime);
        formData.append('end_date', dateTime);
      } else {
        formData.append('working_hours', workingHours);
      }

      // Append all multiple media files
      uploadedFiles.forEach((file) => {
        formData.append('images', file);
      });

      await apiFetch('/admin/events', {
        method: 'POST',
        body: formData,
      });

      setSuccess(true);
      resetForm();
    } catch (err) {
      setError('Failed to register the platform event. Please verify backend connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setVendorName('');
    setEventTitle('');
    setLocation('');
    setAddress('');
    setPricing('Starting from ₦1,000');
    setDateTime('');
    setWorkingHours('Open now, closes 19:00');
    setUploadedFiles([]);
  };

  return (
    <div className="bg-[#F8F9FA] rounded-[24px] p-8 md:p-10 w-full max-w-[640px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-neutral-100 flex flex-col relative select-none">
      
      {/* Header containing X close cross button */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
          Create Event
        </h2>
        <Link 
          href="/dashboard/events" 
          className="text-neutral-400 hover:text-neutral-900 transition-colors focus:outline-none"
          aria-label="Close"
        >
          <X className="w-6 h-6 stroke-[2.2]" />
        </Link>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Event Type Select (Dropdown Trigger) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-neutral-500">Event Type</label>
          <div className="relative w-full">
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as any)}
              className="bg-white rounded-xl px-5 h-14 border border-neutral-100/50 font-bold text-neutral-900 text-[16px] w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all appearance-none cursor-pointer pr-12"
            >
              <option value="Booking Event">Booking Event</option>
              <option value="Places to Visit">Places to Visit</option>
            </select>
            <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
              <ChevronDown className="w-5 h-5 stroke-[2.2]" />
            </span>
          </div>
        </div>

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

        {/* Event Title */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-neutral-500">Event Title</label>
          <input
            type="text"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            className="bg-white rounded-xl px-5 h-14 border border-neutral-100/50 font-bold text-neutral-900 text-[16px] w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-neutral-500">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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

        {/* Pricing */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-neutral-500">Pricing</label>
          <input
            type="text"
            value={pricing}
            onChange={(e) => setPricing(e.target.value)}
            className="bg-white rounded-xl px-5 h-14 border border-neutral-100/50 font-bold text-neutral-900 text-[16px] w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all"
          />
        </div>

        {/* Conditional Field: Date/Time vs Working Hours */}
        {eventType === 'Booking Event' ? (
          <div className="flex flex-col gap-2 animate-in fade-in duration-300">
            <label className="text-sm font-semibold text-neutral-500">Date and Time</label>
            <input
              type="text"
              placeholder="e.g. 24-03-2026 20:00"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="bg-white rounded-xl px-5 h-14 border border-neutral-100/50 font-bold text-neutral-900 text-[16px] w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2 animate-in fade-in duration-300">
            <label className="text-sm font-semibold text-neutral-500">Working Hours</label>
            <input
              type="text"
              placeholder="e.g. Open now, closes 19:00"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              className="bg-white rounded-xl px-5 h-14 border border-neutral-100/50 font-bold text-neutral-900 text-[16px] w-full focus:outline-none focus:border-[#6312E1] focus:ring-1 focus:ring-[#6312E1] transition-all"
            />
          </div>
        )}

        {/* Multi-Image Media Upload Area */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-neutral-500">Media Uploads (Minimum of 3)</label>
          <div 
            onClick={handleStartFileSelector}
            className="w-full h-24 bg-white border border-dashed border-neutral-300 hover:border-[#6312E1] rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <Upload className="w-6 h-6 text-neutral-500" />
            <span className="text-xs font-bold text-neutral-700">Choose images to upload</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".png,.jpg,.jpeg"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* List of currently selected files with quick remove capability */}
          {uploadedFiles.length > 0 && (
            <div className="flex flex-col gap-2 mt-1">
              {uploadedFiles.map((file, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-neutral-100/50 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold text-neutral-900 shadow-sm"
                >
                  <span className="truncate max-w-[400px]">{file.name}</span>
                  <button 
                    onClick={() => handleDeleteFile(idx)}
                    type="button" 
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <span className="text-[11px] text-neutral-500 font-medium pl-1">
                Total Files: <span className="font-bold text-neutral-800">{uploadedFiles.length}</span> (Requires at least 3)
              </span>
            </div>
          )}
        </div>

        {success && (
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold transition-all">
            Event successfully created on the platform!
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold transition-all">
            {error}
          </div>
        )}

        {/* Actions Row */}
        <div className="flex items-center gap-6 mt-4 w-full">
          {/* Submit */}
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
              'Create Event'
            )}
          </button>

          {/* Cancel */}
          <Link href="/dashboard/events" className="flex-1">
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