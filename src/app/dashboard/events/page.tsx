"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { EventsListFilters } from "@/components/dashboard/events/EventsListFilters";
import { EventsListTable } from "@/components/dashboard/events/EventsListTable";
import type { EventRowData } from "@/data/events-list";
import { apiFetch } from "@/services/apiClient";
import type { AdminEvent, PaginatedResponse } from "@/types/admin";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/AsyncStates";

function extractEventsList(resp: unknown): AdminEvent[] {
  if (!resp || typeof resp !== "object") return [];
  const r = resp as Record<string, unknown>;
  if (Array.isArray(r.events)) return r.events as AdminEvent[];
  if (Array.isArray(r.items)) return r.items as AdminEvent[];
  if (r.data && typeof r.data === "object") {
    const d = r.data as Record<string, unknown>;
    if (Array.isArray(d)) return d as unknown as AdminEvent[];
    if (Array.isArray(d.events)) return d.events as AdminEvent[];
  }
  return [];
}

function mapEventRow(ev: AdminEvent): EventRowData {
  const rEv = ev as unknown as Record<string, unknown>;
  const id = (rEv.event_id as string) || (rEv.id as string) || "";
  const category = (rEv.category as string) || "Other";
  const title = (rEv.title as string) || "Untitled Event";
  const eventType =
    (rEv.event_type as string) || (rEv.eventType as string) || "";
  const priceVal = rEv.price as unknown;
  const price =
    typeof priceVal === "number"
      ? `# ${(priceVal as number).toLocaleString()}`
      : String(priceVal || "");
  const date = (rEv.date_time as string) || (rEv.date as string) || "";
  const vendorName =
    (rEv.vendor_name as string) || (rEv.vendorName as string) || "";
  const vendorId =
    (rEv.vendor_id as string) || (rEv.vendorId as string) || "";
  const statusRaw = (rEv.status as string) || "active";
  const status = statusRaw
    ? statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1)
    : "Active";
  return {
    id,
    category,
    title,
    eventType,
    price,
    date,
    time: "",
    vendorName,
    vendorId,
    status,
  };
}

export default function AllEventsPage() {
  const [events, setEvents] = useState<EventRowData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEvents = useCallback(async (opts?: { search?: string; status?: string }) => {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams();
      if (opts?.search) query.set("search", opts.search);
      if (opts?.status) query.set("status", opts.status);
      query.set("page", "1");
      query.set("limit", "50");

      const resp = await apiFetch<PaginatedResponse<AdminEvent>>(
        `/admin/events?${query.toString()}`,
      );
      setEvents(extractEventsList(resp).map(mapEventRow));
    } catch (err) {
      console.error("Failed to load events from backend:", err);
      setEvents([]);
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const handleRemoveFilter = (filter: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
  };

  const handleSearchClick = async () => {
    await loadEvents({ search: searchQuery, status: statusFilter });
  };

  const filteredEvents = events.filter((event) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      event.category.toLowerCase().includes(q) ||
      event.title.toLowerCase().includes(q) ||
      event.vendorName.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "" ||
      event.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Topbar title="All Events" />

      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between gap-4 mb-8 w-full max-w-[1100px] select-none">
          <h2 className="text-xl md:text-[22px] font-bold text-neutral-900 tracking-tight">
            All Events
          </h2>
          <Link href="/dashboard/events/create">
            <button className="flex items-center gap-2.5 px-6 py-3 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold text-sm rounded-full transition-colors focus:outline-none shadow-sm shadow-[#6312E1]/10">
              <div className="w-5 h-5 bg-white text-[#6312E1] flex items-center justify-center rounded-md font-extrabold text-xs">
                +
              </div>
              <span>Create Event</span>
            </button>
          </Link>
        </div>

        <EventsListFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          onSearchClick={handleSearchClick}
        />

        <div className="w-full">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={() => void loadEvents()} />
          ) : filteredEvents.length === 0 ? (
            <EmptyState message="No events found." />
          ) : (
            <EventsListTable data={filteredEvents} />
          )}
        </div>
      </main>
    </>
  );
}
