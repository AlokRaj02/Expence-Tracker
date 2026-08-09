import React from 'react';
import { 
  IndianRupee, 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Target, 
  Lightbulb, 
  Sun, 
  Moon, 
  Plus,
  Sliders
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, theme, toggleTheme, onOpenAddTx, onOpenOnboarding }) {
  return (
    <nav className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <IndianRupee size={22} />
        </div>
        <span>FinancePulse <small style={{ fontSize: '0.7rem', color: 'var(--accent-color)', marginLeft: '4px' }}>INR ₹</small></span>
      </div>

      <div className="nav-links">
        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          <Receipt size={18} />
          <span>Transactions</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'budgets' ? 'active' : ''}`}
          onClick={() => setActiveTab('budgets')}
        >
          <PieChart size={18} />
          <span>Budgets</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          <Target size={18} />
          <span>Goals</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          <Lightbulb size={18} />
          <span>Insights</span>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={onOpenOnboarding} 
          title="Set / Re-configure Starting Budget"
        >
          <Sliders size={16} />
          <span style={{ fontSize: '0.82rem' }}>Set Budget</span>
        </button>

        <button className="btn btn-secondary btn-sm" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="btn btn-primary" onClick={onOpenAddTx}>
          <Plus size={18} />
          <span>New Transaction</span>
        </button>
      </div>
    </nav>
  );
}
