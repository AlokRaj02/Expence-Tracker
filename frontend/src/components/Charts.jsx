import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

export default function Charts({ monthlyCashflow, expenseBreakdown }) {
  const COLORS = ['#6366f1', '#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6', '#14b8a6', '#ef4444'];

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="charts-grid">
      <div className="glass-card">
        <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Cash Flow Trend (Last 6 Months)</h3>
        {monthlyCashflow && monthlyCashflow.length > 0 ? (
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={monthlyCashflow} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-secondary)', 
                    borderColor: 'var(--border-color)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)'
                  }} 
                  formatter={(val) => formatCurrency(val)}
                />
                <Legend />
                <Line type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="expense" name="Expenses" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No cashflow trend data available yet.
          </div>
        )}
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Expense Breakdown</h3>
        {expenseBreakdown && expenseBreakdown.length > 0 ? (
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="total_spent"
                  nameKey="category"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-secondary)', 
                    borderColor: 'var(--border-color)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)'
                  }} 
                  formatter={(val) => formatCurrency(val)}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No expense categories to show.
          </div>
        )}
      </div>
    </div>
  );
}
