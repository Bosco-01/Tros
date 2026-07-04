import React from 'react';
import Link from 'next/link';
import { Users, Tag, Calendar, Layers, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricData {
  id: string;
  title: string;
  value: string;
  trend: 'up' | 'down';
  trendValue: string;
  trendPeriod: string;
  iconBg: string;
  iconType: 'users' | 'vendors' | 'events' | 'subscriptions';
}

interface MetricsCardProps {
  data: MetricData;
}

const getRoute = (type: 'users' | 'vendors' | 'events' | 'subscriptions') => {
  switch (type) {
    case 'users':
      return '/dashboard/users';
    case 'vendors':
      return '/dashboard/vendors';
    case 'events':
      return '/dashboard/events';
    case 'subscriptions':
      return '/dashboard/subscriptions';
    default:
      return '/dashboard';
  }
};

export const MetricsCard: React.FC<MetricsCardProps> = ({ data }) => {
  const getIcon = () => {
    const iconClass = "w-7 h-7 text-white";
    switch (data.iconType) {
      case 'users':
        return <Users className={iconClass} />;
      case 'vendors':
        return <Tag className={`${iconClass} fill-white/10`} />;
      case 'events':
        return <Calendar className={iconClass} />;
      case 'subscriptions':
        return <Layers className={iconClass} />;
      default:
        return <Users className={iconClass} />;
    }
  };

  const isPositive = data.trend === 'up';

  return (
    <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between min-h-[190px] select-none">
      
      {/* Top Section */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${data.iconBg} shadow-sm`}>
          {getIcon()}
        </div>
        <div className="flex flex-col mt-0.5">
          <span className="text-[15px] font-medium text-neutral-500 leading-none">{data.title}</span>
          <span className="text-[28px] font-bold text-neutral-950 leading-tight mt-2">{data.value}</span>
        </div>
      </div>

      {/* Trend Row */}
      <div className="flex items-center gap-2 mb-5">
        <div className={`flex items-center gap-1 text-[13px] font-bold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4 stroke-[2.5]" /> : <TrendingDown className="w-4 h-4 stroke-[2.5]" />}
          <span>{data.trendValue}</span>
        </div>
        <span className="text-[13px] text-neutral-400 font-semibold">{data.trendPeriod}</span>
      </div>

      {/* View Details Action Link */}
      <Link href={getRoute(data.iconType)} className="w-full mt-auto block">
        <button 
          type="button"
          className="w-full py-3 bg-[#F4ECFF] hover:bg-[#ebdfff] text-[#6312E1] rounded-xl text-[15px] font-bold transition-all focus:outline-none"
        >
          View Details
        </button>
      </Link>
    </div>
  );
};