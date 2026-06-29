export interface MetricData {
  id: string;
  title: string;
  value: string;
  trend: 'up' | 'down';
  trendValue: string;
  trendPeriod: string;
  iconBg: string;
  iconType: 'users' | 'vendors' | 'events' | 'subscriptions';
}

export interface UserRowData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
}

export const metricsData: MetricData[] = [
  {
    id: '1',
    title: 'Total Users',
    value: '1,450',
    trend: 'up',
    trendValue: '+ 15%',
    trendPeriod: 'this week',
    iconBg: 'bg-[#18392B]',
    iconType: 'users',
  },
  {
    id: '2',
    title: 'Total Vendors',
    value: '300',
    trend: 'up',
    trendValue: '+ 3%',
    trendPeriod: 'this week',
    iconBg: 'bg-[#A6681E]',
    iconType: 'vendors',
  },
  {
    id: '3',
    title: 'Total Events',
    value: '860',
    trend: 'down',
    trendValue: '- 2 %',
    trendPeriod: 'this week',
    iconBg: 'bg-[#1C222F]',
    iconType: 'events',
  },
  {
    id: '4',
    title: 'Total Subscriptions',
    value: '705',
    trend: 'up',
    trendValue: '+ 5%',
    trendPeriod: 'this week',
    iconBg: 'bg-[#D97706]',
    iconType: 'subscriptions',
  },
];

export const recentUsersData: UserRowData[] = [
  { id: '#001294', fullName: 'John Doe', email: 'JohnDoe@gmail.com', phone: '+234 555830222157', status: 'Active' },
  { id: '#001294', fullName: 'John Doe', email: 'JohnDoe@gmail.com', phone: '+234 555830222157', status: 'Active' },
  { id: '#001294', fullName: 'John Doe', email: 'JohnDoe@gmail.com', phone: '+234 555830222157', status: 'Inactive' },
  { id: '#001294', fullName: 'John Doe', email: 'JohnDoe@gmail.com', phone: '+234 555830222157', status: 'Active' },
];