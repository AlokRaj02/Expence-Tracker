import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Budgets from './components/Budgets';
import Goals from './components/Goals';
import Insights from './components/Insights';
import OnboardingModal from './components/OnboardingModal';
import UpdateWalletModal from './components/UpdateWalletModal';
import QuickPaymentModal from './components/QuickPaymentModal';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';

import { 
  fetchSummary, 
  fetchTransactions, 
  createTransaction, 
  deleteTransaction,
  fetchCategories,
  createCategory,
  updateCategory,
  fetchGoals,
  createGoal,
  depositGoal,
  deleteGoal
} from './services/api';

import { Plus } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);

  // Modals States
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showUpdateWallet, setShowUpdateWallet] = useState(false);
  const [showQuickPayment, setShowQuickPayment] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // User State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('fp_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Default demo user
    return {
      name: 'Alok Raj',
      email: 'alok.raj@financepulse.in',
      avatar: '👨‍💻',
      currency: 'INR (₹)',
      memberSince: 'August 2026'
    };
  });

  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    savingsRate: 0,
    monthlyCashflow: [],
    expenseBreakdown: [],
    budgetStatus: []
  });

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [goals, setGoals] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category_id: ''
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  };

  const refreshAllData = async () => {
    try {
      setLoading(true);
      const [sumData, txData, catData, goalsData] = await Promise.all([
        fetchSummary(),
        fetchTransactions(filters),
        fetchCategories(),
        fetchGoals()
      ]);

      setSummary(sumData);
      setTransactions(txData);
      setCategories(catData);
      setGoals(goalsData);
    } catch (err) {
      console.error('Error fetching financial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();

    const onboarded = localStorage.getItem('fp_onboarded');
    if (!onboarded) {
      setShowOnboarding(true);
    }
  }, [filters]);

  const handleLogin = (userObj) => {
    setCurrentUser(userObj);
    localStorage.setItem('fp_user', JSON.stringify(userObj));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fp_user');
    setShowProfileModal(false);
  };

  const handleUpdateProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('fp_user', JSON.stringify(updatedUser));
  };

  const handleSaveInitialBudget = async ({ totalIncome, totalBudget, allocations }) => {
    try {
      const catPromises = categories.map(cat => {
        if (allocations && allocations[cat.name] !== undefined) {
          const budgetVal = parseFloat(allocations[cat.name]) || 0;
          return updateCategory(cat.id, { allocated_budget: budgetVal });
        }
        return Promise.resolve();
      });

      await Promise.all(catPromises);
      localStorage.setItem('fp_onboarded', 'true');
      setShowOnboarding(false);
      await refreshAllData();
    } catch (err) {
      console.error('Error saving initial budget allocations:', err);
      localStorage.setItem('fp_onboarded', 'true');
      setShowOnboarding(false);
      refreshAllData();
    }
  };

  const handleUpdateWalletBalance = async ({ amount, type, description }) => {
    await createTransaction({
      amount,
      type,
      description,
      date: new Date().toISOString().split('T')[0],
      category_id: null
    });
    await refreshAllData();
  };

  const handleAddTransaction = async (txData) => {
    await createTransaction(txData);
    await refreshAllData();
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
      await refreshAllData();
    }
  };

  const handleUpdateBudget = async (id, data) => {
    await updateCategory(id, data);
    await refreshAllData();
  };

  const handleCreateCategory = async (data) => {
    await createCategory(data);
    await refreshAllData();
  };

  const handleCreateGoal = async (data) => {
    await createGoal(data);
    await refreshAllData();
  };

  const handleDepositGoal = async (id, amount) => {
    await depositGoal(id, amount);
    await refreshAllData();
  };

  const handleDeleteGoal = async (id) => {
    if (window.confirm('Are you sure you want to delete this savings goal?')) {
      await deleteGoal(id);
      await refreshAllData();
    }
  };

  const handleExportCSV = () => {
    window.open('/api/transactions/export/csv', '_blank');
  };

  return (
    <div className="app-container" style={{ position: 'relative' }}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme}
        user={currentUser}
        onOpenAddTx={() => setShowQuickPayment(true)}
        onOpenOnboarding={() => setShowOnboarding(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
      />

      <main className="main-content">
        {loading && transactions.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading your financial dashboard...
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard 
                summary={summary} 
                recentTransactions={transactions}
                onNavigate={setActiveTab}
                onOpenAddTx={() => setShowQuickPayment(true)}
                onOpenUpdateWallet={() => setShowUpdateWallet(true)}
              />
            )}

            {activeTab === 'transactions' && (
              <Transactions 
                transactions={transactions}
                categories={categories}
                onAddTransaction={handleAddTransaction}
                onDeleteTransaction={handleDeleteTransaction}
                filters={filters}
                setFilters={setFilters}
                onExportCSV={handleExportCSV}
              />
            )}

            {activeTab === 'budgets' && (
              <Budgets 
                categories={categories}
                onUpdateBudget={handleUpdateBudget}
                onCreateCategory={handleCreateCategory}
              />
            )}

            {activeTab === 'goals' && (
              <Goals 
                goals={goals}
                onCreateGoal={handleCreateGoal}
                onDepositGoal={handleDepositGoal}
                onDeleteGoal={handleDeleteGoal}
              />
            )}

            {activeTab === 'insights' && (
              <Insights 
                summary={summary}
                categories={categories}
                goals={goals}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Action Button for Quick 1-Tap Payment */}
      <button 
        className="btn btn-primary"
        style={{ 
          position: 'fixed', 
          bottom: '28px', 
          right: '28px', 
          borderRadius: '30px', 
          padding: '14px 22px', 
          boxShadow: '0 8px 25px rgba(99, 102, 241, 0.5)',
          zIndex: 99
        }}
        onClick={() => setShowQuickPayment(true)}
        title="Log Payment After Purchase"
      >
        <Plus size={20} />
        <span>+ Quick Payment Entry</span>
      </button>

      {/* Starting Onboarding & Budget Setup Modal */}
      {showOnboarding && (
        <OnboardingModal 
          categories={categories}
          onSaveInitialBudget={handleSaveInitialBudget}
          onClose={() => {
            localStorage.setItem('fp_onboarded', 'true');
            setShowOnboarding(false);
          }}
        />
      )}

      {/* Update Wallet Balance Modal */}
      {showUpdateWallet && (
        <UpdateWalletModal 
          currentBalance={summary.totalBalance || 0}
          onUpdateWalletBalance={handleUpdateWalletBalance}
          onClose={() => setShowUpdateWallet(false)}
        />
      )}

      {/* Quick Payment Entry Modal */}
      {showQuickPayment && (
        <QuickPaymentModal 
          categories={categories}
          onAddTransaction={handleAddTransaction}
          onClose={() => setShowQuickPayment(false)}
        />
      )}

      {/* Login & Sign Up Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          onLogin={handleLogin}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* User Profile Modal */}
      {showProfileModal && (
        <ProfileModal 
          user={currentUser}
          summary={summary}
          onUpdateProfile={handleUpdateProfile}
          onLogout={handleLogout}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}
