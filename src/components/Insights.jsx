import React from 'react';
import { Lightbulb, AlertTriangle, TrendingUp, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

export default function Insights({ summary, categories, goals }) {
  const { totalBalance = 0, totalIncome = 0, totalExpense = 0, savingsRate = 0, budgetStatus = [] } = summary || {};

  const overBudgetCategories = budgetStatus.filter(b => b.spent > b.allocated_budget && b.allocated_budget > 0);
  const highWarningCategories = budgetStatus.filter(b => b.percentage_used >= 80 && b.spent <= b.allocated_budget && b.allocated_budget > 0);

  const formatCurrency = (val) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

  return (
    <div>
      {/* Banner */}
      <div 
        className="glass-card" 
        style={{ 
          marginBottom: '24px', 
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <div style={{ padding: '12px', background: 'var(--accent-gradient)', borderRadius: '14px', color: '#fff' }}>
          <Sparkles size={28} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>AI Financial Assistant & Health Advisor</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Automated intelligence analyzing your monthly income, spending velocity, budget variances, and savings trajectory.
          </p>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Savings Rate Assessment */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: savingsRate >= 20 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: savingsRate >= 20 ? '#10b981' : '#f59e0b' }}>
              <TrendingUp size={20} />
            </div>
            <h3 style={{ fontSize: '1.05rem' }}>Savings Health Check</h3>
          </div>
          <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Your current savings rate is <strong style={{ color: 'var(--text-primary)' }}>{savingsRate}%</strong>.
            {savingsRate >= 30 ? (
              <p style={{ marginTop: '8px', color: '#10b981' }}>
                🎉 Outstanding performance! You are saving over 30% of your total income. Consider moving excess funds to high-yield investment goals.
              </p>
            ) : savingsRate >= 15 ? (
              <p style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>
                👍 Healthy savings rate (50/30/20 rule target). You are on track for long-term goal accumulation.
              </p>
            ) : (
              <p style={{ marginTop: '8px', color: '#f59e0b' }}>
                ⚠️ Low savings rate. Try trimming non-essential dining or entertainment expenses to reach a minimum 20% savings buffer.
              </p>
            )}
          </div>
        </div>

        {/* Budget Overruns Alert */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: overBudgetCategories.length > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: overBudgetCategories.length > 0 ? '#ef4444' : '#10b981' }}>
              {overBudgetCategories.length > 0 ? <ShieldAlert size={20} /> : <CheckCircle size={20} />}
            </div>
            <h3 style={{ fontSize: '1.05rem' }}>Budget Variance Insights</h3>
          </div>
          <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            {overBudgetCategories.length > 0 ? (
              <div>
                <p style={{ color: '#ef4444', fontWeight: '600', marginBottom: '8px' }}>
                  Attention: {overBudgetCategories.length} category limit(s) exceeded!
                </p>
                <ul style={{ paddingLeft: '18px' }}>
                  {overBudgetCategories.map(c => (
                    <li key={c.id} style={{ marginBottom: '4px' }}>
                      <strong>{c.name}</strong>: Spent {formatCurrency(c.spent)} vs {formatCurrency(c.allocated_budget)} limit.
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p style={{ color: '#10b981' }}>
                ✨ All active category budgets are strictly within their assigned limits!
              </p>
            )}
          </div>
        </div>

        {/* Category Warning Alert */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <AlertTriangle size={20} />
            </div>
            <h3 style={{ fontSize: '1.05rem' }}>Categories Near Limit (&gt;80%)</h3>
          </div>
          <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            {highWarningCategories.length > 0 ? (
              <div>
                <p style={{ color: '#f59e0b', marginBottom: '8px' }}>
                  {highWarningCategories.length} category is approaching monthly allocation:
                </p>
                <ul style={{ paddingLeft: '18px' }}>
                  {highWarningCategories.map(c => (
                    <li key={c.id} style={{ marginBottom: '4px' }}>
                      <strong>{c.name}</strong>: {c.percentage_used.toFixed(0)}% used ({formatCurrency(c.allocated_budget - c.spent)} left).
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>
                No categories in the warning threshold zone (&gt;80%).
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
