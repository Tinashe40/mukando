import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const LoanDistributionChart = ({ data }) => {
  const COLORS = [
    'rgb(217, 119, 6)',   // Primary
    'rgb(5, 150, 105)',   // Secondary  
    'rgb(220, 38, 38)',   // Accent
    'rgb(245, 158, 11)',  // Warning
    'rgb(16, 185, 129)',  // Success
    'rgb(139, 69, 19)',   // Brown
    'rgb(75, 85, 99)',    // Gray
    'rgb(168, 85, 247)'   // Purple
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZW', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-warm-lg">
          <p className="text-sm font-medium text-foreground mb-1">{data?.category}</p>
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: payload?.[0]?.color }}
            />
            <span className="text-sm text-muted-foreground">Amount:</span>
            <span className="text-sm font-medium text-foreground">
              {formatCurrency(data?.value)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {data?.percentage}% of total loans
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {payload?.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry?.color }}
            />
            <span className="text-sm text-muted-foreground">{entry?.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LoanDistributionChart;