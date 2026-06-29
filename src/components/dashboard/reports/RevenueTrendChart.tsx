import React from 'react';
import { LineChartData } from '@/data/reports';

interface RevenueTrendChartProps {
  data: LineChartData[];
}

export const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({ data }) => {
  const chartHeight = 200;
  const chartWidth = 460;
  const paddingLeft = 50;
  const paddingRight = 10;
  const paddingTop = 10;
  const paddingBottom = 20;

  const innerHeight = chartHeight - paddingTop - paddingBottom;
  const innerWidth = chartWidth - paddingLeft - paddingRight;

  const yTicks = [
    { label: '0', val: 0 },
    { label: '100,000', val: 100000 },
    { label: '200,000', val: 200000 },
    { label: '500,000', val: 500000 },
  ];

  // Map data to SVG line string path
  const points = data.map((d, idx) => {
    const colWidth = innerWidth / (data.length - 1);
    const x = paddingLeft + idx * colWidth;
    
    // Non-linear visual scale adjustment to match the layout grid accurately
    let scalePercent = 0;
    if (d.value <= 100000) {
      scalePercent = (d.value / 100000) * 0.33; // 0 to 100k takes bottom 33% height
    } else if (d.value <= 200000) {
      scalePercent = 0.33 + ((d.value - 100000) / 100000) * 0.33; // 100k to 200k takes middle 33%
    } else {
      scalePercent = 0.66 + ((d.value - 200000) / 300000) * 0.34; // 200k to 500k takes top 34%
    }

    const y = innerHeight + paddingTop - scalePercent * innerHeight;
    return { x, y, val: d.value, month: d.month };
  });

  // Calculate standard SVG smooth bezier path
  const pathData = points
    .reduce((acc, p, idx, arr) => {
      if (idx === 0) return `M ${p.x} ${p.y}`;
      // Fallback fallback curve calculation
      const prev = arr[idx - 1];
      const cpX1 = prev.x + (p.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (p.x - prev.x) / 2;
      const cpY2 = p.y;
      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
    }, '');

  return (
    <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col w-full">
      <h3 className="text-base font-bold text-neutral-950 mb-6">Revenue Trend</h3>

      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9', minHeight: '220px' }}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
          
          {/* Dotted Gridlines & Y Axis Scale */}
          {yTicks.map((tick, idx) => {
            let scalePercent = 0;
            if (tick.val === 100000) scalePercent = 0.33;
            else if (tick.val === 200000) scalePercent = 0.66;
            else if (tick.val === 500000) scalePercent = 1.0;

            const y = innerHeight + paddingTop - scalePercent * innerHeight;
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  fill="#9CA3AF"
                  fontSize="10"
                  textAnchor="end"
                  className="font-medium"
                >
                  {tick.label}
                </text>
              </g>
            );
          })}

          {/* Solid line trend line */}
          <path
            d={pathData}
            fill="none"
            stroke="#FF5C00"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Render circular orange dots & month indicators */}
          {points.map((p, idx) => {
            // Only draw dots for values larger than 0 (Jan - Sept in the spec screenshot)
            const showDot = p.val > 0;
            return (
              <g key={idx} className="group cursor-pointer">
                <title>{`${p.month}: # ${p.val.toLocaleString()}`}</title>
                
                {showDot && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="#FF5C00"
                    stroke="#FFF"
                    strokeWidth="1.5"
                    className="transition-transform duration-200 group-hover:scale-150"
                  />
                )}

                <text
                  x={p.x}
                  y={chartHeight - 4}
                  fill="#9CA3AF"
                  fontSize="10"
                  textAnchor="middle"
                  className="font-semibold"
                >
                  {p.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};