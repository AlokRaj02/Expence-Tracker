import React from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowRight, Plus } from 'lucide-react';
import Charts from './Charts';

export default function Dashboard({ summary, recentTransactions, onNavigate, onOpenAddTx }) {
  const { totalBalance = 0, totalIncome = 0, totalExpense = 0, savingsRate = 0, monthlyCashflow = [], expenseBreakdown = [], budgetStatus = [] } = summary || {};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div>
      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="glass-card metric-card">
          <div className="metric-info">
            <h3>Total Balance</h3>
            <div className="metric-value" style={{ color: totalBalance >= 0 ? 'var(--text-primary)' : '#ef4444' }}>
              {formatCurrency(totalBalance)}
            </div>
          </div>
          <div className="metric-icon balance">
            <Wallet size={24} />
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-info">
            <h3>Monthly Income</h3>
            <div className="metric-value" style={{ color: '#10b981' }}>
              {formatCurrency(totalIncome)}
            </div>
          </div>
          <div className="metric-icon income">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-info">
            <h3>Monthly Expenses</h3>
            <div className="metric-value" style={{ color: '#ef4444' }}>
              {formatCurrency(totalExpense)}
            </div>
          </div>
          <div className="metric-icon expense">
            <TrendingDown size={24} />
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-info">
            <h3>Savings Rate</h3>
            <div className="metric-value" style={{ color: '#f59e0b' }}>
              {savingsRate}%
            </div>
          </div>
          <div className="metric-icon savings">
            <PiggyBank size={24} />
          </div>
        </div>
      </div>

      {/* Visual Analytics */}
      <Charts monthlyCashflow={monthlyCashflow} expenseBreakdown={expenseBreakdown} />

      {/* Grid: Budget Highlights + Recent Transactions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Budget Status Overview */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3>Top Budget Categories</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('budgets')}>
              View All Budgets <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {budgetStatus.slice(0, 4).map((b) => {
              const isOver = b.spent > b.allocated_budget;
              const isWarning = b.percentage_used >= 80 && !isOver;
              const barColor = isOver ? '#ef4444' : isWarning ? '#f59e0b' : b.color || '#6366f1';

              return (
                <div key={b.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: '500' }}>
                    <span>{b.name}</span>
                    <span>{formatCurrency(b.spent)} / {formatCurrency(b.allocated_budget)}</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ 
                        width: `${Math.min(b.percentage_used, 100)}%`, 
                        backgroundColor: barColor 
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3>Recent Transactions</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('transactions')}>
              All Activity <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentTransactions && recentTransactions.length > 0 ? (
              recentTransactions.slice(0, 5).map((tx) => (
                <div 
                  key={tx.id} 
                  style={{ 
                    display: 'flex', 
                    justify: 'space-between', 
                    alignItems: 'center', 
                    padding: '10px 14px', 
                    borderRadius: '10px',
                    background: 'rgba(0,0,0,0.15)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{tx.description}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {tx.category_name || 'General'} • {tx.date}
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: '700', 
                    fontSize: '0.95rem',
                    color: tx.type === 'income' ? '#10b981' : 'var(--text-primary)' 
                  }}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                No recent transactions found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
