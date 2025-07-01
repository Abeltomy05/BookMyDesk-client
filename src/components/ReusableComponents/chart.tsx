import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { RevenueChartProps } from '@/types/vendor-home.types';



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
  ...props 
}) => {
  // Don't render if no data
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}
      {...props}
    >
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        
        {/* Legend */}
        {showLegend && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: primaryLine.stroke }}
              ></div>
              <span className="text-sm text-gray-600">{primaryLine.label}</span>
            </div>
            {secondaryLine && (
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: secondaryLine.stroke }}
                ></div>
                <span className="text-sm text-gray-600">{secondaryLine.label}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#666" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#666" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{ color: "#374151", fontWeight: "500" }}
            />
            
            {/* Primary Line */}
            <Line
              type="monotone"
              dataKey={primaryLine.dataKey}
              stroke={primaryLine.stroke}
              strokeWidth={3}
              dot={{ 
                fill: primaryLine.stroke, 
                strokeWidth: 2, 
                r: 4,
                stroke: "white"
              }}
              activeDot={{ 
                r: 6, 
                stroke: primaryLine.stroke, 
                strokeWidth: 2,
                fill: "white"
              }}
            />
            
            {/* Secondary Line */}
            {secondaryLine && (
              <Line
                type="monotone"
                dataKey={secondaryLine.dataKey}
                stroke={secondaryLine.stroke}
                strokeWidth={3}
                dot={{ 
                  fill: secondaryLine.stroke, 
                  strokeWidth: 2, 
                  r: 4,
                  stroke: "white"
                }}
                activeDot={{ 
                  r: 6, 
                  stroke: secondaryLine.stroke, 
                  strokeWidth: 2,
                  fill: "white"
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default RevenueChart;