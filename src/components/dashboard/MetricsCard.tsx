import React from 'react';
import { Users, Tag, Calendar, Layers, TrendingUp, TrendingDown } from 'lucide-react';
import { MetricData } from '@/data/dashboard';

interface MetricsCardProps {
  data: MetricData;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ data }) => {
  const getIcon = () => {
    switch (data.iconType) {
      case 'users': return <Users className="w-7 h-7 text-white" />;
      case 'vendors': return <Tag className="w-7 h-7 text-white fill-white/20" />;
      case 'events': return <Calendar className="w-7 h-7 text-white" />;
      case 'subscriptions': return <Layers className="w-7 h-7 text-white" />;
      default: return <Users className="w-7 h-7 text-white" />;
    }
  };

  const isPositive = data.trend === 'up';

  return (
    <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col">
      <div className="flex items-start gap-4 mb-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${data.iconBg} shadow-sm`}>
          {getIcon()}
        </div>
        <div className="flex flex-col mt-0.5">
          <span className="text-[15px] font-medium text-neutral-900">{data.title}</span>
          <span className="text-[28px] font-bold text-neutral-900 leading-tight mt-1">{data.value}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{data.trendValue}</span>
        </div>
        <span className="text-sm text-neutral-500 font-medium">{data.trendPeriod}</span>
      </div>

      <button className="w-full py-3 mt-auto bg-[#F4ECFF] hover:bg-[#ebdfff] text-[#6312E1] rounded-xl text-[15px] font-bold transition-colors">
        View Details
      </button>
    </div>
  );
};