import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Budgets from './components/Budgets';
import Goals from './components/Goals';
import Insights from './components/Insights';

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

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);

  // Core Data States
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

  // Transaction Filters
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
  }, [filters]);

  // Handlers
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
    <div className="app-container">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme}
        onOpenAddTx={() => setActiveTab('transactions')}
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
                onOpenAddTx={() => setActiveTab('transactions')}
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
    </div>
  );
}
