export interface ReportMetricData {
  id: string;
  title: string;
  value: string;
  trend: 'up' | 'down';
  trendValue: string;
  trendPeriod: string;
  iconType: 'events' | 'vendors' | 'revenue' | 'refunds';
  footerNote?: string;
}

export interface BarChartData {
  month: string;
  value: number; // Max value 80
}

export interface LineChartData {
  month: string;
  value: number; // Max value 500,000
}

export const mockReportMetrics: ReportMetricData[] = [
  {
    id: '1',
    title: 'Registered Events',
    value: '140',
    trend: 'up',
    trendValue: '+ 15%',
    trendPeriod: 'this week',
    iconType: 'events',
    footerNote: '30 event requests declined',
  },
  {
    id: '2',
    title: 'Active Vendors',
    value: '205',
    trend: 'up',
    trendValue: '+ 8%',
    trendPeriod: 'this week',
    iconType: 'vendors',
    footerNote: '5 Vendor requests declined',
  },
  {
    id: '3',
    title: 'Total Revenue',
    value: '# 900,000.00',
    trend: 'up',
    trendValue: '+ 5%',
    trendPeriod: 'this week',
    iconType: 'revenue',
  },
  {
    id: '4',
    title: 'Refunds Issued',
    value: '# 45,000.00',
    trend: 'down',
    trendValue: '- 8%',
    trendPeriod: 'this week',
    iconType: 'refunds',
  },
];

export const mockEventApprovals: BarChartData[] = [
  { month: 'Jan', value: 45 },
  { month: 'Feb', value: 50 },
  { month: 'Mar', value: 60 },
  { month: 'Apr', value: 40 },
  { month: 'May', value: 2 },
  { month: 'Jun', value: 2 },
  { month: 'Jul', value: 2 },
  { month: 'Aug', value: 2 },
  { month: 'Sep', value: 2 },
  { month: 'Oct', value: 2 },
  { month: 'Nov', value: 2 },
];

export const mockRevenueTrend: LineChartData[] = [
  { month: 'Jan', value: 130000 },
  { month: 'Feb', value: 200000 },
  { month: 'Mar', value: 230000 },
  { month: 'Apr', value: 250000 },
  { month: 'May', value: 220000 },
  { month: 'Jun', value: 200000 },
  { month: 'Jul', value: 170000 },
  { month: 'Aug', value: 140000 },
  { month: 'Sep', value: 50000 },
  { month: 'Oct', value: 0 },
  { month: 'Nov', value: 0 },
];