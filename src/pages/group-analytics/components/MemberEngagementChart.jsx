import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MemberEngagementChart = ({ data, metric = 'contributions' }) => {
  const formatValue = (value, type) => {
    if (type === 'currency') {
      return new Intl.NumberFormat('en-ZW', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })?.format(value);
    }
    return value?.toString();
  };

  const getBarColor = (metric) => {
    switch (metric) {
      case 'contributions':
        return 'rgb(217, 119, 6)';
      case 'loans':
        return 'rgb(5, 150, 105)';
      case 'repayments':
        return 'rgb(16, 185, 129)';
      default:
        return 'rgb(217, 119, 6)';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0];
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-warm-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data?.color }}
            />
            <span className="text-sm text-muted-foreground">
              {metric === 'contributions' ? 'Total Contributions:' : 
               metric === 'loans' ? 'Active Loans:' : 'Repayments:'}
            </span>
            <span className="text-sm font-medium text-foreground">
              {formatValue(data?.value, metric === 'contributions' || metric === 'repayments' ? 'currency' : 'number')}
            </span>
          </div>
          {data?.payload?.participationRate && (
            <p className="text-xs text-muted-foreground mt-1">
              Participation: {data?.payload?.participationRate}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(229, 231, 235)" />
          <XAxis 
            dataKey="name" 
            stroke="rgb(107, 114, 128)"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tickFormatter={(value) => formatValue(value, metric === 'contributions' || metric === 'repayments' ? 'currency' : 'number')}
            stroke="rgb(107, 114, 128)"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            fill={getBarColor(metric)}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MemberEngagementChart;