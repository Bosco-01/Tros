import React from 'react';
import { BarChartData } from '@/data/reports';

interface EventApprovalsChartProps {
  data: BarChartData[];
}

export const EventApprovalsChart: React.FC<EventApprovalsChartProps> = ({ data }) => {
  const chartHeight = 200;
  const chartWidth = 460;
  const paddingLeft = 30;
  const paddingRight = 10;
  const paddingTop = 10;
  const paddingBottom = 20;

  const innerHeight = chartHeight - paddingTop - paddingBottom;
  const innerWidth = chartWidth - paddingLeft - paddingRight;

  const yTicks = [0, 20, 40, 60, 80];

  return (
    <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col w-full">
      <h3 className="text-base font-bold text-neutral-950 mb-6">Event Approvals</h3>

      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9', minHeight: '220px' }}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
          
          {/* Dotted Gridlines & Y Axis Ticks */}
          {yTicks.map((tick, idx) => {
            const y = innerHeight + paddingTop - (tick / 80) * innerHeight;
            return (
              <g key={idx}>
                {/* Dotted Line */}
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                {/* Y Tick text label */}
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  fill="#9CA3AF"
                  fontSize="10"
                  textAnchor="end"
                  className="font-medium"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Render Bars */}
          {data.map((d, idx) => {
            const colWidth = innerWidth / data.length;
            const barWidth = 14;
            const x = paddingLeft + idx * colWidth + (colWidth - barWidth) / 2;
            const barHeight = (d.value / 80) * innerHeight;
            const y = innerHeight + paddingTop - barHeight;

            return (
              <g key={idx} className="group cursor-pointer">
                {/* Hover Tooltip Overlay */}
                <title>{`${d.month}: ${d.value} Approvals`}</title>

                {/* Rounded Top Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="#6312E1"
                  rx="3"
                  className="transition-all duration-300 group-hover:fill-[#520cbd]"
                />

                {/* X Axis Month text label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 4}
                  fill="#9CA3AF"
                  fontSize="10"
                  textAnchor="middle"
                  className="font-semibold"
                >
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};