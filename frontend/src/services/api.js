const API_BASE = '/api';

export const fetchSummary = async () => {
  const res = await fetch(`${API_BASE}/summary`);
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
};

export const fetchTransactions = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE}/transactions?${query}`);
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
};

export const createTransaction = async (data) => {
  const res = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create transaction');
  return res.json();
};

export const deleteTransaction = async (id) => {
  const res = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete transaction');
  return res.json();
};

export const fetchCategories = async () => {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

export const createCategory = async (data) => {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
};

export const updateCategory = async (id, data) => {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update category');
  return res.json();
};

export const fetchGoals = async () => {
  const res = await fetch(`${API_BASE}/goals`);
  if (!res.ok) throw new Error('Failed to fetch goals');
  return res.json();
};

export const createGoal = async (data) => {
  const res = await fetch(`${API_BASE}/goals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create goal');
  return res.json();
};

export const depositGoal = async (id, amount) => {
  const res = await fetch(`${API_BASE}/goals/${id}/deposit`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  });
  if (!res.ok) throw new Error('Failed to deposit into goal');
  return res.json();
};

export const deleteGoal = async (id) => {
  const res = await fetch(`${API_BASE}/goals/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete goal');
  return res.json();
};
