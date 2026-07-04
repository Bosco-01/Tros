'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Topbar } from '@/components/layout/topbar'; // Note: Matches lowercase on-disk config
import { EventsListFilters } from '@/components/dashboard/events/EventsListFilters';
import { EventsListTable } from '@/components/dashboard/events/EventsListTable';
import { mockEventsList, EventRowData } from '@/data/events-list';
import { apiFetch } from '@/services/apiClient';
import type { AdminEvent, PaginatedResponse } from '@/types/admin';

export default function AllEventsPage() {
  const [events, setEvents] = useState<EventRowData[]>(mockEventsList);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>(['Nightlife', 'Music', 'Hotels']);

  // Fetch newly created events from localStorage on mount and merge them into your table!
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const resp = await apiFetch<PaginatedResponse<AdminEvent>>('/admin/events?page=1&limit=50');
        const maybe = resp as unknown;
        let list: AdminEvent[] = [];
        if (maybe && typeof maybe === 'object') {
          const r = maybe as Record<string, unknown>;
          if (Array.isArray(r.events)) {
            list = r.events as AdminEvent[];
          } else if (r.data && typeof r.data === 'object') {
            const d = r.data as unknown;
            if (Array.isArray(d as AdminEvent[])) {
              list = d as AdminEvent[];
            } else if (d && typeof d === 'object') {
              const rd = d as Record<string, unknown>;
              if (Array.isArray(rd.events)) list = rd.events as AdminEvent[];
            }
          } else if (Array.isArray(r.items)) {
            list = r.items as AdminEvent[];
          }
        }

        const mapped: EventRowData[] = list.map((ev) => {
          const rEv = ev as unknown as Record<string, unknown>;
          const id = (rEv.event_id as string) || (rEv.id as string) || '';
          const category = (rEv.category as string) || 'Other';
          const title = (rEv.title as string) || 'Untitled Event';
          const eventType = (rEv.event_type as string) || (rEv.eventType as string) || '';
          const priceVal = rEv.price as unknown;
          const price = typeof priceVal === 'number' ? `# ${(priceVal as number).toLocaleString()}` : String(priceVal || '');
          const date = (rEv.date_time as string) || (rEv.date as string) || '';
          const vendorName = (rEv.vendor_name as string) || (rEv.vendorName as string) || '';
          const vendorId = (rEv.vendor_id as string) || (rEv.vendorId as string) || '';
          const statusRaw = (rEv.status as string) || 'active';
          const status = statusRaw ? statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1) : 'Active';
          return {
            id,
            category,
            title,
            eventType,
            price,
            date,
            time: '',
            vendorName,
            vendorId,
            status,
          };
        });

        // Merge any stored custom events (if present) and then the backend list
        const final: EventRowData[] = [];
        try {
          const stored2 = localStorage.getItem('trios_custom_events');
          if (stored2) {
            const customEvents = JSON.parse(stored2);
            if (Array.isArray(customEvents)) final.push(...customEvents);
          }
        } catch {}

        final.push(...mapped);
        setEvents(final.length ? final : mockEventsList);
      } catch (err) {
        console.error('Failed to load events from backend:', err);
      }
    };

    void loadEvents();
  }, []);

  const handleRemoveFilter = (filter: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
  };

  // Triggered when the Search button is clicked (or Enter pressed)
  const handleSearchClick = async () => {
    try {
      const query = new URLSearchParams();
      if (searchQuery) query.set('search', searchQuery);
      if (statusFilter) query.set('status', statusFilter);
      query.set('page', '1');
      query.set('limit', '50');

      const resp = await apiFetch<PaginatedResponse<AdminEvent>>(`/admin/events?${query.toString()}`);
      const maybe = resp as unknown;
      let list: AdminEvent[] = [];
      if (maybe && typeof maybe === 'object') {
        const r = maybe as Record<string, unknown>;
        if (Array.isArray(r.events)) list = r.events as AdminEvent[];
        else if (r.data && typeof r.data === 'object') {
          const d = r.data as unknown;
          if (Array.isArray(d as AdminEvent[])) list = d as AdminEvent[];
          else if (d && typeof d === 'object') {
            const rd = d as Record<string, unknown>;
            if (Array.isArray(rd.events)) list = rd.events as AdminEvent[];
          }
        } else if (Array.isArray(r.items)) list = r.items as AdminEvent[];
      }

      const mapped: EventRowData[] = list.map((ev) => {
        const rEv = ev as unknown as Record<string, unknown>;
        const id = (rEv.event_id as string) || (rEv.id as string) || '';
        const category = (rEv.category as string) || 'Other';
        const title = (rEv.title as string) || 'Untitled Event';
        const eventType = (rEv.event_type as string) || (rEv.eventType as string) || '';
        const priceVal = rEv.price as unknown;
        const price = typeof priceVal === 'number' ? `# ${(priceVal as number).toLocaleString()}` : String(priceVal || '');
        const date = (rEv.date_time as string) || (rEv.date as string) || '';
        const vendorName = (rEv.vendor_name as string) || (rEv.vendorName as string) || '';
        const vendorId = (rEv.vendor_id as string) || (rEv.vendorId as string) || '';
        const statusRaw = (rEv.status as string) || 'active';
        const status = statusRaw ? statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1) : 'Active';
        return { id, category, title, eventType, price, date, time: '', vendorName, vendorId, status };
      });

      setEvents(mapped.length ? mapped : []);
    } catch (err) {
      console.error('Search request failed:', err);
    }
  };

  // Perform dynamic search and status filtering
  const filteredEvents = events.filter((event) => {
    // Matches by Category or Event Title or Vendor Name
    const matchesSearch = 
      event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.vendorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === '' || 
      event.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Topbar title="All Events" />
      
      {/* 
        Main content wrapper with slightly grey background 
        so the pure white layout forms and tables stand out.
      */}
      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        
        {/* Header Title & Actions Row (Alined top-right under Topbar admin panel) */}
        <div className="flex items-center justify-between gap-4 mb-8 w-full max-w-[1100px] select-none">
          <h2 className="text-xl md:text-[22px] font-bold text-neutral-900 tracking-tight">
            All Events
          </h2>
          {/* Create Event Action Button */}
          <Link href="/dashboard/events/create">
            <button className="flex items-center gap-2.5 px-6 py-3 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold text-sm rounded-full transition-colors focus:outline-none shadow-sm shadow-[#6312E1]/10">
              <div className="w-5 h-5 bg-white text-[#6312E1] flex items-center justify-center rounded-md font-extrabold text-xs">
                +
              </div>
              <span>Create Event</span>
            </button>
          </Link>
        </div>

        {/* Dynamic Filter selection bars */}
        <EventsListFilters 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          onSearchClick={handleSearchClick}
        />

        {/* Directory Data List Table with real-time filtered results */}
        <div className="w-full">
          <EventsListTable data={filteredEvents} />
        </div>

      </main>
    </>
  );
}