import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-3 rounded-lg border border-border shadow-warm-md">
        <p className="text-sm font-semibold text-foreground">{new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
        <p className="text-lg font-bold text-primary">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const SavingsGrowthChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 h-[400px] flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Savings Growth</h3>
        <p className="text-muted-foreground">Not enough data to display chart.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Savings Growth</h3>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short' })}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(num) => `$${num / 1000}k`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="savings"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#colorSavings)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SavingsGrowthChart;