"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  FileCheck,
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { VendorProfileHeader } from "@/components/dashboard/vendors/VendorProfileHeader";
import { VendorDetailsGrid } from "@/components/dashboard/vendors/VendorDetailsGrid";
import { UserEventsTable } from "@/components/dashboard/users/UserEventsTable";
import { adminService } from "@/services/adminService";
import { unwrapList, unwrapEntity } from "@/lib/api-helpers";
import { mapVendorToProfile, mapAdminEventToRow } from "@/lib/mappers";
import {
  isImageUrl,
  isPdfUrl,
  resolveMediaUrl,
} from "@/lib/media";
import type {
  AdminEvent,
  AdminVendorDetail,
  VendorKYC,
  VendorProfileData,
  EventRowData,
} from "@/types/admin";
import { ErrorState } from "@/components/ui/AsyncStates";

function kycDocUrl(kyc: VendorKYC | null, kind: "nin" | "cac"): string {
  if (!kyc) return "";
  if (kind === "nin") {
    return resolveMediaUrl(
      kyc.id_document_url || kyc.nin_url || kyc.nin_doc_url,
    );
  }
  return resolveMediaUrl(kyc.cac_document_url || kyc.cac_url || kyc.cac_doc_url);
}

function DocumentPreview({
  label,
  url,
}: {
  label: string;
  url: string;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-xs font-bold text-neutral-500 pl-1">{label}</span>
      <div className="w-full h-[220px] rounded-2xl overflow-hidden border border-neutral-100 bg-neutral-50 relative flex items-center justify-center">
        {!url ? (
          <div className="flex flex-col items-center gap-2 text-neutral-400 px-4 text-center">
            <FileText className="w-8 h-8" />
            <span className="text-xs font-medium">No document uploaded</span>
          </div>
        ) : isPdfUrl(url) || (!isImageUrl(url) && url.toLowerCase().includes(".pdf")) ? (
          <div className="flex flex-col items-center gap-3 px-4 text-center">
            <FileText className="w-10 h-10 text-[#6312E1]" />
            <p className="text-xs font-medium text-neutral-600">PDF document</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6312E1] hover:underline"
            >
              Open document <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : isImageUrl(url) || !url.includes(".") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={label}
            className="absolute inset-0 w-full h-full object-contain bg-neutral-50"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 px-4 text-center">
            <FileText className="w-10 h-10 text-neutral-400" />
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6312E1] hover:underline"
            >
              Open document <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
      {url && isImageUrl(url) ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-semibold text-[#6312E1] hover:underline pl-1"
        >
          View full size
        </a>
      ) : null}
    </div>
  );
}

export default function VendorDetailsPage() {
  const params = useParams();
  const vendorId = String(params?.id ?? "");

  const [profile, setProfile] = useState<VendorProfileData | null>(null);
  const [events, setEvents] = useState<EventRowData[]>([]);
  const [kycData, setKycData] = useState<VendorKYC | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [success, setSuccess] = useState("");

  const loadVendor = useCallback(async () => {
    if (!vendorId) return;
    setLoading(true);
    setError("");

    try {
      const [vendorRes, kycRes, eventsRes] = await Promise.all([
        adminService.getVendorDetail(vendorId),
        adminService.getVendorKYC(vendorId),
        adminService.getVendorEvents(vendorId, 1, 50),
      ]);

      const vendor = unwrapEntity<AdminVendorDetail>(vendorRes);
      const eventsList = unwrapList<AdminEvent>(eventsRes);
      const kycPayload = unwrapEntity<VendorKYC>(kycRes);

      setProfile(mapVendorToProfile(vendor, eventsList.length));
      setEvents(eventsList.map(mapAdminEventToRow));
      setKycData(kycPayload);

      const statusValue = (
        vendor?.verification_status ||
        kycPayload?.verification_status ||
        ""
      )
        .toString()
        .toLowerCase();
      if (statusValue.includes("approve")) setVerificationStatus("approved");
      else if (statusValue.includes("reject")) setVerificationStatus("rejected");
      else setVerificationStatus("pending");
    } catch (err) {
      console.error("Failed to load vendor details", err);
      setError(
        err instanceof Error ? err.message : "Failed to load vendor details",
      );
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    void loadVendor();
  }, [loadVendor]);

  const handleUpdateVerification = async (status: "approved" | "rejected") => {
    if (!vendorId || actionLoading) return;
    setActionLoading(true);
    setSuccess("");
    setActionError("");

    try {
      await adminService.updateVendorStatus(vendorId, {
        verification_status: status,
        is_active: status === "approved",
      });
      setVerificationStatus(status);
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              verificationStatus: status,
              status: status === "approved" ? "Active" : "Inactive",
            }
          : prev,
      );
      setSuccess(
        status === "approved"
          ? "Vendor KYC verified successfully."
          : "Vendor KYC rejected.",
      );
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to update vendor status", err);
      setActionError(
        err instanceof Error ? err.message : "Failed to update vendor status",
      );
    } finally {
      setActionLoading(false);
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

  const ninUrl = kycDocUrl(kycData, "nin");
  const cacUrl = kycDocUrl(kycData, "cac");

  return (
    <>
      <Topbar title="Vendor Details" />
      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        <div className="max-w-[1100px] w-full">
          {error || !profile ? (
            <ErrorState
              message={error || "Vendor not found"}
              onRetry={() => void loadVendor()}
            />
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm font-medium mb-6 sm:mb-10 flex-wrap">
                <Link
                  href="/dashboard/vendors"
                  className="text-neutral-900 hover:text-[#6312E1]"
                >
                  All Vendors
                </Link>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
                <span className="text-neutral-900">{profile.fullName}</span>
              </div>

              <VendorProfileHeader data={profile} />
              <VendorDetailsGrid data={profile} />

              <div className="w-full bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col gap-6 mb-10 select-none animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-neutral-50 pb-4 flex-wrap gap-3">
                  <h3 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-[#6312E1]" /> KYC
                    Document Verification Review
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-500">
                      Current Verification:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                        verificationStatus === "approved"
                          ? "bg-[#E5F5E8] text-[#168E33]"
                          : verificationStatus === "rejected"
                            ? "bg-[#FFE8E8] text-[#D82F2F]"
                            : "bg-[#E4E4E7] text-[#52525B]"
                      }`}
                    >
                      {verificationStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <DocumentPreview label="Uploaded NIN Document" url={ninUrl} />
                  <DocumentPreview
                    label="Uploaded CAC Business Document"
                    url={cacUrl}
                  />
                </div>

                {success && (
                  <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold transition-all">
                    {success}
                  </div>
                )}

                {actionError && (
                  <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold transition-all">
                    {actionError}
                  </div>
                )}

                <div className="flex items-center gap-4 max-w-[400px] mt-2">
                  <button
                    type="button"
                    onClick={() => void handleUpdateVerification("approved")}
                    disabled={actionLoading || verificationStatus === "approved"}
                    className="flex-1 h-11 bg-[#BEF2CB] hover:bg-[#a6f0b8] disabled:opacity-50 disabled:cursor-not-allowed text-[#168E33] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all select-none active:scale-[0.99]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {actionLoading ? "Updating..." : "Verify KYC"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleUpdateVerification("rejected")}
                    disabled={actionLoading || verificationStatus === "rejected"}
                    className="flex-1 h-11 bg-[#FFE8E8] hover:bg-[#fbdada] disabled:opacity-50 disabled:cursor-not-allowed text-[#D82F2F] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all select-none active:scale-[0.99]"
                  >
                    <XCircle className="w-4 h-4" />
                    {actionLoading ? "Updating..." : "Reject KYC"}
                  </button>
                </div>
              </div>

              <UserEventsTable data={events} />
            </>
          )}
        </div>
      </main>
    </>
  );
}
