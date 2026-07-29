"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { use } from "react";
import { ChevronRight, Ban } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";

import { EventBanner } from "@/components/dashboard/events/EventBanner";
import { EventDetailsGrid } from "@/components/dashboard/events/EventDetailsGrid";
import { EventActionButtons } from "@/components/dashboard/events/EventActionButtons";

import type { EventDetailsData } from "@/data/event-details";
import { apiFetch } from "@/services/apiClient";
import { adminService } from "@/services/adminService";
import { LoadingState, ErrorState } from "@/components/ui/AsyncStates";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  const [eventData, setEventData] = useState<EventDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvingCancellation, setApprovingCancellation] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [cancellationSuccess, setCancellationSuccess] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const fetchEventDetails = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch<unknown>(`/admin/events/${eventId}`);
      const obj =
        res && typeof res === "object"
          ? (res as Record<string, unknown>)
          : null;
      const payload = obj ? (obj["data"] ?? obj["event"] ?? obj) : res;

      const r = (payload || {}) as Record<string, unknown>;

      const ratingVal = r.rating as unknown;
      const reviewCountVal = (r.review_count ??
        r.reviews_count ??
        r.reviewsCount ??
        r.reviewCount) as unknown;

      const mapped: EventDetailsData = {
        id: (r.event_id as string) || (r.id as string) || eventId,
        category: (r.category as string) || "",
        eventType: (r.event_type as string) || (r.eventType as string) || "",
        title: (r.title as string) || "",
        vendorName:
          (r.vendor_name as string) || (r.vendorName as string) || "",
        totalUsers: r.total_users
          ? String(r.total_users)
          : (r.totalUsers as string) || "0",
        price:
          typeof r.price === "number"
            ? `# ${Number(r.price).toLocaleString()}`
            : (r.price as string) || "",
        dateTime: (r.date_time as string) || (r.dateTime as string) || "",
        workingHours:
          (r.working_hours as string) ||
          (r.workingHours as string) ||
          undefined,
        status: (r["status"] as string) || "active",
        rating: typeof ratingVal === "number" ? (ratingVal as number) : 0,
        reviewsCount:
          typeof reviewCountVal === "number"
            ? (reviewCountVal as number)
            : Number(reviewCountVal as string) || 0,
        bannerUrls: Array.isArray(r.banner_urls)
          ? (r.banner_urls as string[])
          : r.cover_image_url
            ? [String(r.cover_image_url)]
            : Array.isArray(r.images)
              ? (r.images as string[])
              : [],
        description: (r.description as string) || "",
        location: (r.venue_name as string) || (r.location as string) || "",
        address: (r.venue_address as string) || (r.address as string) || "",
      };

      setEventData(mapped);
    } catch (err) {
      console.error("Failed to fetch event details:", err);
      setEventData(null);
      setError(err instanceof Error ? err.message : "Failed to load event");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    void fetchEventDetails();
  }, [fetchEventDetails]);

  const handleApproveCancellation = async () => {
    if (
      !confirm(
        "Are you sure you want to approve this vendor cancellation request? This will automatically refund all booked users.",
      )
    )
      return;

    setApprovingCancellation(true);
    setCancellationSuccess(false);
    setActionMessage("");

    try {
      await adminService.approveEventCancellation(eventId);
      setCancellationSuccess(true);
      setEventData((prev) => (prev ? { ...prev, status: "cancelled" } : prev));
    } catch (err) {
      console.error(err);
      alert("Failed to approve event cancellation.");
    } finally {
      setApprovingCancellation(false);
    }
  };

  const handleBlockToggle = async () => {
    if (!eventData) return;
    const currentlyBlocked =
      eventData.status.toLowerCase() === "blocked" ||
      eventData.status.toLowerCase() === "inactive";
    const nextBlocked = !currentlyBlocked;
    if (
      !confirm(
        nextBlocked
          ? "Block this event? It will be hidden from users."
          : "Unblock this event?",
      )
    )
      return;

    setBlocking(true);
    setActionMessage("");
    try {
      await adminService.blockEvent(eventId, { is_blocked: nextBlocked });
      setEventData((prev) =>
        prev
          ? { ...prev, status: nextBlocked ? "blocked" : "active" }
          : prev,
      );
      setActionMessage(nextBlocked ? "Event blocked." : "Event unblocked.");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to update event status");
    } finally {
      setBlocking(false);
    }
  };

  if (loading) {
    return (
      <>
        <Topbar title="Event Details" />
        <main className="flex-1 p-8 bg-[#F8F9FA]">
          <LoadingState />
        </main>
      </>
    );
  }

  if (error || !eventData) {
    return (
      <>
        <Topbar title="Event Details" />
        <main className="flex-1 p-8 bg-[#F8F9FA]">
          <ErrorState
            message={error || "Event not found"}
            onRetry={() => void fetchEventDetails()}
          />
        </main>
      </>
    );
  }

  const statusLower = eventData.status.toLowerCase();
  const showCancelActions = statusLower === "pending_cancellation";
  const isBlocked = statusLower === "blocked" || statusLower === "inactive";

  return (
    <>
      <Topbar title="Event Details" />

      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        <div className="max-w-[1100px]">
          <div className="flex items-center gap-2 text-[15px] font-medium mb-10 select-none flex-wrap">
            <Link
              href="/dashboard/events"
              className="text-neutral-900 hover:text-[#6312E1] transition-colors"
            >
              All Events
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
            {eventData.vendorName ? (
              <>
                <span className="text-neutral-900">{eventData.vendorName}</span>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </>
            ) : null}
            <span className="text-neutral-900">{eventData.title || eventId}</span>
          </div>

          <EventBanner urls={eventData.bannerUrls} />

          <EventDetailsGrid data={eventData} eventId={eventId} />

          {showCancelActions && (
            <div className="w-full bg-[#FFE8E8] border border-[#D82F2F]/20 rounded-3xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 select-none animate-in fade-in duration-300">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#D82F2F] flex items-center justify-center text-white">
                  <Ban className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="flex flex-col text-left">
                  <h4 className="text-[16px] font-bold text-neutral-950">
                    Pending Vendor Cancellation Request
                  </h4>
                  <p className="text-xs font-semibold text-neutral-600 mt-1 max-w-lg leading-relaxed">
                    This vendor has requested to cancel this event. Approving
                    this request will remove the listing and trigger automatic
                    user refunds.
                  </p>
                </div>
              </div>

              <button
                onClick={() => void handleApproveCancellation()}
                disabled={approvingCancellation}
                className="h-11 px-6 bg-[#D82F2F] hover:bg-[#b41e1e] text-white font-bold text-xs rounded-xl shadow-sm transition-all focus:outline-none flex items-center justify-center min-w-[170px]"
              >
                {approvingCancellation
                  ? "Processing..."
                  : "Approve Cancellation"}
              </button>
            </div>
          )}

          {cancellationSuccess && (
            <div className="mb-8 p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold transition-all">
              Event cancellation approved, refunds queued successfully!
            </div>
          )}

          {actionMessage && (
            <div className="mb-8 p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold">
              {actionMessage}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              type="button"
              onClick={() => void handleBlockToggle()}
              disabled={blocking}
              className={`h-12 px-6 font-bold text-sm rounded-2xl transition-all ${
                isBlocked
                  ? "bg-[#C6F7D0] text-[#168E33] hover:bg-[#b3f2be]"
                  : "bg-[#FAD4D4] text-[#D82F2F] hover:bg-[#f6c2c2]"
              }`}
            >
              {blocking
                ? "Updating..."
                : isBlocked
                  ? "Unblock Event"
                  : "Block Event"}
            </button>
            <Link
              href={`/dashboard/events/${eventId}/users`}
              className="h-12 px-6 inline-flex items-center justify-center bg-white border border-neutral-200 text-neutral-900 font-bold text-sm rounded-2xl hover:border-[#6312E1] transition-all"
            >
              View attendees
            </Link>
          </div>

          {showCancelActions && (
            <EventActionButtons
              onApprove={handleApproveCancellation}
            />
          )}
        </div>
      </main>
    </>
  );
}
