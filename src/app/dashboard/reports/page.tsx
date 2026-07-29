'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Topbar } from '@/components/layout/topbar';
import { ReportFilters } from '@/components/dashboard/reports/ReportFilters';
import { ReportMetrics } from '@/components/dashboard/reports/ReportMetrics';
import { EventApprovalsChart } from '@/components/dashboard/reports/EventApprovalsChart';
import { RevenueTrendChart } from '@/components/dashboard/reports/RevenueTrendChart';
import { GeneratedReportsTable } from '@/components/dashboard/reports/GeneratedReportsTable';

import { adminService } from '@/services/adminService';
import { unwrapList } from '@/lib/api-helpers';
import type { ReportsAnalyticsResponse, ReportListItem } from '@/types/admin';
import type {
  GeneratedReportRow,
  ReportMetricData,
  BarChartData,
  LineChartData,
} from '@/data/reports';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/AsyncStates';

function formatTrend(pct?: number): { trend: 'up' | 'down'; trendValue: string } {
  if (typeof pct !== 'number' || Number.isNaN(pct)) {
    return { trend: 'up', trendValue: '—' };
  }
  const sign = pct >= 0 ? '+' : '';
  return {
    trend: pct >= 0 ? 'up' : 'down',
    trendValue: `${sign}${pct.toFixed(0)}%`,
  };
}

export default function ReportsPage() {
  const [reports, setReports] = useState<GeneratedReportRow[]>([]);
  const [analytics, setAnalytics] = useState<ReportsAnalyticsResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReportsData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const reportsRes = await adminService.getReportsList(1, 20);
      const list = unwrapList<ReportListItem | GeneratedReportRow>(reportsRes);
      setReports(
        list.map((r, i) => ({
          id: (r as ReportListItem).report_id || (r as GeneratedReportRow).id || `report-${i}`,
          name: (r as GeneratedReportRow).name || (r as ReportListItem).title || 'Analytics Report',
          generatedBy: (r as GeneratedReportRow).generatedBy || (r as ReportListItem).generated_by || 'System',
          dateCreated:
            (r as GeneratedReportRow).dateCreated ||
            (r as ReportListItem).generated_at ||
            (r as ReportListItem).created_at ||
            '',
          status: ((r as GeneratedReportRow).status ||
            (r as ReportListItem).status ||
            'Completed') as GeneratedReportRow['status'],
        })),
      );

      const analyticsRes = await adminService.getReportsAnalytics(
        fromDate || undefined,
        toDate || undefined,
      );
      setAnalytics(analyticsRes);
    } catch (err) {
      setReports([]);
      setAnalytics(null);
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    void fetchReportsData();
  }, [fetchReportsData]);

  const eventsTrend = formatTrend((analytics as { events_trend_pct?: number } | null)?.events_trend_pct);
  const vendorsTrend = formatTrend((analytics as { vendors_trend_pct?: number } | null)?.vendors_trend_pct);
  const revenueTrendPct = formatTrend((analytics as { revenue_trend_pct?: number } | null)?.revenue_trend_pct);
  const refundsTrend = formatTrend((analytics as { refunds_trend_pct?: number } | null)?.refunds_trend_pct);

  const metricsData: ReportMetricData[] = analytics
    ? [
        {
          id: '1',
          title: 'Registered Events',
          value: (analytics.registered_events ?? 0).toLocaleString(),
          trend: eventsTrend.trend,
          trendValue: eventsTrend.trendValue,
          trendPeriod: 'vs prior period',
          iconType: 'events',
          footerNote: `${analytics.events_declined ?? 0} event requests declined`,
        },
        {
          id: '2',
          title: 'Active Vendors',
          value: (analytics.active_vendors ?? 0).toLocaleString(),
          trend: vendorsTrend.trend,
          trendValue: vendorsTrend.trendValue,
          trendPeriod: 'vs prior period',
          iconType: 'vendors',
          footerNote: `${analytics.vendors_declined ?? 0} Vendor requests declined`,
        },
        {
          id: '3',
          title: 'Total Revenue',
          value: `₦ ${(analytics.total_revenue ?? 0).toLocaleString()}`,
          trend: revenueTrendPct.trend,
          trendValue: revenueTrendPct.trendValue,
          trendPeriod: 'vs prior period',
          iconType: 'revenue',
        },
        {
          id: '4',
          title: 'Refunds Issued',
          value: `₦ ${(analytics.refunds_issued ?? 0).toLocaleString()}`,
          trend: refundsTrend.trend,
          trendValue: refundsTrend.trendValue,
          trendPeriod: 'vs prior period',
          iconType: 'refunds',
        },
      ]
    : [];

  const eventApprovals: BarChartData[] = analytics?.event_approvals
    ? analytics.event_approvals.map((item) => ({ month: item.month, value: item.count }))
    : [];

  const revenueTrend: LineChartData[] = analytics?.revenue_trend
    ? analytics.revenue_trend.map((item) => ({ month: item.month, value: item.amount }))
    : [];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FDFDFE] min-h-screen">
        <LoadingState />
      </div>
    );
  }

  return (
    <>
      <Topbar title="Reports" />

      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        <ReportFilters
          activeTab={activeTab}
          onTabChange={setActiveTab}
          from={fromDate}
          to={toDate}
          onFromChange={setFromDate}
          onToChange={setToDate}
          onSearch={() => void fetchReportsData()}
        />

        {error ? (
          <ErrorState message={error} onRetry={() => void fetchReportsData()} />
        ) : (
          <>
            {metricsData.length > 0 ? (
              <ReportMetrics data={metricsData} />
            ) : (
              <EmptyState message="No analytics data available for this period." />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-[1100px] mb-8">
              <EventApprovalsChart data={eventApprovals} />
              <RevenueTrendChart data={revenueTrend} />
            </div>

            <div className="w-full">
              {reports.length === 0 ? (
                <EmptyState message="No generated reports yet." />
              ) : (
                <GeneratedReportsTable data={reports} />
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
}
