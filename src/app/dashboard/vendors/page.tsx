"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/layout/topbar"; // Note: Matches lowercase on-disk config
import { VendorFilters } from "@/components/dashboard/vendors/VendorFilters";
import { VendorsTable } from "@/components/dashboard/vendors/VendorsTable";
// no local mock fallback - require real backend data
import { apiFetch } from "@/services/apiClient";
import type {
  AdminVendor,
  PaginatedResponse,
  VendorRowData,
} from "@/types/admin";

export default function AllVendorsPage() {
  const [vendors, setVendors] = useState<VendorRowData[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setUnauthorized(false);
      try {
        const resp = await apiFetch<PaginatedResponse<AdminVendor>>(
          "/admin/vendors?page=1&limit=50",
        );
        const obj = resp as unknown as Record<string, any>;
        let list: AdminVendor[] = [];
        if (Array.isArray(obj.vendors)) list = obj.vendors as AdminVendor[];
        else if (obj.data && Array.isArray(obj.data.vendors))
          list = obj.data.vendors as AdminVendor[];
        else if (Array.isArray(obj.data)) list = obj.data as AdminVendor[];
        else if (Array.isArray(obj.items)) list = obj.items as AdminVendor[];

        const mapped: VendorRowData[] = list.map((v) => {
          const vendor = v as AdminVendor & {
            fullName?: string;
            businessName?: string;
          };

          return {
            id: vendor.vendor_id || (vendor as any).id || "",
            fullName: vendor.full_name || vendor.fullName || "",
            businessName: vendor.business_name || vendor.businessName || "",
            email: vendor.email || "",
            subscription: (vendor.subscription_status as string) || "",
            amount:
              vendor.subscription_amount != null
                ? `₦ ${Number(vendor.subscription_amount).toLocaleString()}`
                : "",
            eventPost: (vendor.event_post_status as string) || "",
            status: (vendor.verification_status as string) || "",
          };
        });

        setVendors(mapped);
      } catch (err: any) {
        // If unauthorized, show a clearer UI state instead of silently showing "No vendors"
        if (err && err.status === 401) {
          setUnauthorized(true);
          setVendors([]);
        } else {
          console.error("Failed to load vendors:", err);
          setVendors([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    setUnauthorized(false);
    try {
      const q = new URLSearchParams();
      if (search) q.set("search", search);
      if (status) q.set("status", status);
      q.set("page", "1");
      q.set("limit", "50");

      const resp = await apiFetch<PaginatedResponse<AdminVendor>>(
        `/admin/vendors?${q.toString()}`,
      );
      const obj = resp as unknown as Record<string, any>;
      let list: AdminVendor[] = [];
      if (Array.isArray(obj.vendors)) list = obj.vendors as AdminVendor[];
      else if (obj.data && Array.isArray(obj.data.vendors))
        list = obj.data.vendors as AdminVendor[];
      else if (Array.isArray(obj.data)) list = obj.data as AdminVendor[];
      else if (Array.isArray(obj.items)) list = obj.items as AdminVendor[];

      const mapped: VendorRowData[] = list.map((v) => {
        const vendor = v as AdminVendor & {
          fullName?: string;
          businessName?: string;
        };

        return {
          id: vendor.vendor_id || (vendor as any).id || "",
          fullName: vendor.full_name || vendor.fullName || "",
          businessName: vendor.business_name || vendor.businessName || "",
          email: vendor.email || "",
          subscription: (vendor.subscription_status as string) || "",
          amount:
            vendor.subscription_amount != null
              ? `₦ ${Number(vendor.subscription_amount).toLocaleString()}`
              : "",
          eventPost: (vendor.event_post_status as string) || "",
          status: (vendor.verification_status as string) || "",
        };
      });

      setVendors(mapped);
    } catch (err: any) {
      if (err && err.status === 401) {
        setUnauthorized(true);
        setVendors([]);
      } else {
        console.error("Vendor search failed:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Topbar title="All Vendors" />

      {/* 
        Main content wrapper with slightly grey background 
        so the pure white filter containers and table row states stand out.
      */}
      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        {/* Header Title & Actions Row (Positioned Top Right below Admin Topbar panel) */}
        <div className="flex items-center justify-between gap-4 mb-8 w-full max-w-[1100px] select-none">
          <h2 className="text-xl md:text-[22px] font-bold text-neutral-900 tracking-tight">
            Vendor Directory
          </h2>
          {/* Create Vendor Action Button */}
          <Link href="/dashboard/vendors/create">
            <button className="flex items-center gap-2.5 px-6 py-3 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold text-sm rounded-full transition-colors focus:outline-none shadow-sm shadow-[#6312E1]/10">
              <div className="w-5 h-5 bg-white text-[#6312E1] flex items-center justify-center rounded-md font-extrabold text-xs">
                +
              </div>
              <span>Create Vendor</span>
            </button>
          </Link>
        </div>

        {/* Rounded filter bar and tag bar */}
        <VendorFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onSubmit={handleSearch}
        />

        {/* Dynamic Data Table */}
        <div className="w-full">
          {unauthorized ? (
            <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-8 max-w-[1100px] text-center">
              <h3 className="text-lg font-bold mb-2">Not signed in</h3>
              <p className="text-sm text-neutral-600">
                You must be signed in to view vendors. Please sign in via the
                admin login.
              </p>
            </div>
          ) : isLoading ? (
            <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-8 max-w-[1100px] text-center">
              <p className="text-sm text-neutral-600">Loading vendors...</p>
            </div>
          ) : (
            <VendorsTable data={vendors} />
          )}
        </div>
      </main>
    </>
  );
}
