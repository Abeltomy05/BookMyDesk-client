import React from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { RevenueChartProps } from '@/types/vendor-home.types';
import { formatDate } from '@/utils/formatters/date';

const RevenueChart: React.FC<RevenueChartProps> = ({ 
  data = [], 
  title = "Revenue Overview",
  height = 320,
  showLegend = true,
  primaryLine = {
    dataKey: "revenue",
    stroke: "#f69938",
    label: "Revenue"
  },
  secondaryLine = {
    dataKey: "bookings",
    stroke: "#3b82f6",
    label: "Bookings"
  },
  className = "",
  xAxisKey = "month",
  ...props 
}) => {

  if (!data || data.length === 0) {
    return null;
  }

  const sortedData = [...data].sort((a, b) => {
    if (xAxisKey === 'month') {
      const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return monthOrder.indexOf(a.month || '') - monthOrder.indexOf(b.month || '');
    } else if (xAxisKey === 'date') {
      return new Date(a.date || '').getTime() - new Date(b.date || '').getTime();
    } else if (xAxisKey === 'hour') {
      return (a.hour || '').localeCompare(b.hour || '');
    }
    return 0;
  });
  
  const formatTooltipValue = (value: any, name: string) => {
    if (name === 'Revenue') {
      return [`₹${value.toLocaleString()}`, name];
    }
    return [value, name];
  };

  return (
    <div className={className} {...props}>
      {showLegend && !title && (
        <div className="flex items-center justify-end space-x-6 mb-4">
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: primaryLine.stroke }}
            ></div>
            <span className="text-sm font-medium text-gray-600">{primaryLine.label}</span>
          </div>
          {secondaryLine && (
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: secondaryLine.stroke }}
              ></div>
              <span className="text-sm font-medium text-gray-600">{secondaryLine.label}</span>
            </div>
          )}
        </div>
      )}

      {/* Chart Container with enhanced styling */}
      <div style={{ height: `${height}px` }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={sortedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              {/* Gradient for primary line */}
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryLine.stroke} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={primaryLine.stroke} stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#f1f5f9" 
              vertical={false}
            />
            
            <XAxis 
              dataKey={xAxisKey || 'month'} 
              stroke="#64748b" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b' }}
              tickFormatter={(value) => {
                if (xAxisKey === 'date') {
                  return formatDate(value);
                }
                return value;
              }}
            />
            
            <YAxis 
              yAxisId="left"
              stroke="#64748b" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b' }}
               tickFormatter={(value) => {
                  if (primaryLine.dataKey === 'revenue') {
                    if (value >= 1_00_000) return `₹${(value / 100000).toFixed(1)}L`; 
                    if (value >= 1_000) return `₹${(value / 1000).toFixed(1)}K`; 
                    return `₹${value}`;
                  }
                  return value;
                }}
            />
            <YAxis
                yAxisId="right"
                orientation="right"
                stroke={secondaryLine?.stroke}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tick={{ fill: secondaryLine?.stroke }}
              />
            
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                padding: "12px 16px"
              }}
              labelStyle={{ 
                color: '#1f2937', 
                fontWeight: '600',
                marginBottom: '4px',
                fontSize: '14px'
              }}
              formatter={formatTooltipValue}
              cursor={{
                stroke: primaryLine.stroke,
                strokeWidth: 1,
                strokeOpacity: 0.3
              }}
            />
            
            {/* Primary Area (Revenue) - Hide from tooltip */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey={primaryLine.dataKey}
              fill="url(#revenueGradient)"
              stroke="none"
              hide={true}
            />
            
            {/* Primary Line (Revenue) */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey={primaryLine.dataKey}
              stroke={primaryLine.stroke}
              strokeWidth={3}
              dot={{ 
                fill: primaryLine.stroke, 
                strokeWidth: 3, 
                r: 5,
                stroke: "white"
              }}
              activeDot={{ 
                r: 7, 
                stroke: primaryLine.stroke, 
                strokeWidth: 3,
                fill: "white",
                style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }
              }}
            />
            
            {/* Secondary Line (Bookings) */}
            {secondaryLine && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey={secondaryLine.dataKey}
                stroke={secondaryLine.stroke}
                strokeWidth={3}
                dot={{ 
                  fill: secondaryLine.stroke, 
                  strokeWidth: 3, 
                  r: 5,
                  stroke: "white"
                }}
                activeDot={{ 
                  r: 7, 
                  stroke: secondaryLine.stroke, 
                  strokeWidth: 3,
                  fill: "white",
                  style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }
                }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;