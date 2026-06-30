'use client';

import React, { useState, useEffect } from 'react';
import { Topbar } from '@/components/layout/topbar';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { UsersTable } from '@/components/dashboard/UsersTable';
import { adminService } from '@/services/adminService';
import { DashboardResponse } from '@/types/admin';
import { recentUsersData } from '@/data/dashboard';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const response = await adminService.getDashboardStats();
        setStats(response);
      } catch (error) {
        console.error('Could not fetch real-time dashboard analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FDFDFE] min-h-screen">
        <svg className="animate-spin h-10 w-10 text-[#6312E1]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  // Format dynamic metrics arrays to align with UI requirements
  const metricCards = stats ? [
    {
      id: '1',
      title: 'Total Users',
      value: stats.total_users.toLocaleString(),
      trend: stats.users_trend_pct >= 0 ? 'up' as const : 'down' as const,
      trendValue: `${stats.users_trend_pct >= 0 ? '+' : ''}${stats.users_trend_pct}%`,
      trendPeriod: 'this week',
      iconBg: 'bg-[#18392B]',
      iconType: 'users' as const,
    },
    {
      id: '2',
      title: 'Total Vendors',
      value: stats.total_vendors.toLocaleString(),
      trend: stats.vendors_trend_pct >= 0 ? 'up' as const : 'down' as const,
      trendValue: `${stats.vendors_trend_pct >= 0 ? '+' : ''}${stats.vendors_trend_pct}%`,
      trendPeriod: 'this week',
      iconBg: 'bg-[#A6681E]',
      iconType: 'vendors' as const,
    },
    {
      id: '3',
      title: 'Total Events',
      value: stats.total_events.toLocaleString(),
      trend: stats.events_trend_pct >= 0 ? 'up' as const : 'down' as const,
      trendValue: `${stats.events_trend_pct >= 0 ? '+' : ''}${stats.events_trend_pct}%`,
      trendPeriod: 'this week',
      iconBg: 'bg-[#1C222F]',
      iconType: 'events' as const,
    },
    {
      id: '4',
      title: 'Total Subscriptions',
      value: stats.total_subscriptions.toLocaleString(),
      trend: stats.subscriptions_trend_pct >= 0 ? 'up' as const : 'down' as const,
      trendValue: `${stats.subscriptions_trend_pct >= 0 ? '+' : ''}${stats.subscriptions_trend_pct}%`,
      trendPeriod: 'this week',
      iconBg: 'bg-[#D97706]',
      iconType: 'subscriptions' as const,
    },
  ] : [];

  return (
    <>
      <Topbar title="Dashboard" />
      
      <main className="flex-1 p-8 bg-[#FDFDFE] overflow-y-auto custom-scrollbar">
        
        {/* Metrics Grid powered by our real admin endpoint */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {metricCards.map((metric) => (
            <MetricsCard key={metric.id} data={metric} />
          ))}
        </div>

        {/* Dynamic User Listing Table */}
        <div className="w-full">
          <UsersTable data={recentUsersData} />
        </div>
        
      </main>
    </>
  );
}