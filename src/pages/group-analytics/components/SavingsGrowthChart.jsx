import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const SavingsGrowthChart = ({ data, timeRange = '6M' }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZW', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date?.toLocaleDateString('en-GB', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-warm-lg">
          <p className="text-sm font-medium text-foreground mb-2">
            {formatDate(label)}
          </p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-sm text-muted-foreground">{entry?.dataKey}:</span>
              <span className="text-sm font-medium text-foreground">
                {formatCurrency(entry?.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(217, 119, 6)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="rgb(217, 119, 6)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="loansGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(5, 150, 105)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="rgb(5, 150, 105)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(229, 231, 235)" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            stroke="rgb(107, 114, 128)"
            fontSize={12}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            stroke="rgb(107, 114, 128)"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="totalSavings"
            stroke="rgb(217, 119, 6)"
            strokeWidth={2}
            fill="url(#savingsGradient)"
            name="Total Savings"
          />
          <Area
            type="monotone"
            dataKey="activeLoans"
            stroke="rgb(5, 150, 105)"
            strokeWidth={2}
            fill="url(#loansGradient)"
            name="Active Loans"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SavingsGrowthChart;