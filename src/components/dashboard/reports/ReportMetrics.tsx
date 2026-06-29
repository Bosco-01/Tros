import React from 'react';
import { Calendar, Users, DollarSign, RotateCcw, TrendingUp, TrendingDown } from 'lucide-react';
import { ReportMetricData } from '@/data/reports';

interface ReportMetricsProps {
  data: ReportMetricData[];
}

export const ReportMetrics: React.FC<ReportMetricsProps> = ({ data }) => {
  const getIcon = (type: string) => {
    const classNames = "w-6 h-6 text-white stroke-[2.2]";
    switch (type) {
      case 'events':
        return <Calendar className={classNames} />;
      case 'vendors':
        return <Users className={classNames} />;
      case 'revenue':
        return <DollarSign className={classNames} />;
      case 'refunds':
        return <RotateCcw className={classNames} />;
      default:
        return <Calendar className={classNames} />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 w-full max-w-[1100px] select-none">
      {data.map((card) => {
        const isPositive = card.trend === 'up';
        return (
          <div
            key={card.id}
            className="bg-white rounded-[24px] p-6 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[185px]"
          >
            <div>
              {/* Header Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#FF5C00] rounded-xl flex items-center justify-center shadow-sm">
                  {getIcon(card.iconType)}
                </div>
                
                {/* Trend line indicators */}
                <div className={`flex items-center gap-1 text-[13px] font-bold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{card.trendValue}</span>
                  <span className="text-neutral-500 font-medium">{card.trendPeriod}</span>
                </div>
              </div>

              {/* Main value indicator */}
              <h4 className="text-[28px] font-bold text-neutral-950 leading-none mb-1.5">
                {card.value}
              </h4>
              <p className="text-[14px] font-medium text-neutral-600 leading-none">
                {card.title}
              </p>
            </div>

            {/* Optional declined warnings footer */}
            {card.footerNote ? (
              <p className="text-[12px] font-medium text-neutral-500 mt-4 leading-none pt-4 border-t border-neutral-100/60">
                {card.footerNote}
              </p>
            ) : (
              <div className="mt-4 pt-4 h-[1px]"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};