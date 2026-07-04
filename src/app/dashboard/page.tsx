"use client";

import React, { useState, useEffect } from "react";
import { Topbar } from "@/components/layout/topbar"; // Note: Matches lowercase on-disk config
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { UsersTable } from "@/components/dashboard/UsersTable";
import { apiFetch } from "@/services/apiClient";
import {
  DashboardResponse,
  AppUser,
  PaginatedResponse,
  UserRowData,
} from "@/types/admin";

// Helper card component to cleanly style the 4 sub-metrics totals
const SubMetricCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-white border border-neutral-100/60 rounded-3xl p-6 flex flex-col justify-center flex-1 min-w-[200px] shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
    <span className="text-xs font-semibold text-neutral-500 mb-2 leading-none">
      {title}
    </span>
    <span className="text-xl font-extrabold text-neutral-900 leading-none">
      {value}
    </span>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [users, setUsers] = useState<AppUser[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // 1. Fetch real-time KPI totals from GET /admin/dashboard
        const statsData = await apiFetch<DashboardResponse>("/admin/dashboard");
        setStats(statsData);

        // 2. Fetch real-time paginated users list from GET /admin/users
        const usersData = await apiFetch<
          PaginatedResponse<AppUser> | AppUser[]
        >("/admin/users?page=1&limit=5");

        let usersList: AppUser[] = [];
        const paginated = usersData as PaginatedResponse<AppUser> | any;
        if (Array.isArray(usersData)) {
          usersList = usersData;
        } else if (paginated?.data && Array.isArray(paginated.data)) {
          usersList = paginated.data;
        } else if (paginated?.data && Array.isArray(paginated.data?.users)) {
          usersList = paginated.data.users;
        } else if (paginated?.users && Array.isArray(paginated.users)) {
          usersList = paginated.users;
        } else if (paginated?.items && Array.isArray(paginated.items)) {
          usersList = paginated.items;
        }

        setUsers(usersList);
      } catch (error) {
        console.error("Failed to fetch real-time dashboard analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadDashboardData();
  }, []);

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

  // Format dynamic metrics arrays to align with UI requirements
  const metricCards = stats
    ? [
        {
          id: "1",
          title: "Total Users",
          value: stats.total_users.toLocaleString(),
          trend:
            stats.users_trend_pct >= 0 ? ("up" as const) : ("down" as const),
          trendValue: `${stats.users_trend_pct >= 0 ? "+" : ""}${stats.users_trend_pct.toFixed(2)}%`,
          trendPeriod: "this week",
          iconBg: "bg-[#18392B]",
          iconType: "users" as const,
        },
        {
          id: "2",
          title: "Total Vendors",
          value: stats.total_vendors.toLocaleString(),
          trend:
            stats.vendors_trend_pct >= 0 ? ("up" as const) : ("down" as const),
          trendValue: `${stats.vendors_trend_pct >= 0 ? "+" : ""}${stats.vendors_trend_pct.toFixed(2)}%`,
          trendPeriod: "this week",
          iconBg: "bg-[#A6681E]",
          iconType: "vendors" as const,
        },
        {
          id: "3",
          title: "Total Events",
          value: stats.total_events.toLocaleString(),
          trend:
            stats.events_trend_pct >= 0 ? ("up" as const) : ("down" as const),
          trendValue: `${stats.events_trend_pct >= 0 ? "+" : ""}${stats.events_trend_pct.toFixed(2)}%`,
          trendPeriod: "this week",
          iconBg: "bg-[#1C222F]",
          iconType: "events" as const,
        },
        {
          id: "4",
          title: "Total Subscriptions",
          value: stats.total_subscriptions.toLocaleString(),
          trend:
            stats.subscriptions_trend_pct >= 0
              ? ("up" as const)
              : ("down" as const),
          trendValue: `${stats.subscriptions_trend_pct >= 0 ? "+" : ""}${stats.subscriptions_trend_pct.toFixed(2)}%`,
          trendPeriod: "this week",
          iconBg: "bg-[#D97706]",
          iconType: "subscriptions" as const,
        },
      ]
    : [];

  // Uniform model mapper to ensure database users list format aligns with the User Table Component
  const formattedUsers: UserRowData[] = users.map((user: AppUser) => ({
    id: String(user.id || user.user_id),
    fullName: user.full_name || user.name || "User Account",
    phone: user.phone_number || user.phone || "N/A",
    email: user.email || "N/A",
    status:
      typeof user.is_active === "boolean"
        ? user.is_active
          ? "Active"
          : "Inactive"
        : "Active",
  }));

  // Helper card component is declared outside render scope (moved below)

  return (
    <>
      <Topbar title="Dashboard" />

      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        <div className="max-w-[1100px] flex flex-col gap-8">
          {/* 1. Master KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {metricCards.map((metric) => (
              <MetricsCard key={metric.id} data={metric} />
            ))}
          </div>

          {/* 2. Sub-Metrics Totals Grid (Now connected to real live database state!) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 select-none animate-in fade-in duration-300">
            <SubMetricCard
              title="Total Bookings"
              value={stats ? stats.total_bookings.toLocaleString() : "0"}
            />
            <SubMetricCard
              title="Total Revenue"
              value={
                stats ? `₦ ${stats.total_revenue.toLocaleString()}` : "₦ 0"
              }
            />
            <SubMetricCard
              title="Pending Approvals"
              value={stats ? stats.pending_approvals.toString() : "0"}
            />
            <SubMetricCard
              title="Pending Verifications"
              value={stats ? stats.pending_verifications.toString() : "0"}
            />
          </div>

          {/* 3. Dynamic Registered Users Table */}
          <div className="w-full">
            <UsersTable data={formattedUsers} />
          </div>
        </div>
      </main>
    </>
  );
}
