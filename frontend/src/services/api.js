const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

// Fallback initial dataset for static cloud deployments
const initialStorage = {
  categories: [
    { id: 1, name: 'Pocket Money / Allowance', type: 'income', color: '#10b981', icon: 'Wallet', allocated_budget: 0, total_spent: 15000, transaction_count: 1 },
    { id: 2, name: 'Housing & Rent', type: 'expense', color: '#ef4444', icon: 'Home', allocated_budget: 5000, total_spent: 5000, transaction_count: 1 },
    { id: 3, name: 'Groceries & Daily Meals', type: 'expense', color: '#f59e0b', icon: 'Utensils', allocated_budget: 3000, total_spent: 1850, transaction_count: 2 },
    { id: 4, name: 'Transportation & Fuel', type: 'expense', color: '#3b82f6', icon: 'Car', allocated_budget: 1200, total_spent: 650, transaction_count: 1 },
    { id: 5, name: 'Utilities, Mobile & Wifi', type: 'expense', color: '#ec4899', icon: 'Zap', allocated_budget: 800, total_spent: 800, transaction_count: 1 },
    { id: 6, name: 'Outings & Leisure', type: 'expense', color: '#a855f7', icon: 'Film', allocated_budget: 1500, total_spent: 450, transaction_count: 1 },
    { id: 7, name: 'Mutual Fund SIP', type: 'expense', color: '#10b981', icon: 'TrendingUp', allocated_budget: 2500, total_spent: 2500, transaction_count: 1 },
    { id: 8, name: 'Stock & Trading Capital', type: 'expense', color: '#06b6d4', icon: 'Activity', allocated_budget: 1000, total_spent: 1000, transaction_count: 1 }
  ],
  transactions: [
    { id: 1, date: new Date().toISOString().split('T')[0], amount: 15000, type: 'income', category_id: 1, category_name: 'Pocket Money / Allowance', category_color: '#10b981', description: '[UPI] Monthly Pocket Money', status: 'completed' },
    { id: 2, date: new Date().toISOString().split('T')[0], amount: 5000, type: 'expense', category_id: 2, category_name: 'Housing & Rent', category_color: '#ef4444', description: '[UPI] Room Rent Payment', status: 'completed' },
    { id: 3, date: new Date().toISOString().split('T')[0], amount: 2500, type: 'expense', category_id: 7, category_name: 'Mutual Fund SIP', category_color: '#10b981', description: '[NetBanking] Nifty 50 Index SIP', status: 'completed' },
    { id: 4, date: new Date().toISOString().split('T')[0], amount: 1000, type: 'expense', category_id: 8, category_name: 'Stock & Trading Capital', category_color: '#06b6d4', description: '[UPI] Zerodha Trading Deposit', status: 'completed' }
  ],
  goals: [
    { id: 1, title: 'Emergency Cash Cushion', target_amount: 15000, current_amount: 9500, target_date: '2026-12-31', color: '#10b981', category: 'Safety Net' },
    { id: 2, title: 'Trading Capital Target', target_amount: 25000, current_amount: 12000, target_date: '2026-10-30', color: '#06b6d4', category: 'Investing' }
  ]
};

const getLocalData = () => {
  const local = localStorage.getItem('fp_cloud_db');
  if (!local) {
    localStorage.setItem('fp_cloud_db', JSON.stringify(initialStorage));
    return initialStorage;
  }
  return JSON.parse(local);
};

const saveLocalData = (data) => {
  localStorage.setItem('fp_cloud_db', JSON.stringify(data));
};

export const fetchSummary = async () => {
  try {
    const res = await fetch(`${API_BASE}/summary`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API backend offline, using cloud storage fallback');
  }

  // Fallback calculation
  const data = getLocalData();
  const totalIncome = data.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = data.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0;

  const budgetStatus = data.categories.filter(c => c.type === 'expense').map(c => {
    const spent = data.transactions.filter(t => t.category_id === c.id && t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return {
      id: c.id,
      name: c.name,
      color: c.color,
      allocated_budget: c.allocated_budget || 0,
      spent,
      percentage_used: c.allocated_budget > 0 ? (spent / c.allocated_budget) * 100 : 0
    };
  });

  return {
    totalBalance,
    totalIncome,
    totalExpense,
    savingsRate: parseFloat(savingsRate),
    monthlyCashflow: [
      { month: '2026-07', income: 15000, expense: 11200 },
      { month: '2026-08', income: totalIncome, expense: totalExpense }
    ],
    expenseBreakdown: budgetStatus.filter(b => b.spent > 0).map(b => ({ category: b.name, color: b.color, total_spent: b.spent })),
    budgetStatus
  };
};

export const fetchTransactions = async (filters = {}) => {
  try {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE}/transactions?${query}`);
    if (res.ok) return await res.json();
  } catch (err) {}

  const data = getLocalData();
  let list = [...data.transactions];
  if (filters.type) list = list.filter(t => t.type === filters.type);
  if (filters.search) list = list.filter(t => t.description.toLowerCase().includes(filters.search.toLowerCase()));
  return list.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const createTransaction = async (txData) => {
  try {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(txData)
    });
    if (res.ok) return await res.json();
  } catch (err) {}

  const data = getLocalData();
  const cat = data.categories.find(c => c.id === txData.category_id);
  const newTx = {
    id: Date.now(),
    ...txData,
    category_name: cat ? cat.name : 'General',
    category_color: cat ? cat.color : '#6366f1'
  };
  data.transactions.unshift(newTx);
  saveLocalData(data);
  return newTx;
};

export const deleteTransaction = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/transactions/${id}`, { method: 'DELETE' });
    if (res.ok) return await res.json();
  } catch (err) {}

  const data = getLocalData();
  data.transactions = data.transactions.filter(t => t.id !== id);
  saveLocalData(data);
  return { message: 'Deleted' };
};

export const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (res.ok) return await res.json();
  } catch (err) {}

  const data = getLocalData();
  return data.categories.map(c => {
    const spent = data.transactions.filter(t => t.category_id === c.id && t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { ...c, total_spent: spent };
  });
};

export const createCategory = async (catData) => {
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catData)
    });
    if (res.ok) return await res.json();
  } catch (err) {}

  const data = getLocalData();
  const newCat = { id: Date.now(), ...catData };
  data.categories.push(newCat);
  saveLocalData(data);
  return newCat;
};

export const updateCategory = async (id, catData) => {
  try {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catData)
    });
    if (res.ok) return await res.json();
  } catch (err) {}

  const data = getLocalData();
  const cat = data.categories.find(c => c.id === id);
  if (cat) {
    Object.assign(cat, catData);
    saveLocalData(data);
  }
  return cat;
};

export const fetchGoals = async () => {
  try {
    const res = await fetch(`${API_BASE}/goals`);
    if (res.ok) return await res.json();
  } catch (err) {}

  const data = getLocalData();
  return data.goals;
};

export const createGoal = async (goalData) => {
  try {
    const res = await fetch(`${API_BASE}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalData)
    });
    if (res.ok) return await res.json();
  } catch (err) {}

  const data = getLocalData();
  const newGoal = { id: Date.now(), ...goalData };
  data.goals.push(newGoal);
  saveLocalData(data);
  return newGoal;
};

export const depositGoal = async (id, amount) => {
  try {
    const res = await fetch(`${API_BASE}/goals/${id}/deposit`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    if (res.ok) return await res.json();
  } catch (err) {}

  const data = getLocalData();
  const goal = data.goals.find(g => g.id === id);
  if (goal) {
    goal.current_amount += parseFloat(amount);
    saveLocalData(data);
  }
  return goal;
};

export const deleteGoal = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/goals/${id}`, { method: 'DELETE' });
    if (res.ok) return await res.json();
  } catch (err) {}

  const data = getLocalData();
  data.goals = data.goals.filter(g => g.id !== id);
  saveLocalData(data);
  return { message: 'Deleted' };
};
