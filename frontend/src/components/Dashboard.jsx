import React from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import Charts from './Charts';

export default function Dashboard({ summary, recentTransactions, onNavigate, onOpenUpdateWallet }) {
  const { totalBalance = 0, totalIncome = 0, totalExpense = 0, savingsRate = 0, monthlyCashflow = [], expenseBreakdown = [], budgetStatus = [] } = summary || {};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const sipItem = budgetStatus.find(b => b.name.includes('SIP'));
  const tradingItem = budgetStatus.find(b => b.name.includes('Trading'));

  const sipInvested = sipItem ? sipItem.spent : 0;
  const tradingCapital = tradingItem ? tradingItem.spent : 0;

  const monthlySip = sipInvested || 2500;
  const projected5Yr = Math.round(monthlySip * (((Math.pow(1 + 0.13 / 12, 60) - 1) / (0.13 / 12)) * (1 + 0.13 / 12)));

  return (
    <div>
      {/* Metrics Row */}
      <div className="metrics-grid">
        {/* Functional Wallet Balance Card */}
        <div 
          className="glass-card metric-card" 
          style={{ 
            position: 'relative', 
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            border: '1px solid rgba(99, 102, 241, 0.25)'
          }}
          onClick={onOpenUpdateWallet}
          title="Click to update wallet balance"
        >
          <div className="metric-info">
            <h3>Total Net Balance</h3>
            <div className="metric-value" style={{ color: totalBalance >= 0 ? 'var(--text-primary)' : '#ef4444' }}>
              {formatCurrency(totalBalance)}
            </div>
          </div>

          <div 
            className="metric-icon balance" 
            style={{ 
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)',
              color: '#818cf8',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              borderRadius: '14px'
            }}
          >
            <Wallet size={24} />
            <span 
              style={{ 
                position: 'absolute', 
                bottom: '-2px', 
                right: '-2px', 
                background: 'var(--accent-gradient)', 
                borderRadius: '50%', 
                width: '16px', 
                height: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#fff',
                fontSize: '9px',
                fontWeight: 'bold',
                boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
              }}
            >
              ✏️
            </span>
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-info">
            <h3>Monthly Pocket Money</h3>
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
            <h3>Savings & Invest Rate</h3>
            <div className="metric-value" style={{ color: '#f59e0b' }}>
              {savingsRate}%
            </div>
          </div>
          <div className="metric-icon savings">
            <PiggyBank size={24} />
          </div>
        </div>
      </div>

      {/* Investment & Trading Portfolio Card */}
      <div 
        className="glass-card" 
        style={{ 
          marginBottom: '28px', 
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          alignItems: 'center'
        }}
      >
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            <ShieldCheck size={16} inline="true" /> Investment Tracker
          </div>
          <h3 style={{ fontSize: '1.2rem' }}>Mutual Fund SIP</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981', marginTop: '2px' }}>
            {formatCurrency(sipInvested)} <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ mo</small>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#06b6d4', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            <Activity size={16} inline="true" /> Trading Capital
          </div>
          <h3 style={{ fontSize: '1.2rem' }}>Stock Trading (Risk Capital)</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#06b6d4', marginTop: '2px' }}>
            {formatCurrency(tradingCapital)} <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ mo</small>
          </div>
        </div>

        <div style={{ paddingLeft: '12px', borderLeft: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            🔮 5-Year SIP Projection (13% CAGR)
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b' }}>
            {formatCurrency(projected5Yr)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Based on {formatCurrency(monthlySip)}/mo SIP compounding
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
            <h3>Recent Activity</h3>
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
