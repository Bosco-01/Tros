'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Topbar } from '@/components/layout/topbar';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { UsersTable } from '@/components/dashboard/UsersTable';
import { adminService } from '@/services/adminService';
import type { DashboardResponse, UserRowData, AppUser } from '@/types/admin';
import { unwrapList } from '@/lib/api-helpers';
import { mapUserToRow } from '@/lib/mappers';
import { LoadingState, ErrorState, PageShell } from '@/components/ui/AsyncStates';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [userRows, setUserRows] = useState<UserRowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [dashboard, usersRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.listUsers({ page: 1, limit: 5 }),
      ]);
      setStats(dashboard);
      setUserRows(unwrapList<AppUser>(usersRes).map(mapUserToRow));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <>
        <Topbar title="Dashboard" />
        <LoadingState label="Loading dashboard..." />
      </>
    );
  }

  if (error || !stats) {
    return (
      <>
        <Topbar title="Dashboard" />
        <ErrorState message={error || 'Dashboard unavailable'} onRetry={load} />
      </>
    );
  }

  const metricCards = [
    {
      id: '1',
      title: 'Total Users',
      value: stats.total_users.toLocaleString(),
      trend: stats.users_trend_pct >= 0 ? ('up' as const) : ('down' as const),
      trendValue: `${stats.users_trend_pct >= 0 ? '+' : ''}${stats.users_trend_pct}%`,
      trendPeriod: 'this week',
      iconBg: 'bg-[#18392B]',
      iconType: 'users' as const,
    },
    {
      id: '2',
      title: 'Total Vendors',
      value: stats.total_vendors.toLocaleString(),
      trend: stats.vendors_trend_pct >= 0 ? ('up' as const) : ('down' as const),
      trendValue: `${stats.vendors_trend_pct >= 0 ? '+' : ''}${stats.vendors_trend_pct}%`,
      trendPeriod: 'this week',
      iconBg: 'bg-[#A6681E]',
      iconType: 'vendors' as const,
    },
    {
      id: '3',
      title: 'Total Events',
      value: stats.total_events.toLocaleString(),
      trend: stats.events_trend_pct >= 0 ? ('up' as const) : ('down' as const),
      trendValue: `${stats.events_trend_pct >= 0 ? '+' : ''}${stats.events_trend_pct}%`,
      trendPeriod: 'this week',
      iconBg: 'bg-[#1C222F]',
      iconType: 'events' as const,
    },
    {
      id: '4',
      title: 'Total Subscriptions',
      value: stats.total_subscriptions.toLocaleString(),
      trend: stats.subscriptions_trend_pct >= 0 ? ('up' as const) : ('down' as const),
      trendValue: `${stats.subscriptions_trend_pct >= 0 ? '+' : ''}${stats.subscriptions_trend_pct}%`,
      trendPeriod: 'this week',
      iconBg: 'bg-[#D97706]',
      iconType: 'subscriptions' as const,
    },
  ];

  return (
    <>
      <Topbar title="Dashboard" />
      <PageShell>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {metricCards.map((metric) => (
            <MetricsCard key={metric.id} data={metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <p className="text-sm text-neutral-500 mb-1">Total Bookings</p>
            <p className="text-2xl font-bold">{stats.total_bookings.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <p className="text-sm text-neutral-500 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold">₦{stats.total_revenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <p className="text-sm text-neutral-500 mb-1">Pending Approvals</p>
            <p className="text-2xl font-bold">{stats.pending_approvals}</p>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <p className="text-sm text-neutral-500 mb-1">Pending Verifications</p>
            <p className="text-2xl font-bold">{stats.pending_verifications}</p>
          </div>
        </div>

        <UsersTable data={userRows} />
      </PageShell>
    </>
  );
}
