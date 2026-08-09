import React from 'react';
import { 
  Wallet, 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Target, 
  Lightbulb, 
  Sun, 
  Moon, 
  Plus 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, theme, toggleTheme, onOpenAddTx }) {
  return (
    <nav className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <Wallet size={22} />
        </div>
        <span>FinancePulse</span>
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
