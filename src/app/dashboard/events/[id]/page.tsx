"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { use } from "react";
import { ChevronRight, Ban } from "lucide-react";
import { Topbar } from "@/components/layout/topbar"; // Note: Matches lowercase filename on disk

import { EventBanner } from "@/components/dashboard/events/EventBanner";
import { EventDetailsGrid } from "@/components/dashboard/events/EventDetailsGrid";
import { RefundFormCard } from "@/components/dashboard/events/RefundFormCard";
import { EventActionButtons } from "@/components/dashboard/events/EventActionButtons";

import { mockEventDetails } from "@/data/event-details";
import { apiFetch } from "@/services/apiClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  const [eventData, setEventData] = useState(mockEventDetails);
  const [loading, setLoading] = useState(true);
  const [approvingCancellation, setApprovingCancellation] = useState(false);
  const [cancellationSuccess, setCancellationSuccess] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        // Calls GET /admin/events/{eventId} on mount
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

        const mapped = {
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
              : [],
          description: (r.description as string) || "",
          location: (r.venue_name as string) || (r.location as string) || "",
          address: (r.venue_address as string) || (r.address as string) || "",
        };

        setEventData(mapped);
      } catch (err) {
        console.warn(
          "Failed to fetch live event details. Falling back to simulation data.",
          err,
        );
        // Set mock status to pending_cancellation for testing purposes!
        setEventData({
          ...mockEventDetails,
          status: "pending_cancellation",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleApproveCancellation = async () => {
    if (
      !confirm(
        "Are you sure you want to approve this vendor cancellation request? This will automatically refund all booked users.",
      )
    )
      return;

    setApprovingCancellation(true);
    setCancellationSuccess(false);

    try {
      // Calls POST /admin/events/{id}/approve-cancellation precisely matching Swagger spec
      await apiFetch(`/admin/events/${eventId}/approve-cancellation`, {
        method: "POST",
      });
      setCancellationSuccess(true);
      setEventData((prev) => ({ ...prev, status: "cancelled" }));
    } catch (err) {
      console.error(err);
      alert("Failed to approve event cancellation.");
    } finally {
      setApprovingCancellation(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FDFDFE] min-h-screen">
        <svg
          className="animate-spin h-10 w-10 text-[#6312E1]"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  return (
    <>
      <Topbar title="Event Details" />

      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        <div className="max-w-[1100px]">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[15px] font-medium mb-10 select-none">
            <Link
              href="/dashboard/vendors"
              className="text-neutral-900 hover:text-[#6312E1] transition-colors"
            >
              All Vendors
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-900">John Doe</span>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-900">{eventData.title}</span>
          </div>

          <EventBanner urls={eventData.bannerUrls} />

          {/* Dynamic Details Grid */}
          <EventDetailsGrid data={eventData} eventId={eventId} />

          {/* ========================================================================
              VENDOR CANCELLATION REQUESTS PANEL (POST /approve-cancellation)
              ======================================================================== */}
          {eventData.status === "pending_cancellation" && (
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
                onClick={handleApproveCancellation}
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

          <RefundFormCard />

          <EventActionButtons />
        </div>
      </main>
    </>
  );
}
