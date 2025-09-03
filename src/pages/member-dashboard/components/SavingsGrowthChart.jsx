import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const SavingsGrowthChart = ({ data, currency = 'USD', height = 300 }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZW', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const formatTooltip = (value, name) => {
    if (name === 'savings') {
      return [formatCurrency(value), 'Total Savings'];
    }
    return [value, name];
  };

  const formatXAxisLabel = (tickItem) => {
    const date = new Date(tickItem);
    return date?.toLocaleDateString('en-GB', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Savings Growth</h3>
          <p className="text-sm text-muted-foreground">Your savings progress over time</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-sm text-muted-foreground">Total Savings</span>
        </div>
      </div>
      <div style={{ width: '100%', height: height }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(217, 119, 6)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="rgb(217, 119, 6)" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(229, 231, 235)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisLabel}
              stroke="rgb(107, 114, 128)"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              stroke="rgb(107, 114, 128)"
              fontSize={12}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={(label) => new Date(label)?.toLocaleDateString('en-GB')}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid rgb(229, 231, 235)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey="savings"
              stroke="rgb(217, 119, 6)"
              strokeWidth={2}
              fill="url(#savingsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SavingsGrowthChart;