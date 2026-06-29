import React from 'react';
import { Topbar } from '@/components/layout/topbar'; // Note: Match your lowercase layout filename
import { ReportFilters } from '@/components/dashboard/reports/ReportFilters';
import { ReportMetrics } from '@/components/dashboard/reports/ReportMetrics';
import { EventApprovalsChart } from '@/components/dashboard/reports/EventApprovalsChart';
import { RevenueTrendChart } from '@/components/dashboard/reports/RevenueTrendChart';

import {
  mockReportMetrics,
  mockEventApprovals,
  mockRevenueTrend,
} from '@/data/reports';

export default function ReportsPage() {
  return (
    <>
      <Topbar title="Reports" />
      
      {/* 
        Main content wrapper with slightly grey background 
        so the pure white filter containers, metric cards, and chart cards stand out.
      */}
      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        
        {/* Weekly/Monthly/Yearly Toggle & Search Filter Buttons */}
        <ReportFilters />

        {/* 4 Metrics Cards */}
        <ReportMetrics data={mockReportMetrics} />

        {/* 2 Custom Visual SVG Charts (Approvals & Revenue Trend) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-[1100px] mb-8">
          <EventApprovalsChart data={mockEventApprovals} />
          <RevenueTrendChart data={mockRevenueTrend} />
        </div>

      </main>
    </>
  );
}