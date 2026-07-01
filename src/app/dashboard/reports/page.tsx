'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Topbar } from '@/components/layout/topbar';
import { ReportMetrics } from '@/components/dashboard/reports/ReportMetrics';
import { EventApprovalsChart } from '@/components/dashboard/reports/EventApprovalsChart';
import { RevenueTrendChart } from '@/components/dashboard/reports/RevenueTrendChart';
import { adminService } from '@/services/adminService';
import type { ReportsAnalyticsResponse } from '@/types/admin';
import { formatCurrency } from '@/lib/api-helpers';
import { LoadingState, ErrorState, PageShell } from '@/components/ui/AsyncStates';
import type { ReportMetricData, BarChartData, LineChartData } from '@/data/reports';

export default function ReportsPage() {
  const [analytics, setAnalytics] = useState<ReportsAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getReportsAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports');
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
        <Topbar title="Reports" />
        <LoadingState />
      </>
    );
  }

  if (error || !analytics) {
    return (
      <>
        <Topbar title="Reports" />
        <ErrorState message={error || 'Reports unavailable'} onRetry={load} />
      </>
    );
  }

  const metrics: ReportMetricData[] = [
    {
      id: '1',
      title: 'Registered Events',
      value: String(analytics.registered_events ?? 0),
      trend: 'up',
      trendValue: '',
      trendPeriod: '',
      iconType: 'events',
      footerNote: `${analytics.events_declined ?? 0} event requests declined`,
    },
    {
      id: '2',
      title: 'Active Vendors',
      value: String(analytics.active_vendors ?? 0),
      trend: 'up',
      trendValue: '',
      trendPeriod: '',
      iconType: 'vendors',
      footerNote: `${analytics.vendors_declined ?? 0} vendor requests declined`,
    },
    {
      id: '3',
      title: 'Total Revenue',
      value: formatCurrency(analytics.total_revenue),
      trend: 'up',
      trendValue: '',
      trendPeriod: '',
      iconType: 'revenue',
    },
    {
      id: '4',
      title: 'Refunds Issued',
      value: formatCurrency(analytics.refunds_issued),
      trend: 'down',
      trendValue: '',
      trendPeriod: '',
      iconType: 'refunds',
    },
  ];

  const approvals: BarChartData[] = (analytics.event_approvals || []).map((item) => ({
    month: item.month,
    value: item.count,
  }));

  const revenue: LineChartData[] = (analytics.revenue_trend || []).map((item) => ({
    month: item.month,
    value: item.amount,
  }));

  return (
    <>
      <Topbar title="Reports" />
      <PageShell>
        <ReportMetrics data={metrics} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-[1100px] mb-8">
          <EventApprovalsChart data={approvals} />
          <RevenueTrendChart data={revenue} />
        </div>
      </PageShell>
    </>
  );
}
