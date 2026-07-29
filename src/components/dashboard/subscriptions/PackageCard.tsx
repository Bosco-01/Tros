'use client';

import React, { useState } from 'react';
import { Check, Edit3, Save, X } from 'lucide-react';
import { adminService } from '@/services/adminService';

interface PackageData {
  id: string;
  name: string;
  price: number;
  description?: string;
  max_events: number;
  max_tickets_per_event: number;
  can_access_reports?: boolean;
  can_broadcast?: boolean;
  is_active?: boolean;
}

interface PackageCardProps {
  data: PackageData;
  onRefresh?: () => void;
}


export const PackageCard: React.FC<PackageCardProps> = ({ data, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Edit form states bound to backend schema fields
  const [name, setName] = useState(data.name);
  const [price, setPrice] = useState(data.price);
  const [maxEvents, setMaxEvents] = useState(data.max_events);
  const [maxTickets, setMaxTickets] = useState(data.max_tickets_per_event);
  const [reports, setReports] = useState(data.can_access_reports || false);
  const [broadcast, setCanBroadcast] = useState(data.can_broadcast || false);

  const handleToggleEdit = () => {
    if (isEditing) {
      // Revert edits on cancel
      setName(data.name);
      setPrice(data.price);
      setMaxEvents(data.max_events);
      setMaxTickets(data.max_tickets_per_event);
      setReports(data.can_access_reports || false);
      setCanBroadcast(data.can_broadcast || false);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Calls PATCH /admin/subscription-plans/{planId} via adminService precisely matching Swagger spec
      await adminService.updateSubscriptionPlan(data.id, {
        name,
        price: Number(price),
        max_events: Number(maxEvents),
        max_tickets_per_event: Number(maxTickets),
        can_access_reports: reports,
        can_broadcast: broadcast,
        description: data.description || 'System pricing package plan',
        is_active: data.is_active ?? true,
      });

      setIsEditing(false);
      onRefresh?.(); // Trigger parent listings refresh
    } catch (err) {
      alert('Failed to update subscription plan.');
    } finally {
      setLoading(false);
    }
  };


  const getHeaderBg = () => {
    if (data.name.toLowerCase().includes('basic')) return 'bg-[#6312E1]'; // Purple header
    return 'bg-[#FF5C00]'; // Orange header
  };

  // Maps backend limits dynamically into your beautiful descriptive bullet points!
  const displayFeatures = [
    `Up to ${data.max_events === 9999 ? 'unlimited' : data.max_events} events`,
    `Up to ${data.max_tickets_per_event === 9999 ? 'unlimited' : data.max_tickets_per_event} tickets per event`,
    data.can_broadcast ? 'Broadcast access' : 'No broadcast access',
    data.can_access_reports ? 'Reports access' : 'No reports access',
    data.max_events === 9999 && data.can_broadcast ? 'Unlimited events and broadcasts' : '',
  ].filter(Boolean); // Remove empty values

  const inputClass = "border border-neutral-300 rounded-lg px-2.5 py-1 text-sm font-semibold focus:outline-none focus:border-[#6312E1]";

  return (
    <div className="bg-white rounded-[24px] overflow-hidden border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[440px] animate-in fade-in duration-300">

      {/* Header Banner */}
      <div className={`py-4 px-6 text-white text-base font-bold select-none ${getHeaderBg()}`}>
        {isEditing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent border-b border-white/50 text-white font-bold focus:outline-none w-full"
          />
        ) : (
          data.name
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between gap-5">

        {/* Pricing Layout */}
        <div className="text-[28px] font-bold text-neutral-900 border-b border-neutral-50 pb-4 flex items-center">
          {isEditing ? (
            <div className="flex items-center gap-1.5 w-full">
              <span className="text-lg">₦</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="text-lg font-bold border border-neutral-300 rounded-lg px-2.5 py-1 w-28 focus:outline-none focus:border-[#6312E1]"
              />
              <span className="text-xs text-neutral-500 font-medium">/ monthly</span>
            </div>
          ) : (
            <>
              {data.price.toLocaleString()}
              <span className="text-xs text-neutral-500 font-semibold ml-1.5 mt-2 select-none">/ monthly</span>
            </>
          )}
        </div>

        {/* Feature List (Dropdown edits vs static checklist) */}
        <div className="flex flex-col gap-4 text-sm font-medium text-neutral-600 leading-none">
          {isEditing ? (
            <div className="flex flex-col gap-3">
              {/* Max Events Limit */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-neutral-500">Max Events:</span>
                <input
                  type="number"
                  value={maxEvents}
                  onChange={(e) => setMaxEvents(Number(e.target.value))}
                  className={inputClass}
                />
              </div>

              {/* Max Tickets Limit */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-neutral-500">Max Tickets:</span>
                <input
                  type="number"
                  value={maxTickets}
                  onChange={(e) => setMaxTickets(Number(e.target.value))}
                  className={inputClass}
                />
              </div>

              {/* Reports Toggle Check */}
              <label className="flex items-center gap-2.5 cursor-pointer mt-1 select-none">
                <input
                  type="checkbox"
                  checked={reports}
                  onChange={(e) => setReports(e.target.checked)}
                  className="w-4 h-4 accent-[#6312E1]"
                />
                <span className="text-xs font-semibold text-neutral-500">Allow Access Reports</span>
              </label>

              {/* Broadcast Toggle Check */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={broadcast}
                  onChange={(e) => setCanBroadcast(e.target.checked)}
                  className="w-4 h-4 accent-[#6312E1]"
                />
                <span className="text-xs font-semibold text-neutral-500">Allow Access Broadcasts</span>
              </label>
            </div>
          ) : (
            /* Static checklist showing dynamic mapped points */
            <ul className="flex flex-col gap-3">
              {displayFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-neutral-600 font-semibold select-none leading-none">
                  <Check className="w-4 h-4 text-[#6312E1] stroke-[2.8]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action Button Trigger */}
        <div className="pt-4 border-t border-neutral-100 select-none">
          {isEditing ? (
            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="flex-1 h-9 bg-emerald-50 hover:bg-emerald-100 text-[#168E33] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors focus:outline-none"
              >
                {loading ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> Save
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleToggleEdit}
                className="flex-1 h-9 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors focus:outline-none"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleToggleEdit}
              className="w-full h-9 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors focus:outline-none"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          )}
        </div>

      </div>

    </div>
  );
};