'use client';

import React, { useState } from 'react';
import { ChevronDown, Trash2, Plus, Edit2, Save, X } from 'lucide-react';
import { EventDetailsData } from '@/data/event-details';
import { EventBanner } from './EventBanner';

interface EventDetailsManagerProps {
  initialData: EventDetailsData;
  onSave: (updatedData: EventDetailsData) => void;
}

export const EventDetailsManager: React.FC<EventDetailsManagerProps> = ({ initialData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<EventDetailsData>(initialData);

  // Form States
  const [category, setCategory] = useState(data.category);
  const [eventType, setEventType] = useState(data.eventType);
  const [title, setTitle] = useState(data.title);
  const [vendorName, setVendorName] = useState(data.vendorName);
  const [price, setPrice] = useState(data.price.toLowerCase() === 'free' ? '' : data.price);
  const [dateTime, setDateTime] = useState(data.dateTime || '');
  const [workingHours, setWorkingHours] = useState(data.workingHours || '');
  const [location, setLocation] = useState(data.location);
  const [address, setAddress] = useState(data.address);
  const [description, setDescription] = useState(data.description);
  const [bannerUrls, setBannerUrls] = useState<string[]>(data.bannerUrls);
  const [newUrl, setNewUrl] = useState('');

  const handleToggleEdit = () => {
    if (isEditing) {
      // Revert states on cancel
      setCategory(data.category);
      setEventType(data.eventType);
      setTitle(data.title);
      setVendorName(data.vendorName);
      setPrice(data.price.toLowerCase() === 'free' ? '' : data.price);
      setDateTime(data.dateTime || '');
      setWorkingHours(data.workingHours || '');
      setLocation(data.location);
      setAddress(data.address);
      setDescription(data.description);
      setBannerUrls(data.bannerUrls);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    const updated: EventDetailsData = {
      ...data,
      category,
      eventType,
      title,
      vendorName,
      price: price.trim() === '' ? '' : price, // If blank, retained as blank representing Free
      dateTime: eventType === 'Booking Event' ? dateTime : undefined,
      workingHours: eventType === 'Places to Visit' ? workingHours : undefined,
      location,
      address,
      description,
      bannerUrls,
    };
    setData(updated);
    onSave(updated);
    setIsEditing(false);
  };

  const handleAddMediaUrl = () => {
    if (newUrl.trim()) {
      setBannerUrls([...bannerUrls, newUrl.trim()]);
      setNewUrl('');
    }
  };

  const handleRemoveMediaUrl = (index: number) => {
    setBannerUrls(bannerUrls.filter((_, idx) => idx !== index));
  };

  const ViewField = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-2">
      <span className="text-[15px] font-medium text-neutral-500">{label}</span>
      <div className="bg-white rounded-xl px-5 h-14 flex items-center text-[16px] font-bold text-neutral-900 w-full shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] border border-neutral-100/50">
        {value || ' '}
      </div>
    </div>
  );

  const EditField = ({
    label,
    value,
    onChange,
    placeholder,
  }: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
  }) => (
    <div className="flex flex-col gap-2">
      <label className="text-[14px] font-semibold text-neutral-500">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-14 px-5 bg-white border border-neutral-300 rounded-xl text-[16px] font-bold text-neutral-900 w-full focus:outline-none focus:border-[#6312E1]"
      />
    </div>
  );

  return (
    <div className="w-full flex flex-col max-w-[1100px]">
      
      {/* Dynamic Gallery/Carousel or Edit Media Manager */}
      {!isEditing ? (
        <EventBanner urls={bannerUrls} />
      ) : (
        <div className="w-full bg-white rounded-3xl p-6 border border-neutral-200/80 mb-8 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-neutral-500 leading-none">Manage Carousel Media</h3>
          <div className="flex flex-col gap-3">
            {bannerUrls.map((url, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-neutral-50 p-3.5 rounded-xl border border-neutral-100">
                <img src={url} alt="Thumbnail" className="w-10 h-10 object-cover rounded-md" />
                <span className="text-xs text-neutral-500 truncate flex-1 font-semibold">{url}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMediaUrl(idx)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex gap-3 mt-1">
              <input
                type="text"
                placeholder="Paste Image URL here"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="flex-1 h-11 px-4 border border-neutral-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#6312E1]"
              />
              <button
                type="button"
                onClick={handleAddMediaUrl}
                className="h-11 px-4 bg-[#6312E1] hover:bg-[#520cbd] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Trigger Toggle in Card Header */}
      <div className="flex items-center justify-between mb-6 px-1 select-none">
        <h3 className="text-lg font-bold text-neutral-900 tracking-tight">Event Details Info</h3>
        <button
          onClick={handleToggleEdit}
          type="button"
          className="h-10 px-5 border border-neutral-300 hover:bg-neutral-50 text-neutral-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors focus:outline-none"
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4" /> Cancel Edit
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" /> Edit Event
            </>
          )}
        </button>
      </div>

      {/* View or Edit details block */}
      <div className="w-full flex flex-col gap-6">
        
        {/* Dynamic Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          
          {/* Category */}
          {!isEditing ? (
            <ViewField label="Category" value={data.category} />
          ) : (
            <EditField label="Category" value={category} onChange={setCategory} />
          )}

          {/* Event Type Select */}
          {!isEditing ? (
            <ViewField label="Event Type" value={data.eventType} />
          ) : (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-neutral-500">Event Type</label>
              <div className="relative w-full">
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as any)}
                  className="bg-white rounded-xl px-5 h-14 border border-neutral-300 font-bold text-neutral-900 text-[16px] w-full focus:outline-none focus:border-[#6312E1] appearance-none pr-12 cursor-pointer"
                >
                  <option value="Booking Event">Booking Event</option>
                  <option value="Places to Visit">Places to Visit</option>
                </select>
                <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                  <ChevronDown className="w-5 h-5 stroke-[2.2]" />
                </span>
              </div>
            </div>
          )}

          {/* Title */}
          {!isEditing ? (
            <ViewField label="Title" value={data.title} />
          ) : (
            <EditField label="Title" value={title} onChange={setTitle} />
          )}

          {/* Vendor Name */}
          {!isEditing ? (
            <ViewField label="Vendor Name" value={data.vendorName} />
          ) : (
            <EditField label="Vendor Name" value={vendorName} onChange={setVendorName} />
          )}

          {/* Pricing (Free Pricing maps to blank) */}
          {!isEditing ? (
            <ViewField label="Price" value={data.price.toLowerCase() === 'free' ? '' : data.price} />
          ) : (
            <EditField 
              label="Price" 
              value={price} 
              onChange={setPrice} 
              placeholder="Leave blank if Free pricing applies" 
            />
          )}

          {/* Conditional Date / Working Hours */}
          {!isEditing ? (
            data.eventType === 'Places to Visit' ? (
              <ViewField label="Working Hours" value={data.workingHours || ''} />
            ) : (
              <ViewField label="Date and Time" value={data.dateTime || ''} />
            )
          ) : eventType === 'Places to Visit' ? (
            <EditField label="Working Hours" value={workingHours} onChange={setWorkingHours} />
          ) : (
            <EditField label="Date and Time" value={dateTime} onChange={setDateTime} />
          )}

          {/* Location / Venue Name */}
          {!isEditing ? (
            <ViewField label="Location" value={data.location} />
          ) : (
            <EditField label="Location" value={location} onChange={setLocation} />
          )}

          {/* Address / Venue Address */}
          {!isEditing ? (
            <ViewField label="Address" value={data.address} />
          ) : (
            <EditField label="Address" value={address} onChange={setAddress} />
          )}

        </div>

        {/* Persistent Description Section (Rendered prominently for all event types) */}
        <div className="flex flex-col gap-2 mt-2 w-full">
          <span className="text-[15px] font-medium text-neutral-500">Description</span>
          {!isEditing ? (
            <div className="bg-white rounded-xl p-5 text-[15px] leading-relaxed font-bold text-neutral-900 border border-neutral-100/50 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] min-h-[100px]">
              {data.description}
            </div>
          ) : (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="p-5 bg-white border border-neutral-300 rounded-xl text-[15px] font-bold text-neutral-900 w-full focus:outline-none focus:border-[#6312E1] resize-none"
            />
          )}
        </div>

        {/* Dynamic Save Changes Row */}
        {isEditing && (
          <div className="flex items-center mt-2">
            <button
              onClick={handleSaveChanges}
              type="button"
              className="h-12 px-8 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold text-sm rounded-xl flex items-center gap-2 transition-all active:scale-[0.99]"
            >
              <Save className="w-4.5 h-4.5" /> Save Changes
            </button>
          </div>
        )}

      </div>

    </div>
  );
};